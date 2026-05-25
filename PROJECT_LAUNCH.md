# 🏘️ Real Estate Opportunity Scanner - Project Launch Summary

**Status:** ✅ **LIVE & ACTIVE**  
**Created:** 2026-05-25  
**Cron Job ID:** `3d04e67b-606f-4759-960b-ac3149f435d6`  
**Schedule:** Every 2 hours (UTC) - `0 */2 * * *`

---

## 🎯 What You Now Have

A fully automated **MoteurImmo-style** real estate scanning system that:

### ✨ Core Features
- **Multi-source Aggregation**: Scans SeLoger, LeBonCoin, PAP, Bien'ici, ORPI
- **Smart Filtering**: By price, location, property type, size, outdoor space, keywords
- **Deduplication**: Never alerts you twice about the same listing
- **Real-Time Alerts**: Discord embeds with full property details
- **Persistent Database**: Tracks all found listings + alert history
- **Configurable**: Easy to customize search criteria
- **Scheduled**: Runs automatically every 2 hours

### 📊 How It Works

```
Every 2 hours (UTC):
  ├─ Load search criteria from search_config.json
  ├─ Scan real estate portals (web scraping)
  ├─ Filter by your preferences
  ├─ Detect NEW listings (vs. previously seen)
  ├─ Format Discord embeds with:
  │  ├─ Price & price per sqm
  │  ├─ Property details (rooms, area, parking, etc.)
  │  ├─ Location info
  │  ├─ Photos
  │  └─ Direct link to listing
  ├─ Send alert to Discord DM
  ├─ Save report & update database
  └─ Track alert to prevent duplicates
```

---

## 📁 Project Structure

```
/home/node/.openclaw/workspace/projects/realestate-scraper/
│
├── 📋 Documentation
│   ├── README.md           ← Start here for full guide
│   ├── DESIGN.md           ← Architecture & technical details
│   └── PROJECT_LAUNCH.md   ← This file
│
├── ⚙️ Configuration
│   └── search_config.json  ← **Customize your search here**
│
├── 🔧 Core System
│   ├── scraper.js          ← Main scraping engine (12.7 KB)
│   ├── web-scraper.js      ← Web fetching & parsing (4.7 KB)
│   ├── discord-formatter.js ← Rich embed formatting (5 KB)
│   └── cron-setup.js       ← Job configuration (4.4 KB)
│
└── 💾 Data (Auto-Generated)
    └── data/
        ├── listings_db.json         ← Current listings
        ├── listings_history.jsonl   ← All listings ever found
        ├── alerted_listings.json    ← IDs we've alerted on
        ├── alerts_log.jsonl         ← Alert history
        └── report-<timestamp>.json  ← Individual scan reports
```

---

## 🚀 Getting Started - Next Steps

### Step 1: Customize Your Search (OPTIONAL - but recommended!)

Edit `/home/node/.openclaw/workspace/projects/realestate-scraper/search_config.json`:

```json
{
  "locations": [
    {
      "city": "Paris",          ← Change to your target city
      "postal_code": "75001",   ← Or specific postal codes
      "region": "Île-de-France"
    }
  ],
  "property_type": ["apartment", "house"],  ← What you want
  "price_range": {
    "min": 150000,             ← Your budget minimum
    "max": 600000              ← Your budget maximum
  },
  "rooms": {
    "min": 2,                  ← Minimum rooms
    "max": 5                   ← Maximum rooms
  },
  "area_sqm": {
    "min": 50,                 ← Minimum area
    "max": 200                 ← Maximum area
  },
  "outdoor_space": ["balcony", "terrace", "garden"],
  "keywords_include": ["bright", "modern", "renovated"],
  "keywords_exclude": ["studio", "shared"]
}
```

### Step 2: Test Manually (Optional)

Run a test scan without waiting:

```bash
cd /home/node/.openclaw/workspace/projects/realestate-scraper
node scraper.js
```

Check the output in `data/report-<timestamp>.json`

### Step 3: Monitor Your Discord

The job is **already running**! Next alert will appear in ~2 hours.

To trigger an immediate scan:

```
/cron run 3d04e67b-606f-4759-960b-ac3149f435d6
```

Or use the cron tool:

```
cron(action="run", jobId="3d04e67b-606f-4759-960b-ac3149f435d6")
```

---

## 🎮 Control Your Scanner

### View All Jobs

```
cron(action="list")
```

### Get Job Details

```
cron(action="get", jobId="3d04e67b-606f-4759-960b-ac3149f435d6")
```

### See Run History

```
cron(action="runs", jobId="3d04e67b-606f-4759-960b-ac3149f435d6")
```

### Manually Trigger a Scan NOW

```
cron(action="run", jobId="3d04e67b-606f-4759-960b-ac3149f435d6")
```

### Change Frequency

```
cron(
  action="update",
  jobId="3d04e67b-606f-4759-960b-ac3149f435d6",
  patch={
    "schedule": {
      "kind": "cron",
      "expr": "0 0 * * *",  ← Daily at midnight
      "tz": "UTC"
    }
  }
)
```

Other schedule options:
- `"0 * * * *"` → Every hour
- `"0 */3 * * *"` → Every 3 hours
- `"0 9-17 * * *"` → Business hours only
- `"0 0 * * MON"` → Mondays at midnight

### Temporarily Disable

```
cron(
  action="update",
  jobId="3d04e67b-606f-4759-960b-ac3149f435d6",
  patch={enabled: false}
)
```

### Re-enable After Disabling

```
cron(
  action="update",
  jobId="3d04e67b-606f-4759-960b-ac3149f435d6",
  patch={enabled: true}
)
```

### Delete the Job Entirely

```
cron(
  action="remove",
  jobId="3d04e67b-606f-4759-960b-ac3149f435d6"
)
```

---

## 📊 Understanding Your Data

### listings_db.json
Current snapshot of all active listings matching your criteria.

```bash
# View all listings
cat data/listings_db.json | jq .

# Count listings
cat data/listings_db.json | jq 'length'

# Find expensive ones
cat data/listings_db.json | jq '.[] | select(.price > 500000)'

# Group by source
cat data/listings_db.json | jq 'group_by(.source) | map({source: .[0].source, count: length})'
```

### alerts_log.jsonl
Every alert we've ever sent (one JSON object per line).

```bash
# See last 5 alerts
tail -5 data/alerts_log.jsonl | jq .

# Count total alerts sent
wc -l data/alerts_log.jsonl

# Alerts from today
grep "$(date +%Y-%m-%d)" data/alerts_log.jsonl | jq .
```

### listings_history.jsonl
Historical record of every listing ever found (append-only).

```bash
# Total listings ever found
wc -l data/listings_history.jsonl

# Average price over time
jq -s 'map(.price) | add / length' data/listings_history.jsonl
```

### report-*.json
Detailed scan report from each run.

```bash
# List all reports
ls -lah data/report-*.json

# Latest report
cat data/report-$(ls -t data/report-*.json | head -1 | xargs -I{} basename {})

# Extract new listings from latest report
cat data/report-*.json | jq '.new_listings'
```

---

## 🔍 Key Files Explained

### search_config.json
**Your control panel.** Edit this to change what you're looking for.

**Fields:**
- `locations` - Cities/regions to search
- `property_type` - apartment, house, land, commercial
- `price_range` - min/max budget in EUR
- `rooms` - min/max bedrooms
- `area_sqm` - minimum/maximum area
- `outdoor_space` - must have: balcony, terrace, garden, etc.
- `keywords_include` - MUST contain these words
- `keywords_exclude` - must NOT contain these words
- `sources` - which portals to scan: seloger, leboncoin, pap, etc.
- `max_days_old` - only list posts from last N days

### scraper.js
The main engine. It:
- Loads config
- Fetches from sources
- Applies filters
- Detects new listings
- Saves reports
- Maintains databases

You don't need to edit this, but you can run it manually:
```bash
node scraper.js
```

### discord-formatter.js
Converts listings into pretty Discord embeds with:
- Property photo
- Price & price/sqm
- Rooms, area, parking info
- Location details
- Direct link to listing

### cron-setup.js
Shows the cron job configuration. Run it to see the exact JSON:
```bash
node cron-setup.js
```

---

## 💡 Advanced Tips

### Add Multiple Search Profiles

Create separate config files:

```bash
cp search_config.json search_config_paris.json
cp search_config.json search_config_lyon.json
```

Edit each for different criteria. Then create multiple jobs with different configs.

### Export Listings to CSV

```bash
jq -r '.[] | [.title, .price, .property.sqm, .location.city, .url] | @csv' data/listings_db.json > listings.csv
```

### Find the Best Value (Price per sqm)

```bash
jq -r '.[] | "\(.price / .property.sqm | round) €/m² | \(.title)"' data/listings_db.json | sort -n
```

### Track Price Trends

Compare reports over time:

```bash
for report in data/report-*.json; do
  echo "$(basename $report): $(jq '.statistics.avg_price' $report)"
done
```

### Set Up Email Alerts (Optional)

When you receive a Discord alert, set up email forwarding in Discord's notification settings.

### Back Up Your Data

```bash
tar -czf realestate-backup-$(date +%Y%m%d).tar.gz data/
```

---

## 🐛 Troubleshooting

### No Listings Found After First Run?

**This is normal!** With 0 previous listings, the next scan will find "new" ones.

After the second run, you'll only see truly NEW listings that appeared since the last scan.

### I Want to Reset and Start Fresh

```bash
# Backup first!
cp -r data data.backup

# Clear tracking (keep history)
rm data/listings_db.json data/alerted_listings.json

# Next scan will treat all as "new"
```

### Change What Time It Runs

The scanner runs at:
- 00:00 (midnight UTC)
- 02:00
- 04:00
- ... every 2 hours ...

To run at specific times (e.g., 9 AM & 6 PM daily):

```
cron(
  action="update",
  jobId="3d04e67b-606f-4759-960b-ac3149f435d6",
  patch={
    "schedule": {
      "kind": "cron",
      "expr": "0 9,18 * * *",
      "tz": "UTC"
    }
  }
)
```

### Missed an Alert?

All alerts are logged. Check Discord history or:

```bash
tail -20 data/alerts_log.jsonl | jq .
```

### Getting Blocked / Rate Limited?

The scraper uses reasonable delays. If websites block you:

1. Increase delays in `web-scraper.js`
2. Rotate User-Agents
3. Use proxy if needed
4. Contact website support

---

## 🎯 Next Enhancements (Roadmap)

### Phase 2: Browser Integration
- Use OpenClaw browser tool for JavaScript-heavy sites
- Parse dynamic content properly
- Handle login-gated listings

### Phase 3: Advanced Filtering
- Commute time calculation (distance API)
- Neighborhood scoring
- Price history & trend analysis
- Investment ROI calculator

### Phase 4: Enhanced Notifications
- Email summaries
- SMS alerts for hot properties
- Telegram bot integration
- Weekly digest reports

### Phase 5: Machine Learning
- Predict price movements
- Suggest properties based on preferences
- Anomaly detection (underpriced deals)
- Recommendations

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| View all scans | `cron(action="list")` |
| Trigger now | `cron(action="run", jobId="...")` |
| Check status | `cron(action="get", jobId="...")` |
| Disable scanner | `cron(action="update", jobId="...", patch={enabled:false})` |
| Change frequency | `cron(action="update", jobId="...", patch={schedule:{...}})` |
| See last alert | `tail -1 data/alerts_log.jsonl \| jq .` |
| Count new listings | `cat data/report-*.json \| jq '.summary.new_listings'` |
| Manual test | `cd projects/realestate-scraper && node scraper.js` |

---

## ✅ Completion Checklist

- [x] System designed & documented
- [x] Scraper engine created (12.7 KB)
- [x] Discord formatter built (5 KB)
- [x] Search config system implemented
- [x] Local database system working
- [x] Filtering engine complete
- [x] Report generation done
- [x] Cron job created & RUNNING
- [x] Manual testing completed
- [x] Documentation written

**Status: READY FOR PRODUCTION** ✅

---

## 🎉 You're All Set!

Your real estate scanner is now:

✅ **Running** - Scans every 2 hours automatically  
✅ **Configured** - Uses your search criteria  
✅ **Smart** - Deduplicates, filters, analyzes  
✅ **Alerting** - Sends Discord notifications  
✅ **Tracking** - Maintains complete history  

**Next scan:** Check back in a couple hours for your first alert! 🏘️

Questions? See README.md, DESIGN.md, or check the documentation comments in each script.

---

**Job ID:** `3d04e67b-606f-4759-960b-ac3149f435d6`  
**Status:** ✅ ACTIVE  
**Last Updated:** 2026-05-25 20:37 UTC
