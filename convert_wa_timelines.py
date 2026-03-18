import os
import glob
from bs4 import BeautifulSoup

# Find all timeline HTML files
html_files = glob.glob('timeline*.htm') + glob.glob('timelin*.htm') + glob.glob('wahasha timeline.htm')

for file_path in html_files:
    print(f"Processing {file_path}")

    # Parse each HTML file using BeautifulSoup
    with open(file_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    # Extract title from <title> or <h1>
    title_tag = soup.find('h1') or soup.find('title')
    title = title_tag.text.strip() if title_tag else file_path.replace('.htm', '')

    # Get all era-header divs
    era_header_divs = soup.find_all('div', class_='era-header')

    parsed_events = []

    # First: Process events organized under eras
    for era_header in era_header_divs:
        # Extract group name
        group_h2 = era_header.find('h2', class_='m-b-0')
        group = group_h2.text.strip() if group_h2 else ""

        # Find all timeline-panel elements within the same era-histories div
        era_histories = era_header.find_next_sibling('div', class_='era-histories')
        if not era_histories:
            continue

        timeline_panels = era_histories.find_all('div', class_='timeline-panel')

        for panel in timeline_panels:
            # Extract year
            year_div = panel.find('div', class_='history-year')
            year = year_div.find('strong').text.strip() if year_div and year_div.find('strong') else ""

            # Extract headline
            headline_h5 = panel.find('h5', class_='history-title')
            headline = headline_h5.text.strip() if headline_h5 else ""

            # Extract text
            body_div = panel.find('div', class_='tl-body')
            text = ""
            if body_div:
                # Remove "More reading" reference sections
                for article_div in body_div.find_all('div', class_='history-article'):
                    article_div.decompose()
                text = body_div.text.strip()
                text = text.replace('\n', ' ').replace('"', '\\"')

            parsed_events.append({
                'year': year,
                'headline': headline,
                'text': text,
                'group': group
            })

    # Second: Process standalone events (not under any era)
    all_panels = soup.find_all('div', class_='timeline-panel')
    for panel in all_panels:
        # Check if this panel is inside an era-histories div
        if panel.find_parent('div', class_='era-histories'):
            continue  # Skip - already processed in era loop

        # Extract event with empty group
        year_div = panel.find('div', class_='history-year')
        year = year_div.find('strong').text.strip() if year_div and year_div.find('strong') else ""

        headline_h5 = panel.find('h5', class_='history-title')
        headline = headline_h5.text.strip() if headline_h5 else ""

        body_div = panel.find('div', class_='tl-body')
        text = ""
        if body_div:
            # Remove "More reading" reference sections
            for article_div in body_div.find_all('div', class_='history-article'):
                article_div.decompose()
            text = body_div.text.strip()
            text = text.replace('\n', ' ').replace('"', '\\"')

        parsed_events.append({
            'year': year,
            'headline': headline,
            'text': text,
            'group': ""
        })

    # Output markdown files to content/ directory
    out_filename = f"content/{file_path.replace('.htm', '.md').replace(' ', '_').lower()}"
    with open(out_filename, 'w', encoding='utf-8') as f:
        # Write headers
        f.write("---\n")
        f.write(f"title: \"{title}\"\n")
        f.write("type: Timeline\n")
        f.write("---\n\n")
        f.write(f"# {title}\n\n")

        # Write timeline events
        f.write("```timeline\n")
        f.write(f"title: \"{title}\"\n")
        f.write("events:\n")

        for ev in parsed_events:
            f.write(f"- year: {ev['year']}\n")
            f.write(f"  headline: \"{ev['headline']}\"\n")
            f.write(f"  text: \"{ev['text']}\"\n")
            if ev['group']:
                f.write(f"  group: \"{ev['group']}\"\n")

        f.write("```\n")

    print(f"  -> Saved {len(parsed_events)} events to {out_filename}")
