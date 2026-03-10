# Global News Grid

Global News Grid is a lightweight open-source news dashboard that aggregates international headlines and editorials from major newspapers.
The project is built with vanilla JavaScript and designed for speed, readability, and simplicity.

## Features
- Global headlines feed (GNews)
- Card-based responsive grid with bento-style featured sizing
- Auto-tagging + category filters
- Story clustering and trending topics
- Search and dark/light/system themes
- Local caching (10 minutes)
- Dedicated Editorials page from opinion RSS feeds

## Run locally
Serve the `news-grid` directory with any static server:

```bash
cd news-grid
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## API key
Provide your GNews API key by either:
- first-load prompt
- query string: `?apiKey=YOUR_KEY`
