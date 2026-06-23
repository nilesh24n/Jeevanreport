# JeevanReport

Barcode-based product transparency platform — scan packaged products to understand ingredients, nutrition, body impact (educational), and track shrinkflation over time.

## Run locally

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

```bash
bun run build
bun run start
```

Docker (standalone output):

```bash
docker build -t jeevanreport .
docker run -p 3000:3000 jeevanreport
```

## Demo barcodes to try

| Product | Barcode |
|---------|---------|
| Oreo Cookies (USA) | `044000005977` |
| Cheerios | `016000430158` |
| Coca-Cola Classic | `049000028911` |
| Chobani Greek Yogurt | `081511700123` |
| Doritos Nacho | `028400047525` |

## API

```bash
GET /api/products                    # list all products
GET /api/products?category=snacks    # filter by category
GET /api/products?barcode=044000005977
GET /api/products/oreo-original-us   # full product JSON
```

## Keyboard shortcuts

- `/` or `s` — open scan page
- `f` — open search
- `h` — go home

## Features

- Camera + manual barcode scanning with not-found handling
- Watchlist & scan history (saved in browser localStorage)
- Full-pack nutrition reality panel
- Ingredient complexity indicator
- Product SEO metadata + JSON-LD structured data
- Mobile sticky scan bar
- Shrinkflation / formula / price tracking with charts

- Next.js 15 (App Router)
- TypeScript + Tailwind CSS
- Recharts (nutrition radar, price trends)
- @zxing/browser (camera barcode scanning)

## Pages

Home, Scan, Search, Products, Product Detail, Compare, Submit Evidence, Methodology, Dashboard, Latest Changes, Categories (+ 9 category sub-pages), and legal/info pages.
