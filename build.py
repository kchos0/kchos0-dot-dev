import os
import markdown
from datetime import datetime
import re
import json

def build():
    with open('config.json', 'r') as f: config = json.load(f)
    with open('templates/base.html', 'r') as f: base_tpl = f.read()

    def render_page(title, content_html, active_nav=''):
        html = base_tpl
        html = html.replace('{{SITE_NAME}}', config['site_name'])
        html = html.replace('{{AUTHOR}}', config['author'])
        html = html.replace('{{DESCRIPTION}}', config['description'])
        html = html.replace('{{THREADS_LINK}}', config['threads_link'])
        html = html.replace('{{GITHUB_LINK}}', config['github_link'])
        
        # Navigation active states
        html = html.replace('{{NAV_ACTIVE_INDEX}}', 'active' if active_nav == 'index' else '')
        html = html.replace('{{NAV_ACTIVE_WRITING}}', 'active' if active_nav == 'writing' else '')
        html = html.replace('{{NAV_ACTIVE_PROJECTS}}', 'active' if active_nav == 'projects' else '')
        
        html = html.replace('{{TITLE}}', title)
        html = html.replace('{{CONTENT}}', content_html)
        return html
    
    articles = []
    
    for filename in os.listdir('content'):
        if not filename.endswith('.md'): continue
        
        with open(f'content/{filename}', 'r') as f:
            lines = f.readlines()
            
        title = ""
        date_str = ""
        is_featured = False
        content_lines = []
        in_frontmatter = False
        frontmatter_done = False
        
        for line in lines:
            if line.strip() == '---' and not frontmatter_done:
                if in_frontmatter:
                    in_frontmatter = False
                    frontmatter_done = True
                else:
                    in_frontmatter = True
                continue
            if in_frontmatter:
                if line.startswith('title:'): title = line.replace('title:', '').strip()
                if line.startswith('date:'): date_str = line.replace('date:', '').strip()
                if line.startswith('featured:'): 
                    val = line.replace('featured:', '').strip().lower()
                    if val == 'true' or val == 'yes': is_featured = True
            else:
                content_lines.append(line)
        
        excerpt = ""
        for line in content_lines:
            stripped = line.strip()
            if stripped and not stripped.startswith('<') and not stripped.startswith('#') and not stripped.startswith('!'):
                excerpt = stripped
                excerpt = re.sub(r'\*\*(.+?)\*\*', r'\1', excerpt)
                excerpt = re.sub(r'\*(.+?)\*', r'\1', excerpt)
                excerpt = re.sub(r'_(.+?)_', r'\1', excerpt)
                excerpt = re.sub(r'`(.+?)`', r'\1', excerpt)
                if len(excerpt) > 160: excerpt = excerpt[:157] + "..."
                break
                
        md_content = "".join(content_lines)
        html_content = markdown.markdown(md_content, extensions=['fenced_code'])
        
        folder_name = filename.replace('.md', '')
        url = f"/writing/{folder_name}"
        
        try:
            date_obj = datetime.strptime(date_str.lower(), '%B %d, %Y')
            date_short = date_obj.strftime("%b '%y").lower()
        except Exception:
            date_obj = datetime.min
            date_short = date_str
            
        articles.append({
            'title': title,
            'date_str': date_str,
            'date_short': date_short,
            'date_obj': date_obj,
            'is_featured': is_featured,
            'excerpt': excerpt,
            'url': url,
            'html': html_content,
            'folder': folder_name
        })

    articles.sort(key=lambda x: x['date_obj'], reverse=True)

    # Build individual articles
    for art in articles:
        os.makedirs(f"writing/{art['folder']}", exist_ok=True)
        # Handle tags and brs in title
        clean_title = re.sub('<[^<]+>', '', art['title'])
        clean_title = re.sub(r'<br\s*/?>', ' ', art['title'])
        clean_title = re.sub('<[^<]+>', '', clean_title)
        
        art_content = f'''
            <br>
            <a href="/writing"
                style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 2rem; display: inline-block;">&larr;
                back to writing</a>

            <article>
                <header style="margin-bottom: var(--space-lg);">
                    <h1 class="hero-title"
                        style="font-size: clamp(2rem, 4vw, 2.5rem); margin-bottom: 0.5rem; line-height: 1.1;">{clean_title}
                    </h1>
                    <time style="font-family: monospace; color: var(--text-muted); font-size: 0.9rem;">{art['date_str']}</time>
                </header>

                <div class="article-body">
                    {art['html']}
                </div>
            </article>'''

        final_html = render_page(f"{clean_title} &mdash; {config['site_name']}", art_content, 'writing')
        with open(f"writing/{art['folder']}/index.html", 'w') as f:
            f.write(final_html)
        print(f"Built {art['folder']}")
        
    # Build index.html
    latest_notes_html = ""
    for art in articles[:3]:
        clean_title = re.sub('<[^<]+>', '', art['title'])
        latest_notes_html += f'''
                    <li>
                        <a href="{art['url']}" class="list-link">
                            <span class="list-title">{clean_title}</span>
                            <span class="list-meta">{art['date_short']}</span>
                        </a>
                    </li>'''
                    
    if not latest_notes_html:
        latest_notes_html = '''
                    <li>
                        <div class="list-link" style="border-bottom: none;">
                            <span class="list-meta" style="font-style: italic;">no writings published yet.</span>
                        </div>
                    </li>'''
                    
    with open('templates/index.html', 'r') as f: index_tpl = f.read()
    
    selected_writings_html = ""
    for art in articles:
        if art.get('is_featured'):
            clean_title = re.sub('<[^<]+>', '', art['title'])
            selected_writings_html += f'''
                    <li>
                        <a href="{art['url']}" class="list-link">
                            <span class="list-title">{clean_title}</span>
                            <span class="list-meta">{art['date_short']}</span>
                        </a>
                    </li>'''
    
    if not selected_writings_html:
        selected_writings_html = '''
                    <li>
                        <div class="list-link project-link" style="border-bottom: none;">
                            <span class="list-meta" style="font-style: italic;">no featured writings yet.</span>
                        </div>
                    </li>'''
                    
    index_tpl = index_tpl.replace('{{INTRO_TEXT}}', config.get('intro_text', ''))
    index_tpl = index_tpl.replace('{{LATEST_NOTES}}', latest_notes_html)
    index_tpl = index_tpl.replace('{{SELECTED_WRITINGS}}', selected_writings_html)
    
    with open('index.html', 'w') as f: 
        f.write(render_page(f"{config['site_name']} &mdash; index", index_tpl, 'index'))
        
    # Build writing/index.html
    all_notes_html = ""
    for art in articles:
        all_notes_html += f'''
                    <li>
                        <a href="{art['url']}" class="list-link"
                            style="flex-direction: column; align-items: flex-start; padding: 1.5rem 0;">
                            <span class="list-meta" style="margin-left: 0; margin-bottom: 0.5rem;">{art['date_str']}</span>
                            <span class="list-title" style="font-size: 1.25rem; margin-bottom: 0.5rem;">{art['title']}</span>
                            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">{art['excerpt']}</p>
                        </a>
                    </li>'''
    
    if not all_notes_html:
        all_notes_html = '''
                    <li>
                        <div class="list-link" style="border-bottom: none;">
                            <span class="list-meta" style="font-style: italic;">no writings published yet.</span>
                        </div>
                    </li>'''
                    
    with open('templates/writing.html', 'r') as f: writing_tpl = f.read()
    with open('writing/index.html', 'w') as f: 
        f.write(render_page(f"{config['site_name']} &mdash; writing", writing_tpl.replace('{{ALL_NOTES}}', all_notes_html), 'writing'))
        
    # Build projects/index.html
    os.makedirs('projects', exist_ok=True)
    with open('templates/projects.html', 'r') as f: projects_tpl = f.read()
    with open('projects/index.html', 'w') as f:
        f.write(render_page(f"{config['site_name']} &mdash; projects", projects_tpl, 'projects'))

    print("Built index, writing, projects, and articles.")

if __name__ == "__main__":
    build()
