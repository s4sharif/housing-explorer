# Housing Explorer

A responsive **demo housing explorer** made with **React 19, Vite 8, and Mapbox GL JS**. Browse and filter example property listings by neighbourhood, home type, and monthly price. Optionally view their locations on an interactive map.

> **Important:** This is a reconstructed, working demo scaffold based on the supplied Vite configuration files. The original `src/` folder was not provided. All six listings, prices, and locations are **illustrative**, not real rental offers or verified market data.

## Features

- Responsive property cards and live search
- Filters for property type and maximum monthly budget
- Clickable selection for map markers and property cards
- Optional interactive Mapbox map; usable fallback when no token is configured
- Accessible labels, empty-state feedback, and clear demo-data notices

## Tech stack

- React 19
- Vite 8
- Mapbox GL JS 3
- CSS
- ESLint

## Getting started

**Requirements:** Node.js 20.19+ or 22.12+ and npm.

```bash
npm ci
cp .env.example .env
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). The list works without a Mapbox token.

### Optional: enable the map

Get a **public** (`pk.`) Mapbox token and add it to `.env`:

```env
VITE_MAPBOX_TOKEN=pk.your-public-token
```

Never put private tokens or secrets in `VITE_` variables; Vite exposes them to client-side code. Restrict public tokens as appropriate in your Mapbox account.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Generate a production build in `dist/` |
| `npm run preview` | Preview the build locally |
| `npm run lint` | Check JavaScript/React source with ESLint |

## Project structure

```text
housing-explorer/
├── public/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── eslint.config.js
└── vite.config.js
```

## Next steps

Replace the demonstration data in `src/App.jsx` with an authorized housing dataset or API, add real property details/assets, validate geolocation, and add tests before calling this a production application. If you have the original `src/` directory, use that to finish the actual intended project rather than this scaffold.

## Deployment

For a static host (e.g. Netlify, Vercel, or GitHub Pages), build with `npm run build` and publish `dist/`. A GitHub Pages deployment to a project subpath may require setting the Vite `base` option to the repository path. Configure the public Mapbox token as a build-time environment variable in your hosting dashboard if using the interactive map.

## Data notice

The example homes are fictional, and this website is for demonstration/portfolio purposes only. It does not provide housing advice or guarantee availability or prices.
