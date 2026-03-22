# CLAUDE.md

This file provides guidance to Claude Code when working with the Aecury worldbuilding project.

## Project Overview

**Aecury** is a D&D worldbuilding project consisting of:

1. **Source Data** (`../aecury/`):
   - World Anvil JSON export (440+ articles in `worlds/Aecury/`)
   - Conversion scripts (`convert.py`, `add_related.py`)
   - Source documents (`orishahns-guide.docx`)
   - PAL MCP Server for multi-model AI orchestration

2. **Published Site** (this directory):
   - Quartz framework (`quartz/`)
   - Markdown articles (`content/`)
   - Custom plugins for maps and timelines
   - Built site in `public/`

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

## Model & Tool Usage

### Claude Model Selection

- **Claude Haiku** (free in VS Code) - Use for implementation tasks, file edits, routine work
- **Claude Sonnet** - Primary model for most work, orchestration, planning
- **Claude Opus** - Reserve for complex reasoning, architectural decisions

When user says "go brr" or similar, Haiku can handle straightforward implementation.

### PAL MCP - Multi-Model AI Orchestration

This project has **PAL MCP Server** configured, enabling Claude to orchestrate multiple AI models within a single conversation.

**Available PAL Tools:**
- `chat` - Brainstorm with other models (Gemini Pro, GPT-5, O3, local Ollama)
- `thinkdeep` - Extended reasoning for complex problems
- `codereview` - Multi-model code reviews with severity levels
- `precommit` - Validate changes before committing
- `debug` - Systematic debugging with hypothesis tracking
- `planner` - Break down complex projects into structured plans
- `consensus` - Get expert opinions from multiple models
- `apilookup` - Fetch current API/SDK docs (prevents outdated training data)
- `challenge` - Critical analysis to prevent "you're absolutely right" responses

**Ollama Model Selection (via PAL):**

Based on testing (see `test-model-comparison.md`):
- **llama3.1:8b** - Straightforward implementation, minimalist, no over-engineering
- **deepseek-r1:7b** - Second opinions, validation, extended reasoning
- **qwen2.5:7b** - Good general capability, faster than 14b
- **qwen2.5:14b** - Better reasoning, use when quality matters over speed

**When to Use PAL:**
- **Second opinions** - Get validation on uncertain approaches
- **Consensus building** - Multiple models for architectural decisions
- **Large context needs** - Gemini has 1M token context window
- **Straightforward implementation** - Delegate simple tasks to llama3.1:8b
- **Current documentation** - Use `apilookup` for latest API docs
- **Code reviews** - Multi-model validation with `codereview`

**Example PAL Usage:**
```
"Use chat with llama3.1:8b to implement this simple helper function"
"Get consensus from deepseek-r1 and qwen2.5:14b on this architecture approach"
"Use apilookup to find the current Timeline.js v3 API for event configuration"
```

**PAL Best Practices:**
- **Claude (Sonnet) does the complex reasoning** - architecture, debugging, planning
- **Delegate straightforward tasks** to local Ollama models (llama3.1:8b)
- **Get second opinions** when uncertain or validating approaches
- Use `apilookup` to prevent outdated training data issues
- Conversation context flows between models seamlessly

## Efficiency & Collaboration Ethos

**Core Principle:** Treat the user as demanding upper management - get approval before burning tokens on uncertain work.

### Token & Time Saving

1. **Use Haiku for implementation** - Simple component creation, CSS styling, routine edits
2. **Use subagents for exploration** - Don't waste Opus tokens reading files that can be delegated
3. **Use PAL for validation** - Get second opinions on architecture before writing code
4. **Ask rather than guess** - On design questions, clarify with user instead of making assumptions

### User Checkpoints

Loop the user in at key decision points BEFORE proceeding:

| Checkpoint | What to Show | Why |
|------------|-------------|-----|
| After research/planning | Field list, approach options | Confirm direction before implementation |
| After component skeleton | Basic structure, data flow | Confirm architecture before styling |
| After styling draft | Live preview or description | Confirm visual approach |
| Before major refactors | Proposed changes, tradeoffs | Get explicit approval |

**Rule:** If uncertain about design direction → ASK. Don't burn tokens guessing.

### Avoid Common Wastes

- Don't over-engineer simple features
- Don't add features not requested
- Don't create abstractions for one-time operations
- Don't guess at requirements - clarify first
- Don't redo work - checkpoint early and often

## Source Data Structure

### World Anvil Articles

Articles in `../aecury/worlds/Aecury/` are JSON files containing:
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

To update from World Anvil export:
```bash
cd ../aecury
python convert.py
```

This converts JSON articles to markdown in the appropriate structure.

### Git Workflow

- Current branch: `fix/timeline-ids`
- When committing: Follow existing commit message style
- Do NOT include Co-Authored-By lines (user's git config handles attribution)

## Development Environment

### SSH Access

Remote access from laptop to desktop PC:
- **Desktop PC IP**: 192.168.86.197
- **Command**: `ssh exman@192.168.86.197`
- **Port**: 22 (OpenSSH Server)
- **Authentication**: SSH key (no password required)

## Common Tasks

### Analyzing Article Relationships

To understand how articles relate:
1. Check `relations` object in World Anvil JSON
2. `parent` relation = containing location/category
3. `children` relation = contained articles
4. Other relations: `maps`, `items`, `people`, etc.

### Finding Articles by Category

Articles stored in `../aecury/worlds/Aecury/articles/<CategoryName>/`

### Adding New Features

For non-trivial features:
1. Use PAL `planner` tool to break down the work
2. Get `consensus` from multiple models if architecture unclear
3. Implement systematically
4. Use `precommit` to validate before committing

## Notes for Future Work

- Articles can have nested/hierarchical relationships through `parent` and `children`
- `isDraft` and `isWip` flags indicate unfinished articles
- `subscribergroups` indicate access groups or campaigns
- `sections` vary by article template type
- Article slugs and IDs are stable identifiers for cross-referencing
- Leaflet and Timeline plugins use slug-based IDs for proper initialization
