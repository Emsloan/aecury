#!/usr/bin/env python3
"""
World Anvil JSON to Markdown Converter
Converts World Anvil JSON export to Quartz-compatible markdown.
"""

import json
import re
import html as html_module
from pathlib import Path
from bs4 import BeautifulSoup
from typing import Dict, List, Any

# Paths
INPUT_DIR = Path('../aecury/worlds/Aecury/articles')
OUTPUT_DIR = Path('content')


def escape_yaml(text: str) -> str:
    """Escape quotes in YAML strings."""
    return text.replace('\\', '\\\\').replace('"', '\\"')


def sanitize_alias(text: str) -> str:
    """Remove characters that can't be in filenames (for alias redirects)."""
    # Remove characters invalid in Windows/Unix filenames
    invalid_chars = '<>:"/\\|?*'
    result = text
    for char in invalid_chars:
        result = result.replace(char, '')
    return result.strip()


def parse_tags(tags_string: str) -> List[str]:
    """Parse comma-separated tags."""
    if not tags_string:
        return []
    return [tag.strip() for tag in tags_string.split(',') if tag.strip()]


def convert_wikilinks(text: str) -> str:
    """Convert @[Link Text](type:id) to [[Link Text]]."""
    # Pattern: @[text](type:uuid)
    pattern = r'@\[([^\]]+)\]\([^:]+:[^\)]+\)'
    return re.sub(pattern, r'[[\1]]', text)


def convert_html_links(html: str) -> str:
    """Convert HTML links to wikilinks."""
    soup = BeautifulSoup(html, 'html.parser')

    # Convert World Anvil article links
    for link in soup.find_all('a', attrs={'data-article-id': True}):
        link_text = link.get_text()
        # Replace <a> tag with [[wikilink]]
        link.replace_with(f'[[{link_text}]]')

    # Convert external links (keep as markdown links)
    for link in soup.find_all('a', href=True):
        if not link.get('data-article-id'):
            link_text = link.get_text()
            href = link.get('href', '')
            if href:
                link.replace_with(f'[{link_text}]({href})')

    return str(soup)


def html_to_markdown(html: str) -> str:
    """Convert HTML to markdown, preserving blockquotes and structure."""
    if not html:
        return ''

    # Decode HTML entities
    html = html_module.unescape(html)

    soup = BeautifulSoup(html, 'html.parser')

    # Convert blockquotes
    for blockquote in soup.find_all('blockquote'):
        text = blockquote.get_text()
        # Markdown blockquote format (> prefix)
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        quoted = '\n'.join(f'> {line}' for line in lines)
        blockquote.replace_with(quoted + '\n')

    # Convert line spacers to newlines
    for spacer in soup.find_all('span', class_='line-spacer'):
        spacer.replace_with('\n\n')

    # Get text content
    text = soup.get_text()

    # Clean up excessive whitespace
    text = re.sub(r'\n\n\n+', '\n\n', text)

    return text.strip()


# Fields that should go in frontmatter (short info), not body sections
FRONTMATTER_FIELDS = {
    'motto': 'Motto',
    'demonym': 'Demonym',
    'currency': 'Currency',
    'governmentsystem': 'GovernmentSystem',
    'powerstructure': 'PowerStructure',
    'economicsystem': 'EconomicSystem',
    'legislative': 'LegislativeBody',
    'judicial': 'JudicialBody',
    'executive': 'ExecutiveBody',
    'alternativename': 'AlternativeNames',
    'population': 'Population',
    'constructed': 'Constructed',
    'foundingDate': 'FoundingDate',
    'pronunciation': 'Pronunciation',
    'assets': 'Assets',
    'demographics': 'Demographics',
    'structure': 'Structure',
    'pointofinterest': 'PointsOfInterest',
    'district': 'Districts',
    'appointment': 'Appointment',
    'authoritysource': 'AuthoritySource',
    'alternativetitle': 'AlternativeTitle',
    'result': 'Result',
    'battlefieldtype': 'BattlefieldType',
}


def format_section_heading(key: str) -> str:
    """Convert section key to readable heading."""
    # Special cases
    special = {
        'culture': 'Culture',
        'history': 'History',
        'sects': 'Sects',
        'seeded': 'Seeded',
        'geography': 'Geography',
    }

    if key in special:
        return special[key]

    # Default: title case with underscores removed
    return key.replace('_', ' ').title()


def convert_article(json_path: Path) -> Dict[str, Any]:
    """Convert single JSON article to markdown data."""

    with open(json_path, encoding='utf-8') as f:
        data = json.load(f)

    # Extract core metadata
    result = {
        'title': data['title'],
        'slug': data['slug'],
        'type': data.get('entityClass', 'Unknown'),
        'template': data.get('template', 'unknown'),
        'state': data.get('state', 'public'),
        'isDraft': data.get('isDraft', False),
        'isWip': data.get('isWip', False),
        'tags': parse_tags(data.get('tags', '')),
        'content': '',       # Main body content (root level)
        'contentHtml': '',   # Main body HTML (root level)
        'sections': {},
        'relations': {},
        'infobox': {}  # Short info fields for sidebar
    }

    # Extract main body content (at root level, NOT in sections)
    # This is the primary article content that was being missed!
    main_content = data.get('content', '')
    main_html = data.get('contentParsed', '')

    if isinstance(main_content, str) and main_content.strip():
        result['content'] = main_content
    if isinstance(main_html, str) and main_html.strip():
        result['contentHtml'] = main_html

    # Process sections
    sections = data.get('sections', {})
    for section_key, section_data in sections.items():
        if not isinstance(section_data, dict):
            continue

        # Skip system sections
        if section_key in ['displaySidebar', 'folderId']:
            continue

        content = section_data.get('content', '')
        html = section_data.get('contentParsed', '')

        # Convert to string if not already (some are booleans/numbers)
        if not isinstance(content, str):
            content = str(content) if content else ''
        if not isinstance(html, str):
            html = str(html) if html else ''

        # Skip empty sections
        if not content and not html:
            continue

        # Check if this is a frontmatter field (short info for infobox)
        if section_key in FRONTMATTER_FIELDS:
            # Get the text content, prefer plain content for frontmatter
            if content:
                text = convert_wikilinks(content).strip()
            elif html:
                text = html_to_markdown(convert_html_links(html)).strip()
            else:
                text = ''

            if text:
                field_name = FRONTMATTER_FIELDS[section_key]
                result['infobox'][field_name] = text
        else:
            # Regular body section
            result['sections'][section_key] = {
                'content': content,
                'html': html
            }

    # Process relations
    try:
        relations = data.get('relations', {})

        if not isinstance(relations, dict):
            return result

        for rel_key, rel_data in relations.items():
            if not isinstance(rel_data, dict):
                continue

            items = rel_data.get('items')
            if not items:
                continue

            relation_type = rel_data.get('type', 'collection')

            # Handle singular relations (items is a dict)
            if relation_type == 'singular':
                if isinstance(items, dict) and 'title' in items:
                    result['relations'][rel_key] = [items['title']]

            # Handle collection relations (items is a list)
            elif relation_type == 'collection':
                if isinstance(items, list):
                    titles = [item['title'] for item in items if isinstance(item, dict) and 'title' in item]
                    if titles:
                        result['relations'][rel_key] = titles

    except Exception as e:
        print(f"ERROR in relations for {json_path.name}: {e}")
        import traceback
        traceback.print_exc()
        raise

    return result


def generate_markdown(article: Dict[str, Any]) -> str:
    """Generate markdown with YAML frontmatter."""

    lines = ['---']

    # Basic metadata
    lines.append(f'title: "{escape_yaml(article["title"])}"')
    lines.append(f'slug: "{article["slug"]}"')
    lines.append(f'type: {article["type"]}')

    # Add alias for title so [[Title]] links resolve correctly
    # Sanitize to avoid invalid filename characters in redirect files
    clean_alias = sanitize_alias(article["title"])
    if clean_alias:
        lines.append('aliases:')
        lines.append(f'  - "{escape_yaml(clean_alias)}"')

    # Tags
    if article['tags']:
        lines.append('tags:')
        for tag in article['tags']:
            lines.append(f'  - {tag}')

    # Relations as structured metadata
    if article['relations']:
        for rel_type, rel_items in article['relations'].items():
            # Convert snake_case to Title Case
            rel_label = rel_type.replace('_', ' ').title()

            if len(rel_items) == 1:
                lines.append(f'{rel_label}: "[[{rel_items[0]}]]"')
            elif len(rel_items) > 1:
                lines.append(f'{rel_label}:')
                for item in rel_items:
                    lines.append(f'  - "[[{item}]]"')

    # Infobox fields (short info for sidebar)
    if article.get('infobox'):
        for field_name, field_value in article['infobox'].items():
            # Escape quotes and handle multiline
            if '\n' in field_value:
                # Multiline: use literal block scalar
                lines.append(f'{field_name}: |')
                for line in field_value.split('\n'):
                    lines.append(f'  {line}')
            else:
                lines.append(f'{field_name}: "{escape_yaml(field_value)}"')

    # Draft/WIP flags
    if article['isDraft']:
        lines.append('draft: true')
    if article['isWip']:
        lines.append('wip: true')

    lines.append('---')
    lines.append('')

    # Note: No # Title here - Quartz renders title via ArticleTitle component

    # Main body content (from root level content/contentParsed)
    # This is the primary article content that was being missed!
    if article.get('contentHtml'):
        html = convert_html_links(article['contentHtml'])
        main_content = html_to_markdown(html)
        if main_content.strip():
            lines.append(main_content)
            lines.append('')
    elif article.get('content'):
        main_content = convert_wikilinks(article['content'])
        if main_content.strip():
            lines.append(main_content)
            lines.append('')

    # Sections (additional content from template-specific fields)
    for section_key, section_data in article['sections'].items():
        # Format heading
        heading = format_section_heading(section_key)

        lines.append(f'## {heading}')
        lines.append('')

        # Prefer HTML content (has blockquotes, links, formatting)
        if section_data['html']:
            html = convert_html_links(section_data['html'])
            content = html_to_markdown(html)
        else:
            # Fall back to plain content
            content = convert_wikilinks(section_data['content'])

        lines.append(content)
        lines.append('')

    return '\n'.join(lines)


def main():
    """Main conversion process."""
    print("=== World Anvil JSON to Markdown Converter ===\n")

    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Find all JSON files
    json_files = []
    for json_file in INPUT_DIR.rglob('*.json'):
        # Skip category metadata files
        if json_file.name == 'category-metadata.json':
            continue
        json_files.append(json_file)

    print(f"Found {len(json_files)} JSON files to convert\n")

    # Convert each article
    converted = 0
    errors = []

    for json_file in json_files:
        try:
            # Convert article
            article = convert_article(json_file)

            # Generate markdown
            markdown = generate_markdown(article)

            # Write output file
            output_file = OUTPUT_DIR / f"{article['slug']}.md"
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(markdown)

            converted += 1

            # Progress indicator
            if converted % 50 == 0:
                print(f"  Converted {converted}/{len(json_files)} articles...")

        except Exception as e:
            errors.append((json_file.name, str(e)))

    print(f"\n=== Conversion Complete ===")
    print(f"Successfully converted: {converted} articles")
    print(f"Errors: {len(errors)}")

    if errors:
        print("\nErrors encountered:")
        for filename, error in errors[:10]:  # Show first 10 errors
            print(f"  {filename}: {error}")

    print(f"\nOutput saved to: {OUTPUT_DIR}/")
    print(f"\nNext steps:")
    print(f"  1. Run: npx quartz build --serve")
    print(f"  2. Open: http://localhost:8080")
    print(f"  3. Verify: Historian Syncretate has Culture/History sections")


if __name__ == '__main__':
    main()
