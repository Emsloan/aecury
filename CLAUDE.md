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

- `quartz/plugins/transformers/leaflet.ts` - Leaflet map support via ```leaflet code blocks
