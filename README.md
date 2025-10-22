# thekzbn Search

A modern, multi-engine web search tool hosted at [search.thekzbn.name.ng](https://search.thekzbn.name.ng). This project allows users to search the web using multiple search engines, including Google, YouTube, Claude, Claude Docs, Claude Projects, Perplexity, SearchGPT, Bing, DuckDuckGo, Yahoo, and Yandex, with a sleek, user-friendly interface optimized for both desktop and mobile devices.

## Features

- **Multi-Engine Search**: Choose from 12 search engines, including Google (Web and Images), YouTube, Claude (AI, Docs, Projects), Perplexity, SearchGPT, Bing, DuckDuckGo, Yahoo, and Yandex.
- **Responsive Design**: Optimized for desktop and mobile, with a mobile-friendly history panel and visible close button.
- **SEO Optimized**: Includes meta tags, structured data (JSON-LD), canonical URLs, Google Search Console verification, and a sitemap for better indexing.
- **Search History**: Stores recent searches in localStorage, with options to view, repeat, or clear history.
- **Google Autocomplete**: Provides real-time search suggestions powered by Google's autocomplete API (via CORS proxy).
- **Keyboard Shortcuts**: Supports `Ctrl+K` (or `⌘+K` on Mac) to focus the search input and `Ctrl+H` (or `⌘+H`) to toggle history.
- **Visual Effects**: Features animated gradients, hover effects, and a loading spinner for a polished user experience.
- **Accessibility**: Uses semantic HTML and ARIA attributes for better accessibility.
- **Dark Mode**: Automatically adapts to the user's system dark mode preference.

## Tech Stack

- **HTML5**: Semantic structure with SEO enhancements.
- **CSS3**: Custom styles with Boxicons for icons and responsive design.
- **JavaScript**: Handles search functionality, history management, and Google autocomplete integration.
- **Boxicons**: Icon library for search engine icons (loaded via CDN).
- **CORS Proxy**: Used for fetching Google autocomplete suggestions.

## File Structure

```
search.thekzbn.name.ng/
├── assets/
│   ├── css/
│   │   └── style.css       # Styles for the search interface
│   ├── js/
│   │   └── script.js       # JavaScript for search functionality
│   └── img/
│       ├── logo.png        # thekzbn logo
│       └── favicon.ico     # Favicon for the site
├── index.html              # Main HTML file
├── google999b64546ebf668a.html # Google Search Console verification file
├── robots.txt              # Crawler instructions
└── sitemap.xml             # Sitemap for SEO
```

## Setup Instructions

### Prerequisites
- A web server (e.g., Nginx, Apache) to host the files.
- A domain or subdomain (e.g., `search.thekzbn.name.ng`).
- Access to a CORS proxy (e.g., `https://corsproxy.io/`) for Google autocomplete API.
- A Google Search Console account for domain verification and sitemap submission.

### Installation
1. **Clone or Download the Repository**:
   - Copy the provided `index.html`, `assets/css/style.css`, and `assets/js/script.js` files into your project directory.
   - Ensure the `assets/img/` directory contains `logo.png` and `favicon.ico`.
   - Place the `google999b64546ebf668a.html` file in the root directory (`/search.thekzbn.name.ng/`) for Google Search Console verification.

2. **Create and Deploy Sitemap**:
   - Create a `sitemap.xml` file in the root directory with the following content:
     ```xml
     <?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
         <url>
             <loc>https://search.thekzbn.name.ng/</loc>
             <lastmod>2025-10-22</lastmod>
             <changefreq>daily</changefreq>
             <priority>1.0</priority>
         </url>
         <url>
             <loc>https://thekzbn.name.ng/</loc>
             <lastmod>2025-10-22</lastmod>
             <changefreq>weekly</changefreq>
             <priority>0.8</priority>
         </url>
     </urlset>
     ```
   - Ensure `sitemap.xml` is accessible at `https://search.thekzbn.name.ng/sitemap.xml`.

3. **Configure the Web Server**:
   - Host the files on a web server at `search.thekzbn.name.ng`.
   - Ensure the server supports HTTP/2 and compression (Gzip or Brotli) for performance.
   - Set cache headers for `style.css`, `script.js`, and `boxicons.min.css` (e.g., `Cache-Control: public, max-age=2592000`).
   - Verify that `google999b64546ebf668a.html` is accessible at `https://search.thekzbn.name.ng/google999b64546ebf668a.html` for Google’s verification process.
   - Ensure `sitemap.xml` is served with the correct MIME type (`text/xml`).

4. **Create and Deploy robots.txt**:
   - Place `robots.txt` in the root directory with the following content:
     ```
     User-agent: *
     Allow: /
     Sitemap: https://search.thekzbn.name.ng/sitemap.xml
     ```
   - Ensure `robots.txt` is accessible at `https://search.thekzbn.name.ng/robots.txt`.

5. **Verify with Google Search Console**:
   - Log in to [Google Search Console](https://search.google.com/search-console).
   - Add `search.thekzbn.name.ng` as a property.
   - Use the HTML file verification method by confirming that `https://search.thekzbn.name.ng/google999b64546ebf668a.html` is accessible.
   - Submit the sitemap (`https://search.thekzbn.name.ng/sitemap.xml`) for indexing.

6. **Submit to Other Search Engines**:
   - Submit `https://search.thekzbn.name.ng/sitemap.xml` to:
     - Bing Webmaster Tools (for Bing and Yahoo).
     - Yandex Webmaster.
   - Ensure the site is linked from `https://thekzbn.name.ng` for crawlability.

7. **Test the Application**:
   - Open `https://search.thekzbn.name.ng` in a browser.
   - Verify search functionality across all engines, history panel, and mobile responsiveness.
   - Check console for errors (e.g., CORS issues with Google autocomplete).
   - Confirm Google Search Console verification by checking the property status.
   - Verify sitemap accessibility and submission status in Search Console.

## Usage

1. **Search**:
   - Enter a query in the search input.
   - Select a search engine from the dropdown (e.g., Google, Claude, Perplexity).
   - Press `Enter` or click the submit button to search in a new tab.
   - Use `Ctrl+K` (or `⌘+K` on Mac) to focus the input.

2. **History**:
   - Click the history button (top-left) or press `Ctrl+H` (or `⌘+H`) to view recent searches.
   - Click a history item to repeat the search.
   - Use the trash icon to clear history.

3. **Suggestions**:
   - Start typing to see autocomplete suggestions from Google and search history.
   - Use arrow keys to navigate suggestions and `Enter` to select.

## Search Engines

- **Google (No AI Bullshit)**: Web search with AI results disabled (`udm=14`).
- **Google Images**: Image search via Google.
- **YouTube**: Video search on YouTube.
- **Claude**: General AI-powered search via Anthropic.
- **Claude Docs**: Search Anthropic's documentation.
- **Claude Projects**: Search Anthropic's project-related content.
- **Perplexity**: AI-driven search with contextual answers.
- **SearchGPT**: AI-enhanced search via OpenAI's ChatGPT integration.
- **Bing**: Web search via Microsoft Bing.
- **DuckDuckGo**: Privacy-focused web search.
- **Yahoo**: Web search via Yahoo (powered by Bing).
- **Yandex**: Web search via Yandex.

## SEO Optimizations

- **Meta Tags**: Includes `title`, `description`, `keywords`, `robots`, and Open Graph/Twitter Card tags.
- **Structured Data**: JSON-LD for `WebSite` and `SearchAction` to enhance rich snippets.
- **Canonical URL**: Prevents duplicate content issues.
- **Sitemap**: `sitemap.xml` guides crawlers for better indexing.
- **Robots**: `robots.txt` allows crawling and references the sitemap.
- **Google Search Console Verification**: Uses `google999b64546ebf668a.html` for domain ownership verification.
- **Performance**: Uses external CSS/JS, CDN for Boxicons, and lightweight assets.
- **Mobile-Friendly**: Responsive design with fixed mobile history panel close button.

## Notes

- **CORS Proxy**: The Google autocomplete API requires a CORS proxy (`https://corsproxy.io/`). Replace with your own proxy if needed for reliability.
- **SearchGPT URL**: Currently uses `https://chat.openai.com/?q=`, as SearchGPT lacks a dedicated search URL. Update if a specific endpoint becomes available.
- **Claude URLs**: Assumes standard Anthropic endpoints (`www.anthropic.com/search`, `docs.anthropic.com/search`, `www.anthropic.com/projects/search`). Verify and update if necessary.
- **BuiltWith Compatibility**: The tech stack (HTML5, CSS3, JavaScript, Boxicons) is detectable by BuiltWith due to clear CDN usage and MIME types.
- **Google Verification File**: Ensure `google999b64546ebf668a.html` remains in the root directory and is not modified to maintain Search Console verification.
- **Sitemap Maintenance**: Update the `<lastmod>` date in `sitemap.xml` whenever significant changes are made to the site (e.g., new search engines or content updates).

## Contributing

Contributions are welcome! Please:
1. Fork the repository (if hosted on a platform like GitHub).
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit changes (`git commit -m "Add feature"`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Contact

For issues or suggestions, contact thekzbn via [thekzbn.name.ng](https://thekzbn.name.ng) or open an issue on the repository (if applicable).