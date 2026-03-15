# Aecury World Wiki

A collaborative worldbuilding wiki for the Aecury campaign setting.

**Live site:** https://emsloan.github.io/aecury/

## Contributing

### Quick Start

1. **Clone the repo:**
   ```bash
   git clone https://github.com/Emsloan/aecury.git
   cd aecury
   ```

2. **Edit articles** in the `content/` folder (they're just Markdown files)

3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Updated [article name]"
   git push
   ```

The site auto-deploys when you push to `main`. Changes appear within ~2 minutes.

### Using Obsidian (Recommended)

For the best editing experience with graph view and wikilinks:

1. Clone the repo (see above)
2. Open the `content/` folder as an Obsidian vault
3. Edit articles with full wikilink support
4. Commit and push when done

### Article Format

Each article is a Markdown file with YAML frontmatter:

```markdown
---
title: "Article Title"
type: Location
parent: "[[Parent Article]]"
tags: [location, region]
---

Article content goes here. Link to other articles with [[wikilinks]].

## Related
- [[Related Article 1]]
- [[Related Article 2]]
```

### Creating New Articles

1. Create a new `.md` file in `content/`
2. Add frontmatter with at least `title` and `type`
3. Write content using `[[wikilinks]]` to link to other articles
4. Commit and push

### Article Types

Common types: `Location`, `Person`, `Organization`, `Item`, `Plot`, `Species`, `Deity`

### Tags

Use tags to categorize:
- Entity type: `location`, `person`, `organization`
- Status: `wip`, `draft`
- Regions: `historia`, `kravral`, `wahasha`

## AI Usage & Attribution

This wiki uses AI tools (Claude) for:
- Transcribing content from notes, PDFs, diagrams
- Formatting and organizing existing lore
- Finding inconsistencies or missing links

### How to identify AI contributions

- **Quoted blocks** with source attribution (e.g., `From Orishahn's Guide:`) = transcribed from source
- **`*Potential expansion:*`** notes = AI-flagged gaps/questions
- **`*AI-generated content, pending review*`** footer = AI created when requested

Canonical lore comes from the worldbuilder. AI assists with transcription and organization, not creation.

### For AI contributors

See `CLAUDE.md` for guidelines. Key rule: **transcribe, don't create**.

## Local Preview

To preview the site locally before pushing:

```bash
npm install
npx quartz build --serve
```

Then open http://localhost:8080

## Questions?

Open an issue or reach out to the repo owner.
