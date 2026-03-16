import os
import glob
from bs4 import BeautifulSoup
import re
import yaml

html_files = glob.glob('timeline*.htm') + glob.glob('wahasha timeline.htm')

for file_path in html_files:
    print(f"Processing {file_path}")
    with open(file_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    # Title is usually in <title> or <h1>
    title_tag = soup.find('h1') or soup.find('title')
    title = title_tag.text.strip() if title_tag else file_path.replace('.htm', '')
    title = re.sub(r'\s+', ' ', title).split('|')[0].strip()

    events = soup.find_all('div', class_='timeline-panel')
    
    parsed_events = []
    for e in events:
        heading_el = e.find(class_=re.compile(r'timeline-heading|tl-heading'))
        date_el = e.find(class_=re.compile(r'timeline-date|tl-heading-date'))
        body_el = e.find(class_=re.compile(r'timeline-body|tl-body'))
        
        date = date_el.get_text(" ", strip=True) if date_el else ""
        
        # Sometimes headline is bundled with the date, let's extract the actual name
        headline = ""
        if heading_el:
            # A lot of WA saves put the title in an <a> or <h4> tag
            a_tag = heading_el.find('a')
            if a_tag:
                headline = a_tag.get_text(" ", strip=True)
            else:
                h4 = heading_el.find('h4')
                if h4:
                    # remove date element text if it's inside h4
                    if date_el and h4.find(class_=date_el.get('class')):
                        h4_clone = BeautifulSoup(str(h4), 'html.parser')
                        for d in h4_clone.find_all(class_=date_el.get('class')):
                            d.decompose()
                        headline = h4_clone.get_text(" ", strip=True)
                    else:
                        headline = h4.get_text(" ", strip=True)
                else:
                    headline = heading_el.get_text(" ", strip=True)
                    
        text = body_el.get_text("\n", strip=True) if body_el else ""
        
        headline = re.sub(r'\s+', ' ', headline).strip()
        date = re.sub(r'\s+', ' ', date).strip()
        
        if headline.startswith(date):
            headline = headline[len(date):].strip()
            
        if not headline:
            headline = "Event"
            
        # extract numeric Year from date
        year_match = re.search(r'-?\d+', date)
        year = year_match.group(0) if year_match else date
        
        parsed_events.append({
            'year': int(year) if year.lstrip('-').isdigit() else year,
            'headline': headline,
            'text': text
        })

    # Output to markdown
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
            # escaping quotes in headline manually is safer
            clean_headline = str(ev['headline']).replace('"', '\\"')
            f.write(f"  headline: \"{clean_headline}\"\n")
            if ev['text']:
                clean_text = str(ev['text']).replace('"', '\\"').replace('\n', ' ')
                f.write(f"  text: \"{clean_text}\"\n")
        f.write("```\n")
        
    print(f"  -> Saved {len(parsed_events)} events to {out_filename}\n")
