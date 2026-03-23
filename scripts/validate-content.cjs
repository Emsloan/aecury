#!/usr/bin/env node
/**
 * Content Validator for Quartz sites
 * Validates timeline blocks have events and map markers link to existing files.
 * Run BEFORE build to catch issues early. Exits with code 1 if any errors.
 */

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content');

// Find all markdown files
function findMarkdownFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findMarkdownFiles(fullPath, files);
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Extract code blocks of a specific type from markdown
function extractCodeBlocks(content, type) {
  const blocks = [];
  const regex = new RegExp('```' + type + '\\n([\\s\\S]*?)```', 'g');
  let match;
  while ((match = regex.exec(content)) !== null) {
    blocks.push(match[1]);
  }
  return blocks;
}

// Parse timeline block and check for events
function validateTimeline(block, filePath) {
  const errors = [];

  // Check for events: line followed by actual events
  const hasEventsKey = block.includes('events:');
  if (!hasEventsKey) {
    errors.push(`Timeline block missing 'events:' key`);
    return errors;
  }

  // Check for at least one event (- year: pattern)
  const eventPattern = /- year:/;
  if (!eventPattern.test(block)) {
    errors.push(`Timeline block has no events (missing '- year:' entries)`);
  }

  return errors;
}

// Parse leaflet block and extract marker links
function extractMarkerLinks(block) {
  const links = [];
  // Match marker arrays like: - [y, x, "Label", "/link"]
  const markerPattern = /- \[[^\]]+,\s*"[^"]*",\s*"([^"]+)"\]/g;
  let match;
  while ((match = markerPattern.exec(block)) !== null) {
    links.push(match[1]);
  }
  return links;
}

// Build alias map from all content files
function buildAliasMap(files) {
  const aliasToSlug = new Map();

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');

    // Extract slug from frontmatter
    const slugMatch = content.match(/^slug:\s*["']?([^"'\n]+)["']?/m);
    const slug = slugMatch ? slugMatch[1].trim() : null;

    // Extract title from frontmatter
    const titleMatch = content.match(/^title:\s*["']?([^"'\n]+)["']?/m);
    const title = titleMatch ? titleMatch[1].trim() : null;

    // Extract aliases from frontmatter
    const aliasSection = content.match(/^aliases:\s*\n((?:\s+-\s*"[^"]+"\n?)+)/m);

    // Use slug or derive from filename
    const fileSlug = slug || path.basename(file, '.md');

    // Map title to slug
    if (title) {
      aliasToSlug.set(title.toLowerCase(), fileSlug);
    }

    // Map filename (without extension) to slug
    aliasToSlug.set(path.basename(file, '.md').toLowerCase(), fileSlug);

    // Map slug to itself
    aliasToSlug.set(fileSlug.toLowerCase(), fileSlug);

    // Map each alias to slug
    if (aliasSection) {
      const aliasLines = aliasSection[1].matchAll(/- ["']?([^"'\n]+)["']?/g);
      for (const [, alias] of aliasLines) {
        aliasToSlug.set(alias.trim().toLowerCase(), fileSlug);
      }
    }
  }

  return aliasToSlug;
}

// Check if a link would resolve to an existing file
function linkResolves(link, aliasMap) {
  // Strip leading slash and convert to lowercase for comparison
  let normalized = link.startsWith('/') ? link.slice(1) : link;
  normalized = normalized.toLowerCase();

  // Direct slug match
  if (aliasMap.has(normalized)) {
    return true;
  }

  // Convert URL slug to possible file names
  // e.g., "/The-Lungs" -> "the-lungs", "the lungs"
  const variants = [
    normalized,
    normalized.replace(/-/g, ' '),
    normalized.replace(/-/g, ''),
  ];

  for (const variant of variants) {
    if (aliasMap.has(variant)) {
      return true;
    }
  }

  return false;
}

// Main
function main() {
  console.log('🔍 Validating content...\n');

  if (!fs.existsSync(CONTENT_DIR)) {
    console.error('❌ content/ directory not found.');
    process.exit(1);
  }

  const mdFiles = findMarkdownFiles(CONTENT_DIR);
  console.log(`Found ${mdFiles.length} markdown files to validate\n`);

  const errors = [];

  // Build alias map for link resolution
  const aliasMap = buildAliasMap(mdFiles);

  for (const file of mdFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = path.relative(CONTENT_DIR, file);

    // Validate timeline blocks
    const timelineBlocks = extractCodeBlocks(content, 'timeline');
    for (let i = 0; i < timelineBlocks.length; i++) {
      const blockErrors = validateTimeline(timelineBlocks[i], file);
      for (const err of blockErrors) {
        errors.push({
          file: relativePath,
          type: 'timeline',
          message: err,
        });
      }
    }

    // Validate leaflet map marker links
    const leafletBlocks = extractCodeBlocks(content, 'leaflet');
    for (let i = 0; i < leafletBlocks.length; i++) {
      const markerLinks = extractMarkerLinks(leafletBlocks[i]);
      for (const link of markerLinks) {
        if (!linkResolves(link, aliasMap)) {
          errors.push({
            file: relativePath,
            type: 'map',
            message: `Marker link "${link}" does not resolve to any content file`,
          });
        }
      }
    }
  }

  if (errors.length > 0) {
    console.error(`❌ Found ${errors.length} content validation errors:\n`);

    // Group by file
    const byFile = {};
    for (const err of errors) {
      if (!byFile[err.file]) byFile[err.file] = [];
      byFile[err.file].push(err);
    }

    for (const [file, fileErrors] of Object.entries(byFile)) {
      console.error(`📄 ${file}`);
      for (const err of fileErrors) {
        console.error(`   [${err.type}] ${err.message}`);
      }
      console.error('');
    }

    process.exit(1);
  }

  console.log(`✅ All content validated successfully!\n`);
  console.log(`   - Checked ${mdFiles.length} files`);
  console.log(`   - All timeline blocks have events`);
  console.log(`   - All map marker links resolve\n`);
  process.exit(0);
}

main();
