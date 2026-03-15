# Haiku Tasks

Grunt work for Claude Haiku. Read `CLAUDE.md` first for guidelines.

## Task 1: Add Related sections to stub articles

Many stub articles (under 300 chars) lack `## Related` sections. Add them.

**How:**
1. Find stub articles: `find content -name "*.md" -size -300c`
2. For each, check if it has `## Related` section
3. If missing, add based on obvious wikilinks in the article

**Example:**
```markdown
## Related

- [[Intrinsics]]
- [[Orishahn's Guide to the Primordials and Intrinsics]]
```

## Task 2: Standardize frontmatter tags

Some articles have inconsistent tags. Standardize:
- `deity` not `god`
- `location` not `place`
- `person` not `character`

**How:**
1. `grep -r "tags:.*god" content/`
2. Replace with `deity`
3. Same for other inconsistencies

## Task 3: Find orphan articles

Find articles with no incoming links (nothing links TO them).

**How:**
1. List all article titles
2. Grep for `[[Title]]` across all files
3. Report which have zero incoming links

Output to `ORPHANS.md` for review.

---

When done with a task, commit to `haiku-tasks` branch. Do NOT push.
