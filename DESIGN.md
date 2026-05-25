# Real Estate Opportunity Scanner - Design Document

## Overview
A recurrent task system that aggregates real estate listings from multiple sources (like MoteurImmo) and provides alerts for new opportunities.

## Architecture

### 1. Data Sources
- SeLoger (seloger.com) - major French portal
- LeBonCoin (leboncoin.fr) - classifieds with real estate section
- PAP (pap.fr) - private to private listings
- Bien'ici - aggregator
- Local/regional portals

### 2. System Components

```
┌─────────────────────────────────────┐
│     Cron Schedule (every 1-6h)     │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Isolated AgentTurn Session        │
│  (Real Estate Scraper Task)         │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Multi-Source Web Scraper          │
│  - Fetch listings                  │
│  - Parse & normalize data          │
│  - Store in local DB               │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Change Detection & Filtering      │
│  - Compare with previous state     │
│  - Identify NEW listings           │
│  - Apply search criteria           │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Notification System              │
│  - Discord alerts                  │
│  - JSON storage for review         │
│  - Rich formatted messages         │
└─────────────────────────────────────┘
```

### 3. Data Model

Each listing will have:
```json
{
  "id": "unique-identifier",
  "source": "seloger|leboncoin|pap",
  "title": "Property title",
  "price": 250000,
  "currency": "EUR",
  "location": {
    "address": "123 Rue de Paris",
    "city": "Paris",
    "postal_code": "75001",
    "region": "Île-de-France",
    "lat": 48.8566,
    "lon": 2.3522
  },
  "property": {
    "type": "apartment|house|land",
    "rooms": 3,
    "bedrooms": 2,
    "bathrooms": 1,
    "sqm": 85,
    "floor": 2,
    "parking": true,
    "outdoor_space": "balcony|terrace|garden"
  },
  "description": "Full description",
  "images": ["url1", "url2"],
  "url": "direct listing URL",
  "agent": "name",
  "phone": "contact",
  "posted_at": "2026-05-25T12:30:00Z",
  "first_seen": "2026-05-25T14:00:00Z",
  "last_updated": "2026-05-25T14:00:00Z",
  "status": "active|sold|removed"
}
```

### 4. Search Criteria (Configurable)

Users can specify:
- Location (city, postal code, region)
- Property type
- Price range
- Number of rooms
- Minimum area (sqm)
- Outdoor space preferences
- Keywords to include/exclude

### 5. Storage

- **Current listings**: `listings_db.json` (in-memory, updated per run)
- **Historical data**: `listings_history.jsonl` (append-only log)
- **Search config**: `search_config.json`
- **Alerts log**: `alerts_log.jsonl`

### 6. Recurrence & Alerts

- **Default schedule**: Every 2 hours (configurable via cron)
- **Notification**: Discord direct message with summary
- **Format**: Embeds with property details, images, and links
- **Deduplication**: Tracks seen listings to avoid duplicate alerts

## Implementation Phases

### Phase 1: Core Scraper (This Turn)
- [ ] Create skill with scraper logic
- [ ] Implement parsers for at least 2 sources
- [ ] Set up local storage
- [ ] Basic change detection

### Phase 2: Filtering & Criteria
- [ ] Build search criteria system
- [ ] Implement filtering logic
- [ ] Create config management

### Phase 3: Notifications
- [ ] Implement Discord alert format
- [ ] Rich message with images
- [ ] Summary statistics

### Phase 4: Deployment
- [ ] Create cron job
- [ ] Set up error handling & retries
- [ ] Add monitoring

## API Limitations & Workarounds

⚠️ Most sites don't have public APIs. We'll use:
- Browser tool with web_fetch for HTML scraping
- Careful rate limiting to avoid being blocked
- User-Agent rotation if needed
- Fallback to public APIs where available

## Security & Ethics

✅ Web scraping is legal for public listings
✅ We follow robots.txt
✅ We use reasonable rate limits
✅ We don't store or misuse personal data
✅ Focus is aggregation, not spam
