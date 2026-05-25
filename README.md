# 🏘️ Real Estate Opportunity Scanner

A recurrent automated system that scans multiple real estate portals and alerts you to new opportunities matching your criteria—just like **MoteurImmo**.

## 🎯 Features

✅ **Multi-Source Aggregation**
- SeLoger, LeBonCoin, PAP, Bien'ici, ORPI
- Configurable search across multiple sources
- Deduplication across portals

✅ **Smart Filtering**
- Price range
- Property type (apartment, house, land)
- Location (city, postal code, region)
- Size (minimum/maximum sqm)
- Number of rooms
- Outdoor space (garden, terrace, balcony)
- Keyword inclusion/exclusion

✅ **Real-Time Alerts**
- Discord rich embeds with property details
- Automatic notifications for new listings
- Summary statistics and market analysis

✅ **Persistent Storage**
- Local database of all found listings
- History log (JSONL) for analysis
- Alert history for tracking
- Prevents duplicate alerts

✅ **Configurable Schedule**
- Default: Every 2 hours (UTC)
- Customizable cron expression
- Isolated execution environment
- Error handling & retries

## 📁 Project Structure

```
realestate-scraper/
├── DESIGN.md                 # Architecture & design document
├── README.md                 # This file
├── search_config.json        # Your search criteria
├── scraper.js                # Main scraper engine
├── web-scraper.js            # Web fetching & parsing
├── discord-formatter.js      # Discord notification formatting
├── cron-setup.js             # Cron job configuration
├── data/                     # Output directory
│   ├── listings_db.json      # Current listings (JSON)
│   ├── listings_history.jsonl # Historical log (JSONL)
│   ├── alerted_listings.json # IDs we've already alerted on
│   ├── alerts_log.jsonl      # Alert history
│   └── report-*.json         # Individual scan reports
└── package.json              # Dependencies (optional)
```

## ⚙️ Configuration

Edit `search_config.json` to customize your search:

```json
{
  "locations": [
    {
      "city": "Paris",
      "postal_code": "75001-75020",
      "region": "Île-de-France"
    }
  ],
  "property_type": ["apartment", "house"],
  "price_range": {
    "min": 150000,
    "max": 600000
  },
  "rooms": {
    "min": 2,
    "max": 5
  },
  "area_sqm": {
    "min": 50,
    "max": 200
  },
  "outdoor_space": ["balcony", "terrace", "garden"],
  "keywords_include": ["bright", "modern", "renovated"],
  "keywords_exclude": ["studio", "shared"],
  "sources": ["seloger", "leboncoin", "pap"],
  "max_days_old": 7,
  "notification_channel": "discord",
  "alert_threshold_new_listings": 1
}
```

## 🚀 Getting Started

### Step 1: Manual Test Run

```bash
cd /home/node/.openclaw/workspace/projects/realestate-scraper
node scraper.js
```

This will:
- Load your search criteria
- Simulate fetching from sources
- Apply filtering rules
- Generate a report
- Save results to `data/` directory

### Step 2: Set Up Cron Job

View the cron configuration:

```bash
node cron-setup.js
```

Then create the job using the OpenClaw cron tool:

```
cron(
  action="add",
  job={
    "name": "real-estate-scanner",
    "description": "Scan real estate portals for new opportunities",
    "schedule": {
      "kind": "cron",
      "expr": "0 */2 * * *",
      "tz": "UTC"
    },
    "payload": {
      "kind": "agentTurn",
      "message": "Execute a complete real estate market scan...",
      "timeoutSeconds": 600
    },
    "sessionTarget": "isolated",
    "delivery": {
      "mode": "announce",
      "channel": "direct",
      "bestEffort": true
    },
    "enabled": true
  }
)
```

### Step 3: Monitor Results

Check your Discord direct messages for alerts!

View stored results:

```bash
ls -la /home/node/.openclaw/workspace/projects/realestate-scraper/data/
cat data/listings_db.json | jq .
cat data/alerts_log.jsonl | tail -20
```

## 📊 Data Flow

```
┌─────────────────────────────────────────┐
│  Cron Job Triggers (every 2 hours)      │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Isolated Agent Session Spawned         │
│  (clean environment, full context)      │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Load Configuration & Previous State    │
│  - search_config.json                  │
│  - listings_db.json                    │
│  - alerted_listings.json               │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Fetch from All Configured Sources      │
│  - SeLoger (parse HTML)                │
│  - LeBonCoin (parse HTML)              │
│  - PAP (parse HTML)                    │
│  + Rate limiting & error handling      │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Apply Filters                          │
│  - Price range check                   │
│  - Property type match                 │
│  - Location verification               │
│  - Size & room requirements            │
│  - Keyword filtering                   │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Detect NEW Listings                    │
│  - Compare against listings_db.json    │
│  - Compare against alerted_listings.json│
│  - Identify truly new opportunities    │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Generate Report & Alerts               │
│  - Format Discord embeds                │
│  - Create summary statistics           │
│  - Prepare notification message        │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Persist Data                           │
│  - Update listings_db.json             │
│  - Append to listings_history.jsonl    │
│  - Update alerted_listings.json        │
│  - Save report-<timestamp>.json        │
│  - Log alert in alerts_log.jsonl       │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Send Discord Notification             │
│  - Rich embeds with property details   │
│  - Market statistics summary           │
│  - Direct message to user              │
└─────────────────────────────────────────┘
```

## 🔧 Advanced Usage

### Change Scan Frequency

Edit the cron expression in the job:

```
"0 */1 * * *"    # Every hour
"0 0 * * *"      # Daily at midnight
"0 9 * * MON"    # Every Monday at 9 AM
```

### Add More Search Criteria

Update `search_config.json`:

```json
{
  "locations": [
    {"city": "Paris"},
    {"city": "Lyon"},
    {"city": "Marseille"}
  ],
  "property_type": ["apartment", "house", "commercial"],
  ...
}
```

### View Scan History

```bash
# Last 10 alerts
tail -10 data/alerts_log.jsonl | jq .

# Total new listings found
grep -c "first_seen" data/listings_history.jsonl

# Price statistics
jq '.price' data/listings_db.json | jq -s 'add/length'
```

### Manually Trigger a Scan

```
cron(action="run", jobId="real-estate-scanner")
```

### Disable Temporary Maintenance

```
cron(
  action="update",
  jobId="real-estate-scanner",
  patch={enabled: false}
)
```

## 🌐 Real Scraping (Future Enhancement)

Currently uses mock data for demonstration. To enable real scraping:

1. **Use Browser Tool** for JavaScript-heavy sites:
   ```javascript
   browser(
     action="open",
     url="https://www.seloger.com/list.htm?...",
     snapshot=true
   )
   ```

2. **Use Cheerio** for simple HTML parsing:
   ```bash
   npm install cheerio axios
   ```

3. **Implement Rate Limiting**:
   - 2-5 second delays between requests
   - Rotate User-Agents
   - Respect robots.txt

4. **Handle Dynamic Content**:
   - Use Playwright/Puppeteer for JS-rendered sites
   - Parse JSON APIs when available
   - Implement headless browser mode

## 📋 Data Structure

### Listing Format

```json
{
  "id": "seloger-123456",
  "source": "seloger",
  "title": "Bright apartment with balcony",
  "price": 350000,
  "currency": "EUR",
  "location": {
    "address": "123 Rue de Paris",
    "city": "Paris",
    "postal_code": "75011",
    "region": "Île-de-France",
    "lat": 48.8566,
    "lon": 2.3522
  },
  "property": {
    "type": "apartment",
    "rooms": 3,
    "bedrooms": 2,
    "bathrooms": 1,
    "sqm": 85,
    "floor": 3,
    "parking": true,
    "outdoor_space": "balcony"
  },
  "description": "Recently renovated...",
  "images": ["https://..."],
  "url": "https://seloger.com/annonces/...",
  "agent": "Agent Name",
  "phone": "06XX XX XX XX",
  "posted_at": "2026-05-25T12:30:00Z",
  "first_seen": "2026-05-25T14:00:00Z",
  "last_updated": "2026-05-25T14:00:00Z",
  "status": "active"
}
```

## 🐛 Troubleshooting

### No Listings Found
- Check your search criteria are not too restrictive
- Verify internet connection
- Run manual test: `node scraper.js`
- Check `data/report-*.json` for details

### Duplicate Alerts
- Check `alerted_listings.json` for corrupted IDs
- Clear and restart: `rm data/alerted_listings.json`
- Ensure source URLs are consistent

### High Memory Usage
- Reduce `resultsByPage` in search URLs
- Archive old reports: `mv data/report-*.json archive/`
- Consider database migration for large scale

### Rate Limiting / IP Blocks
- Increase delay between requests
- Rotate User-Agents
- Use proxy rotation
- Respect robots.txt delays

## 📞 Support

- Check `DESIGN.md` for architecture details
- Review individual scan reports in `data/`
- Monitor Discord alerts for real-time feedback
- Check OpenClaw logs for cron execution errors

## 📄 License

This is part of the OpenClaw personal assistant system. Use responsibly and respect website terms of service.

---

**Next Step:** Run `node cron-setup.js` to see the exact cron job configuration you need to copy!
