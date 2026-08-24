# DataFill AI — Excel & Web Product Enricher

A modern full-stack web application that automates filling an Excel spreadsheet (`.xlsx`) using product records from a CSV file and enriched product metadata extracted directly from user-provided product webpage URLs.

---

## Key Features & Workflow

### 1. CSV Upload & Detection
- Upload any product CSV with automatic delimiter detection.
- Interactive spreadsheet grid preview.
- Smart detection and user selection of Primary Product Identifier (`Product ID`, `SKU`, `Name`, `Model`).

### 2. Excel Template Upload (`.xlsx`)
- Upload the target Excel spreadsheet template.
- Uses **ExcelJS** to inspect sheets, column headers, existing row structures, and detect existing formulas.
- Guaranteed structure preservation: preserves exact workbook formatting, formulas, cell styles, fonts, borders, and number formats.

### 3. Match CSV Products to Spreadsheet Rows
- Flexible alignment options:
  - **Match by Unique Identifier**: aligns `CSV Product ID` to `Excel SKU` for updating existing rows or appending new items.
  - **Match by Row Order**: 1-to-1 sequential insertion.

### 4. Optional URL Assignment Hub (CSV-Only or Web-Enriched)
- **Optional Web Extraction**: Populate Excel directly using CSV dataset, or optionally assign webpage URLs for full live enrichment.
- **Option A: Inline Entry**: Enter and test URLs directly on any product row.
- **Option B: Bulk URL Paste**: Paste 100s of URLs line-by-line for instant top-to-bottom assignment.
- **Option C: URL Mapping CSV**: Upload a mini CSV (`Product ID, URL`) to match URLs by key.
- **Quick Actions**: "Skip URLs (CSV Only)", "Fill Missing with Demo URLs", and 1-click test buttons.

### 5. Field Mapping & Source Configuration
- Map each Excel column to its source:
  - `CSV`
  - `Webpage`
  - `CSV (Webpage Fallback)`
  - `Webpage (CSV Fallback)`
  - `Manual Constant`
- Support for data types: String, Currency, Number, Boolean, Image URL, Date.
- Optional custom CSS selectors per field.

### 6. Extraction Preview & Calibration
- Test extraction on 1 to 5 sample products before running the full batch.
- Real-time side-by-side comparison of extracted values, confidence scores (0-100%), and source methods (`JSON-LD`, `OpenGraph`, `Microdata`, `CSS Selector`, `Heuristic`).

### 7. Resilient Background Batch Processing Hub
- Independent product workers: failure on one URL does not stop the entire job.
- Rate limiting per domain with exponential backoff and SSRF protection.
- Live progress tracker with percentage, counters (`Completed`, `Partial`, `Failed`, `Remaining`), active product ticker, and auto-scrolling terminal logs.
- Full controls: **Start**, **Pause**, **Resume**, **Cancel**, **Retry Failed**, **Retry Selected**.

### 8. Spreadsheet Review & Conflict Resolution
- Full TanStack data grid review screen with inline cell editing.
- Conflict detection and resolution UI: when CSV and Webpage disagree (e.g. Brand: "Apple" vs "Apple Inc."), provides 1-click `[Use CSV]`, `[Use Webpage]`, or `[Custom Edit]`.

### 9. Excel Population & XLSX Export
- Populates the uploaded XLSX template preserving all fonts, colors, border styles, and formulas.
- Instant 1-click download of the enriched `.xlsx` workbook.

---

## Extraction Engine Strategy

1. **JSON-LD / Schema.org**: `<script type="application/ld+json">` (`Product`, `Offer`, `AggregateOffer`) — 95–99% confidence.
2. **OpenGraph & Twitter Meta**: `og:title`, `og:price:amount`, `og:brand`, `og:description`, `og:image` — 88–94% confidence.
3. **HTML Microdata**: `itemprop="price"`, `itemprop="name"`, `itemprop="sku"` — 80–90% confidence.
4. **CSS Selectors & Spec Tables**: parses `.specs-table`, `dl`, price badges — 75–88% confidence.
5. **Regex Body Heuristics**: currency symbols (`₹`, `$`, `€`), dimensions (`147.6 x 71.6 mm`), weights (`171 g`).

---

## Security

- **SSRF Protection**: Strict IP filtering blocking loopbacks (`127.0.0.0/8`, `::1`), private ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), link-local (`169.254.169.254`), and cloud metadata services.
- **Domain Rate Limiting**: Throttles requests per target domain to prevent overwhelming servers.
- **File Validation**: MIME-type and size checking for uploads.

---

## Getting Started

### 1. Backend Setup
```bash
cd excel-product-filler/backend
npm install
npm run dev
# Backend runs on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd excel-product-filler/frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### 3. Sample Demo Data
Sample files are provided in `excel-product-filler/sample_data/`:
- `products_sample.csv`
- `Product_Catalog_Template.xlsx`
- `sample_urls_mapping.csv`

Or click **"Load Sample Demo"** in the top navigation bar to test the entire flow instantly in 1 click!
