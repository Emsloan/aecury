# CLAUDE.md

This file provides guidance to Claude Code when working with the Aecury worldbuilding project.

## Lessons Learned - READ THIS FIRST

### Source of Truth

**World Anvil Export (permanent location):**
```
C:\Users\exman\Documents\aecury-site\source\world-anvil-export-2023-08-30\
└── worlds/Aecury/articles/   ← 427 JSON files, canonical source
```

**Converter:**
```
C:\Users\exman\Documents\aecury-site\convert_wa_json.py
```
Reads from: `source\world-anvil-export-2023-08-30\worlds\Aecury\articles\`
Outputs to: `content\`

**Other source material:**
- `C:\Users\exman\Documents\aecury\aecury-export.pdf` - PDF export (472MB), may have content missing from JSON/HTML
- `C:\Users\exman\Documents\aecury\orishahns-guide.docx` - Source document

**Before converting content, VERIFY the source contains what you expect.**

### Failure Patterns to Avoid

1. **Claiming victory without verification** - "Fixed!" means nothing without proving it works. Check the actual output, not just that the code ran.

2. **Fixing symptoms instead of root causes** - When content is missing, don't offer to manually add it. Ask: WHY is the converter not extracting it? The machine is broken.

3. **Confidently stating things that contradict previous statements** - If you said X before and now say not-X, acknowledge the contradiction and investigate rather than bulldozing forward.

4. **Using relative paths with a human** - The user is on Windows looking at Explorer. Use full paths: `C:\Users\exman\Documents\aecury-site\content\` not `../aecury/`.

5. **Leaving uncommitted artifacts** - Every experimental approach creates files. These MUST be committed to branches (even if not pushed) so git history shows the trail of attempts. Without this, future sessions can't see "we tried X, it failed, we tried Y."

### Artifact Tracking Protocol

When trying different approaches (PDF parsing vs JSON parsing, different converters, etc.):

1. **Before starting**: Check `git status` for uncommitted files from previous attempts
2. **Create a branch** for the experiment: `git checkout -b experiment/pdf-parsing`
3. **Commit artifacts** even if messy - the history matters more than cleanliness
4. **Document what was tried** in commit messages: what approach, what failed, what was learned

The goal: Any future session can run `git log --oneline` and see the trail of attempts, not a clean history that hides the exploration.

### Verification Before Claiming Success

Before saying something is "fixed" or "working":

1. **Read the actual output** - not just "the script ran", but "here's what the file contains now"
2. **Compare to source** - does the output match what's in the source data?
3. **Test the user's specific example** - if they mentioned Yuan-ti, check Yuan-ti specifically
4. **Count/measure** - "311 stubs before, 233 after" not "many articles now have content"

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

## Model & Tool Usage

### Claude Model Selection

- **Claude Haiku** (free in VS Code) - Use for implementation tasks, file edits, routine work
- **Claude Sonnet** - Primary model for most work, orchestration, planning
- **Claude Opus** - Reserve for complex reasoning, architectural decisions

When user says "go brr" or similar, Haiku can handle straightforward implementation.

### Ouroboros - Specification-First Development

This project uses **Ouroboros** (https://github.com/Q00/ouroboros), a specification-first AI development system. It applies Socratic questioning and ontological analysis to clarify requirements before writing code.

**Key Commands (run inside Claude Code session):**
- `ooo interview "task description"` - Socratic questioning to expose hidden assumptions
- `ooo seed` - Crystallize answers into immutable specification
- `ooo run` - Execute via Double Diamond decomposition
- `ooo evaluate` - 3-stage verification gate
- `ooo status` - Drift detection + session tracking

**Philosophy:** "Most AI coding fails at the input, not the output. The bottleneck isn't AI capability. It's human clarity."

### PAL MCP - Multi-Model AI Orchestration

PAL MCP is configured for multi-model orchestration via Ollama.

**Available PAL Tools:**
- `chat` - Brainstorm with other models (local Ollama)
- `thinkdeep` - Extended reasoning for complex problems
- `codereview` - Multi-model code reviews with severity levels
- `debug` - Systematic debugging with hypothesis tracking
- `consensus` - Get expert opinions from multiple models
- `apilookup` - Fetch current API/SDK docs

**Ollama Models:**
- **llama3.1:8b** - Straightforward implementation
- **deepseek-r1:7b** - Second opinions, validation
- **qwen2.5:14b** - Better reasoning when quality matters

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

### Frontmatter Field Analysis (TODO)

**Goal**: Create comprehensive templates for auto-tagging/fleshing out articles

**Action needed**:
- Analyze ALL possible frontmatter fields across all article types (Location, Organization, Person, etc.)
- Document field usage patterns by type
- Create templates showing which fields are common/required for each type
- Use this for auto-tagging system or article completion goals
- Examples: Organization has Leader/Ethnicities/Deities, Location has Parent/Children/Type
