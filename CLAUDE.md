# CLAUDE.md

@C:/Users/exman/.claude/shared.md

This file provides guidance to Claude Code when working with the Aecury worldbuilding project.

## Quick Reference

### Source of Truth

**The markdown files in `content/` are canon.** The World Anvil export was the origin of the migration — it's done. Do not treat the WA JSON as authoritative. If a lore detail isn't in `content/`, it doesn't exist yet.

**Other reference material (not canonical, informational only):**
- `C:\Users\exman\Documents\aecury\aecury-export.pdf` - PDF export backup
- `C:\Users\exman\Documents\aecury\orishahns-guide.docx` - Source document

### Common Sense

- **Verify before claiming success** - Read the actual output
- **Use full Windows paths** - `C:\Users\exman\Documents\aecury-site\content\` not relative paths
- **Check git status before starting** - Know what's uncommitted from previous work

## Project Overview

**Aecury** is a D&D worldbuilding project. All project files are in `C:\Users\exman\Documents\aecury-site\`:

- `source/world-anvil-export-2023-08-30/` - World Anvil JSON export (427 articles)
- `content/` - Converted markdown articles (Obsidian vault)
- `quartz/` - Quartz static site framework
- `quartz/plugins/transformers/leaflet.ts` - Interactive maps
- `quartz/plugins/transformers/timeline.ts` - Interactive timelines
- `convert_wa_json.py` - JSON to markdown converter
- `public/` - Built static site

**Related files (external):**
- `C:\Users\exman\Documents\aecury\aecury-export.pdf` - PDF export backup
- `C:\Users\exman\Documents\aecury\orishahns-guide.docx` - Source document

## Lore Handling - CRITICAL

**Never speculate or invent lore.** When working with Aecury worldbuilding content:

1. **Transfer exact info** - Only write what is explicitly stated in sources
2. **Clarify, don't add** - Ask questions rather than inventing answers
3. **Frame unknowns as questions** - If something is unclear, identify it as a question (e.g., "Questions: Why was X imprisoned?") rather than making up explanations
4. **Only create when explicitly asked** - Do not proactively generate lore, theories, or "scholar speculation"

**Wrong:** "The azure color may be connected to binding magic... Some scholars theorize..."
**Correct:** "Inferniax is imprisoned in Iadath. *Questions: Is the azure color related?*"

## AI Attribution - REQUIRED

When AI contributes to articles, mark it clearly:

1. **Transcribed content**: Add source attribution (e.g., "From Orishahn's Guide:")
2. **AI-assisted formatting**: No special marking needed
3. **AI-generated content** (when explicitly requested): Add footer:
   ```
   ---
   *AI-generated content, pending review*
   ```

Readers should always know what's canonical vs AI-contributed.

## Image Attribution - REQUIRED

All images need metadata tracking:

1. **Artist attribution**: Credit the artist/source
2. **AI-generated images**: Mark with:
   - Model used (DALL-E, Midjourney, Stable Diffusion, etc.)
   - Prompt (if available)
   - Date generated
   - Follow NYT/NPR AI image labeling standards
3. **Found art** (for characters/monsters/locations): Credit source, note if used as reference

Suggested frontmatter for articles with images:
```yaml
images:
  - file: "image.jpg"
    artist: "Artist Name"
    source: "ArtStation/DeviantArt/etc"
    ai_generated: false
  - file: "ai-portrait.png"
    ai_generated: true
    model: "Midjourney v6"
    prompt: "fantasy elf warrior..."
```

## Tools Available

**When uncertain, ask** - Don't burn tokens guessing at design decisions

## Source Data Structure

### World Anvil Articles

Articles in `C:\Users\exman\Documents\aecury-site\source\world-anvil-export-2023-08-30\worlds\Aecury\articles\` are JSON files containing:
- **Core metadata**: id, title, slug, state (public/private), isDraft, isWip
- **Entity information**: entityClass (Location, Character, Organization, etc.)
- **Content**: contentParsed (HTML), sections (custom fields by template)
- **Relations**: Links to related articles (children, parent, maps, items, people)
- **Authorship**: author, dates (creation, update, publication)

### Category Structure

Articles organized hierarchically:
- **Top-level categories**: Continents, Nation, Nobles, Oceans, Planets, Uncategorized Articles
- **Nested categories**: Some have subcategories (e.g., Planets/Aecury, Nobles/EverRealm)
- **Category metadata**: Each category has category-metadata.json

### Common Entity Classes

- **Location**: Continents, regions, settlements, landmarks
- **Character**: People in the world
- **Organization**: Groups, empires, factions
- **Item**: Physical objects with significance
- **MilitaryConflict**: Wars and battles
- **HistoricalEntry**: Events and historical records

## Site Structure

### Directory Layout

- `content/` - Markdown articles (Obsidian vault)
  - Converted from World Anvil JSON
  - Uses `[[wikilinks]]` for internal links
- `quartz/` - Quartz framework and custom plugins
  - `quartz/plugins/transformers/leaflet.ts` - Interactive maps
  - `quartz/plugins/transformers/timeline.ts` - Interactive timelines
- `quartz.config.ts` - Site configuration
- `public/` - Built static site (generated by `npx quartz build`)

### Content Format

Articles use YAML frontmatter:
```yaml
---
title: "Article Title"
type: Location
tags: [location, continent]
state: public
created: 2024-03-16
updated: 2024-03-16
---
```

Use `[[wikilinks]]` for internal links (Obsidian/Quartz format).

## Custom Plugins

### Leaflet Maps

`quartz/plugins/transformers/leaflet.ts` - Interactive maps via \`\`\`leaflet code blocks

```leaflet
lat: 40
lng: -100
zoom: 4
markers:
- [40.7, -74.0, "New York", "/Article-Link"]
```

**Important:** Leaflet maps use slug-based IDs for proper initialization.

### Timeline.js

`quartz/plugins/transformers/timeline.ts` - Interactive timelines via \`\`\`timeline code blocks

```timeline
title: "Timeline Title"
events:
- year: -5000
  headline: "Event Name"
  text: "Description"
  group: "Era Name"
- year: -4500
  headline: "Another Event"
  text: "More description"
```

**Important:** Timeline events use slug-based IDs for proper tracking.

## Development Workflow

### Making Changes to Site

1. **Edit content**: Modify markdown files in `content/`
2. **Edit plugins**: Modify TypeScript files in `quartz/plugins/`
3. **Build site**: `npx quartz build`
4. **Preview**: `npx quartz serve` (local development server)
5. **Deploy**: Commit and push (GitHub Actions builds automatically)

### Converting World Anvil Data

To regenerate content from World Anvil export:
```bash
cd C:\Users\exman\Documents\aecury-site
python convert_wa_json.py
```

Reads from: `source\world-anvil-export-2023-08-30\worlds\Aecury\articles\`
Outputs to: `content\`

### Git Workflow

- Follow existing commit message style
- Don't add Co-Authored-By lines

## SSH Access

Desktop PC: `ssh exman@192.168.86.197`

## Common Tasks

### Analyzing Article Relationships

To understand how articles relate:
1. Check `relations` object in World Anvil JSON
2. `parent` relation = containing location/category
3. `children` relation = contained articles
4. Other relations: `maps`, `items`, `people`, etc.

### Finding Articles by Category

JSON articles stored in:
```
C:\Users\exman\Documents\aecury-site\source\world-anvil-export-2023-08-30\worlds\Aecury\articles\<CategoryName>\
```

### Adding New Features

For non-trivial features:
1. Use Ouroboros `ooo interview` to clarify requirements first
2. Use `ooo seed` to create specification
3. Use `ooo run` to execute with decomposition
4. Use `ooo evaluate` to verify

## Notes for Future Work

- Articles can have nested/hierarchical relationships through `parent` and `children`
- `isDraft` and `isWip` flags indicate unfinished articles
- `subscribergroups` indicate access groups or campaigns
- `sections` vary by article template type
- Article slugs and IDs are stable identifiers for cross-referencing
- Leaflet and Timeline plugins use slug-based IDs for proper initialization

### TODO: Frontmatter Field Analysis

If needed: Analyze frontmatter fields across article types to create templates for auto-tagging
