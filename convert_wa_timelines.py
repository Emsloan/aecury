import os
import glob
from bs4 import BeautifulSoup

html_files = glob.glob('timeline*.htm') + glob.glob('timelin*.htm') + glob.glob('wahasha timeline.htm')

for file_path in html_files:
    print(f"Processing {file_path}")
    with open(file_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    title_tag = soup.find('h1') or soup.find('title')
    title = title_tag.text.strip() if title_tag else file_path.replace('.htm', '')

    # Standardize title format: "History of X"
    # Remove "Timeline" suffix
    if title.endswith(' Timeline'):
        title = title[:-9].strip()

    # Add "History of" prefix if not present
    if not title.startswith('History of'):
        title = f"History of {title}"

    era_header_divs = soup.find_all('div', class_='era-header')
    parsed_events = []

    # Process era-organized events
    for era_header in era_header_divs:
        group_h2 = era_header.find('h2', class_='m-b-0')
        group = group_h2.text.strip() if group_h2 else ""

        era_histories = era_header.find_next_sibling('div', class_='era-histories')
        if not era_histories:
            continue

        # Find BOTH timeline-panel AND milestone-panel
        panels = era_histories.find_all('div', class_=['timeline-panel', 'milestone-panel'])

        for panel in panels:
            year_div = panel.find('div', class_='history-year')
            year = year_div.find('strong').text.strip() if year_div and year_div.find('strong') else ""

            headline_h5 = panel.find('h5', class_='history-title')
            headline = headline_h5.text.strip() if headline_h5 else ""

            # Extract category
            category_strong = panel.find('strong', class_='history-category-name')
            category = category_strong.text.strip() if category_strong else ""

            body_div = panel.find('div', class_='tl-body')
            text = ""
            entities = []
            portraits = []

            if body_div:
                # Extract text from history-shorttext only
                shorttext = body_div.find('p', class_='history-shorttext')
                if shorttext:
                    text = shorttext.get_text(strip=True)
                    text = text.replace('\n', ' ').replace('"', '\\"')

                    # Extract entity links from shorttext
                    for link in shorttext.find_all('a', href=True):
                        link_text = link.text.strip()
                        href = link.get('href', '')
                        # Filter out empty links and edit links
                        if link_text and '/edit' not in href:
                            entities.append({'name': link_text, 'url': href})

                # Extract portraits
                portraits_div = body_div.find('div', class_='tl-portraits')
                if portraits_div:
                    for link in portraits_div.find_all('a', href=True):
                        href = link.get('href', '')
                        img = link.find('img')
                        if img:
                            img_src = img.get('src', '')
                            portraits.append({'url': href, 'img': img_src})

            parsed_events.append({
                'year': year,
                'headline': headline,
                'text': text,
                'group': group,
                'category': category,
                'entities': entities,
                'portraits': portraits
            })

    # Process standalone events
    all_panels = soup.find_all('div', class_=['timeline-panel', 'milestone-panel'])
    for panel in all_panels:
        if panel.find_parent('div', class_='era-histories'):
            continue

        year_div = panel.find('div', class_='history-year')
        year = year_div.find('strong').text.strip() if year_div and year_div.find('strong') else ""

        headline_h5 = panel.find('h5', class_='history-title')
        headline = headline_h5.text.strip() if headline_h5 else ""

        # Extract category
        category_strong = panel.find('strong', class_='history-category-name')
        category = category_strong.text.strip() if category_strong else ""

        body_div = panel.find('div', class_='tl-body')
        text = ""
        entities = []
        portraits = []

        if body_div:
            # Extract text from history-shorttext only
            shorttext = body_div.find('p', class_='history-shorttext')
            if shorttext:
                text = shorttext.get_text(strip=True)
                text = text.replace('\n', ' ').replace('"', '\\"')

                # Extract entity links from shorttext
                for link in shorttext.find_all('a', href=True):
                    link_text = link.text.strip()
                    href = link.get('href', '')
                    # Filter out empty links and edit links
                    if link_text and '/edit' not in href:
                        entities.append({'name': link_text, 'url': href})

            # Extract portraits
            portraits_div = body_div.find('div', class_='tl-portraits')
            if portraits_div:
                for link in portraits_div.find_all('a', href=True):
                    href = link.get('href', '')
                    img = link.find('img')
                    if img:
                        img_src = img.get('src', '')
                        portraits.append({'url': href, 'img': img_src})

        parsed_events.append({
            'year': year,
            'headline': headline,
            'text': text,
            'group': "",
            'category': category,
            'entities': entities,
            'portraits': portraits
        })

    # Output
    out_filename = f"content/{file_path.replace('.htm', '.md').replace(' ', '_').lower()}"
    with open(out_filename, 'w', encoding='utf-8') as f:
        f.write("---\n")
        f.write(f"title: \"{title}\"\n")
        f.write("type: Timeline\n")
        f.write("---\n\n")
        f.write(f"# {title}\n\n")
        f.write("```timeline\n")
        f.write(f"title: \"{title}\"\n")
        f.write("events:\n")

        for ev in parsed_events:
            f.write(f"- year: {ev['year']}\n")
            f.write(f"  headline: \"{ev['headline']}\"\n")
            f.write(f"  text: \"{ev['text']}\"\n")
            if ev['category']:
                f.write(f"  category: \"{ev['category']}\"\n")
            if ev['group']:
                f.write(f"  group: \"{ev['group']}\"\n")
            if ev.get('entities'):
                f.write(f"  entities:\n")
                for entity in ev['entities']:
                    f.write(f"  - name: \"{entity['name']}\"\n")
                    f.write(f"    url: \"{entity['url']}\"\n")
            if ev.get('portraits'):
                f.write(f"  portraits:\n")
                for portrait in ev['portraits']:
                    f.write(f"  - url: \"{portrait['url']}\"\n")
                    f.write(f"    img: \"{portrait['img']}\"\n")

        f.write("```\n")

    print(f"  -> Saved {len(parsed_events)} events to {out_filename}")
