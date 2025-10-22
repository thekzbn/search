# 🔎 thekzbn Search

A lightweight, multi-engine web search interface for querying 12 platforms — Google (Web, Images), YouTube, Claude (AI, Docs, Projects), Perplexity, SearchGPT, Bing, DuckDuckGo, Yahoo, and Yandex — from a single, responsive portal. Fork this to create your own search tool or run it locally.

> **Live Demo**: [search.thekzbn.name.ng](https://search.thekzbn.name.ng)

---

## ✨ Features

- **Multi-Engine Search**: Supports Google (Web, Images, no AI with `udm=14`), YouTube, Claude (AI, Docs, Projects), Perplexity, SearchGPT, Bing, DuckDuckGo, Yahoo, and Yandex.
- **Autocomplete Suggestions**: Powered by Google's API (via CORS proxy).
- **Search History**: Stored in `localStorage` with view, repeat, and clear options.
- **Keyboard Shortcuts**: `Ctrl+K` (or `⌘+K`) to focus search, `Ctrl+H` (or `⌘+H`) to toggle history.
- **Responsive Design**: Mobile-friendly with a touch-optimized history panel.
- **Dark Mode**: Auto-adapts to system theme.
- **Accessibility**: Semantic HTML and ARIA attributes.
- **Lightweight**: Pure HTML, CSS, and JavaScript — no build tools needed.

---

## 🧩 File Structure

```
thekzbn-search/
├── assets/
│   ├── css/
│   │   └── style.css       # Search interface styles
│   ├── js/
│   │   └── script.js       # Search and autocomplete logic
│   └── img/
│       ├── logo.png        # Project logo
│       └── favicon.ico     # Favicon
├── index.html              # Main HTML file
├── google999b64546ebf668a.html # Google Search Console verification file
└── README.md               # This file
```

> **⚠️ Note**: `google999b64546ebf668a.html` is for **thekzbn's Google Search Console verification**. **Remove or replace it** when forking!

---

## 🚀 Quick Start

### Prerequisites
- **Git**: To clone the repository.
- **Node.js** or **Python**: For running a local server.
- **CORS Proxy**: Required for Google autocomplete.

### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/thekzbn/search.git
   cd search
   ```

2. **Handle Google Verification File**:
   ```bash
   # Option 1: Remove it (recommended for local dev)
   rm google999b64546ebf668a.html
   
   # Option 2: Keep it temporarily (for testing thekzbn's verification)
   # Don't commit it back to your fork
   ```

3. **Run Locally**:
   ```bash
   # Node.js
   npm install -g http-server
   http-server -p 8080
   
   # Python
   python -m http.server 8080
   
   # VS Code Live Server
   # Right-click index.html → "Open with Live Server"
   ```
   Open `http://localhost:8080`.

4. **Set Up CORS Proxy**:
   ```bash
   # Clone and run cors-anywhere
   git clone https://github.com/Rob--W/cors-anywhere.git
   cd cors-anywhere
   npm install
   node server.js
   ```
   Update `script.js`:
   ```javascript
   const proxyUrl = 'http://localhost:8081/'; // Your proxy
   ```

5. **Test**:
   - Search across all 12 engines.
   - Verify autocomplete works.
   - Test mobile view (`Ctrl+Shift+M` in Chrome).
   - Debug CORS errors in the console.

### Deployment
1. **Remove Google Verification File**:
   ```bash
   rm google999b64546ebf668a.html
   git add .
   git commit -m "Remove domain-specific verification file"
   ```

2. **Deploy to Static Host**:
   | Platform | Command/Link |
   |----------|-------------|
   | **Netlify** | `netlify deploy` |
   | **Vercel** | `vercel` |
   | **GitHub Pages** | Settings → Pages → Deploy |
   | **Cloudflare Pages** | Dashboard → Create Project |

3. **Add Your Own SEO** (optional):
   ```bash
   # Create sitemap.xml
   touch sitemap.xml
   
   # Create robots.txt
   touch robots.txt
   ```

---

## ⚙️ Customization

### Quick Customizations

| What | File | How |
|------|------|-----|
| **Add Engine** | `script.js` | Add to `engines` object |
| **Change Logo** | `assets/img/logo.png` | Replace with your 150×150px image |
| **Change Colors** | `style.css` | Edit `:root` CSS variables |
| **Default Engine** | `script.js` | Set `defaultEngine` |
| **Meta Tags** | `index.html` | Edit `<title>`, `<meta name="description">` |

### Example: Add Custom Search Engine
1. In `script.js`:
   ```javascript
   const engines = {
       // ... existing engines
       custom: {
           url: "https://customsearch.com/search?q=",
           name: "Custom Search",
           icon: "<i class='bx bx-search'></i>",
           color: "#yourcolor"
       }
   };
   ```

2. In `index.html`:
   ```html
   <option value="custom"><i class='bx bx-search'></i> Custom Search</option>
   ```

3. Done! Refresh and select your engine.

### Example: Rebrand Colors
In `style.css`:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --button-blue: #your-brand-color;
}
```

---

## 🌍 SEO Setup (Optional)

For your forked deployment:
1. **Google Search Console**:
   ```bash
   # Get your verification file from GSC
   # Save as: googleYOURCODE.html
   # Place in root directory
   ```

2. **Create `sitemap.xml`**:
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       <url>
           <loc>https://yourdomain.com/</loc>
           <priority>1.0</priority>
       </url>
   </urlset>
   ```

3. **Create `robots.txt`**:
   ```
   User-agent: *
   Allow: /
   Sitemap: https://yourdomain.com/sitemap.xml
   ```

4. **Submit**:
   - Google Search Console → Sitemaps → Add `sitemap.xml`
   - Bing Webmaster Tools → Sitemaps
   - Yandex Webmaster → Sitemaps

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| **Autocomplete not working** | Check CORS proxy URL in `script.js` |
| **Icons missing** | Verify internet connection (Boxicons CDN) |
| **Mobile history close button missing** | Check `style.css` mobile media queries |
| **Search URLs broken** | Update `engines` object in `script.js` |
| **Local server CORS errors** | Use `http-server --cors "*"` |

---

## 🧠 Developer Tips

- **Fork Clean**: Remove `google999b64546ebf668a.html` before your first commit.
- **Proxy Reliability**: Host your own CORS proxy for production.
- **HTTPS Required**: Boxicons CDN and autocomplete need HTTPS.
- **Cache Busting**: Add `?v=1` to CSS/JS URLs after major changes.
- **Testing Engines**: Use browser dev tools Network tab to verify search URLs.

---

## 🤝 Contributing

1. Fork the repo.
2. Create feature branch: `git checkout -b feature/add-engine`
3. Commit: `git commit -m "Add new search engine"`
4. Push: `git push origin feature/add-engine`
5. Open Pull Request.

**Good first issues**:
- Add new search engines.
- Improve mobile UX.
- Fix edge cases.
- Add accessibility features.

---

## 🧾 License

MIT [License](LICENSE) — free for personal and commercial use.



---

## 📬 Support

- **Issues**: [GitHub Issues](https://github.com/thekzbn/search/issues)
- **Original**: [thekzbn.name.ng](https://thekzbn.name.ng)
- **Demo**: [search.thekzbn.name.ng](https://search.thekzbn.name.ng)

**Happy forking!** 🚀