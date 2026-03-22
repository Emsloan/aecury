#!/usr/bin/env node
/**
 * Link Checker for Quartz sites
 * Validates all internal links in built HTML files resolve correctly.
 * Exits with code 1 if any broken links found (fails CI).
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Read baseUrl from quartz.config.ts to handle subpath sites (e.g., /aecury/)
function getBaseUrlSubpath() {
  try {
    const configPath = path.join(__dirname, '..', 'quartz.config.ts');
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const match = configContent.match(/baseUrl:\s*["']([^"']+)["']/);
    if (match) {
      const url = new URL(`https://${match[1]}`);
      return url.pathname; // e.g., "/aecury" or "/"
    }
  } catch (e) {
    // Ignore errors, default to no subpath
  }
  return '/';
}

const BASE_SUBPATH = getBaseUrlSubpath();

// Collect all HTML files
function findHtmlFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findHtmlFiles(fullPath, files);
    } else if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Extract internal links from HTML (excluding script content)
function extractInternalLinks(htmlContent, filePath) {
  const links = [];

  // Remove script tags to avoid matching JS code
  const noScripts = htmlContent.replace(/<script[\s\S]*?<\/script>/gi, '');

  // Match href="..." in anchor tags only
  const anchorRegex = /<a[^>]+href="([^"#]+)"[^>]*>/gi;
  let match;
  while ((match = anchorRegex.exec(noScripts)) !== null) {
    const href = match[1];

    // Skip external links, mailto, javascript, data URIs
    if (href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('javascript:') ||
        href.startsWith('data:') ||
        href === '' ||
        href.includes("'") ||  // Skip JS string concatenation artifacts
        href.includes('+')) {
      continue;
    }

    links.push({ href, source: filePath });
  }
  return links;
}

// Resolve a link to a file path
function resolveLink(href, sourceFile) {
  const sourceDir = path.dirname(sourceFile);

  // Handle relative links
  let targetPath;
  if (href.startsWith('./')) {
    targetPath = path.join(sourceDir, href.slice(2));
  } else if (href.startsWith('/')) {
    // Strip baseUrl subpath if present (e.g., /aecury/foo -> /foo)
    let cleanHref = href;
    if (BASE_SUBPATH !== '/' && href.startsWith(BASE_SUBPATH)) {
      cleanHref = href.slice(BASE_SUBPATH.length) || '/';
    }
    targetPath = path.join(PUBLIC_DIR, cleanHref.slice(1));
  } else {
    targetPath = path.join(sourceDir, href);
  }

  // Normalize path
  targetPath = path.normalize(targetPath);

  // Check if it's a directory (needs index.html)
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
    targetPath = path.join(targetPath, 'index.html');
  }

  // Add .html if no extension and not a static file
  const ext = path.extname(targetPath);
  if (!ext) {
    targetPath += '.html';
  }

  return targetPath;
}

// Check if a link target exists
function linkExists(href, sourceFile) {
  // Static assets that exist
  if (href.endsWith('.css') || href.endsWith('.js') || href.endsWith('.png') ||
      href.endsWith('.jpg') || href.endsWith('.svg') || href.endsWith('.ico') ||
      href.endsWith('.xml') || href.endsWith('.webp') || href.endsWith('.woff') ||
      href.endsWith('.woff2') || href.endsWith('.ttf')) {
    const resolved = resolveLink(href, sourceFile);
    return fs.existsSync(resolved);
  }

  const resolved = resolveLink(href, sourceFile);
  return fs.existsSync(resolved);
}

// Main
function main() {
  console.log('🔍 Checking internal links...\n');

  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error('❌ public/ directory not found. Run build first.');
    process.exit(1);
  }

  const htmlFiles = findHtmlFiles(PUBLIC_DIR);
  console.log(`Found ${htmlFiles.length} HTML files to check\n`);

  const brokenLinks = [];
  const checkedLinks = new Map(); // href -> exists

  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const links = extractInternalLinks(content, file);

    for (const { href, source } of links) {
      // Cache lookups
      const cacheKey = `${path.dirname(source)}:${href}`;
      let exists;

      if (checkedLinks.has(cacheKey)) {
        exists = checkedLinks.get(cacheKey);
      } else {
        exists = linkExists(href, source);
        checkedLinks.set(cacheKey, exists);
      }

      if (!exists) {
        brokenLinks.push({
          source: path.relative(PUBLIC_DIR, source),
          href,
        });
      }
    }
  }

  // Dedupe broken links
  const uniqueBroken = [];
  const seen = new Set();
  for (const link of brokenLinks) {
    const key = `${link.source}:${link.href}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueBroken.push(link);
    }
  }

  if (uniqueBroken.length > 0) {
    console.error(`❌ Found ${uniqueBroken.length} broken links:\n`);

    // Group by broken href to see patterns
    const byHref = {};
    for (const link of uniqueBroken) {
      if (!byHref[link.href]) byHref[link.href] = [];
      byHref[link.href].push(link.source);
    }

    // Sort by frequency
    const sorted = Object.entries(byHref).sort((a, b) => b[1].length - a[1].length);

    // Show top broken links
    let shown = 0;
    for (const [href, sources] of sorted) {
      if (shown >= 30) {
        console.error(`\n... and ${sorted.length - 30} more broken link targets`);
        break;
      }
      console.error(`❌ ${href}`);
      console.error(`   Found in ${sources.length} file(s): ${sources.slice(0, 3).join(', ')}${sources.length > 3 ? '...' : ''}`);
      shown++;
    }

    console.error('\n');
    process.exit(1);
  }

  console.log(`✅ All internal links are valid!\n`);
  process.exit(0);
}

main();
