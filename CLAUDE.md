# CLAUDE.md

This file provides guidance to Claude Code when working with this Quartz wiki for the Aecury worldbuilding project.

## Model Usage

- **Claude Haiku** (free in VS Code) - Use for implementation tasks, file edits, routine work
- **Claude Opus/Sonnet** - Reserve for complex reasoning, planning, research

When user says "go brr" or similar, Haiku can handle straightforward implementation.

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

## Lore Handling - CRITICAL

**Never speculate or invent lore.** When working with Aecury worldbuilding content:

1. **Transfer exact info** - Only write what is explicitly stated in sources
2. **Clarify, don't add** - Ask questions rather than inventing answers
3. **Frame unknowns as questions** - If something is unclear, identify it as a question (e.g., "Questions: Why was X imprisoned?") rather than making up explanations
4. **Only create when explicitly asked** - Do not proactively generate lore, theories, or "scholar speculation"

**Wrong:** "The azure color may be connected to binding magic... Some scholars theorize..."
**Correct:** "Inferniax is imprisoned in Iadath. *Questions: Is the azure color related?*"

## Project Structure

- `content/` - Markdown articles (Obsidian vault)
- `quartz/` - Quartz framework and plugins
- `quartz.config.ts` - Site configuration

## Content Format

Articles use YAML frontmatter:
```yaml
---
title: "Article Title"
type: Location
tags: [location, continent]
---
```

Use `[[wikilinks]]` for internal links.

## Custom Plugins

### Leaflet Maps
`quartz/plugins/transformers/leaflet.ts` - Interactive maps via ```leaflet code blocks

```leaflet
lat: 40
lng: -100
zoom: 4
markers:
- [40.7, -74.0, "New York", "/Article-Link"]
```

### Timeline.js
`quartz/plugins/transformers/timeline.ts` - Interactive timelines via ```timeline code blocks

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
