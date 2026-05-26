# Real Estate Scanner v2.0 - Best Opportunities Edition

## 🎯 Overview

Automated real estate opportunity scanner that identifies **best deals** across France: lower prices, better locations, spacious properties, and move-in ready conditions.

**Focus**: Value-optimized acquisitions, not exhaustive listings.

---

## 🚀 What's New in v2.0

### Refocused Criteria
- **Fewer expensive options** → Target €80k-€750k (was €150k-€600k)
- **Better locations** → 10 major cities instead of 1
- **More spacious** → 45-350m² range
- **Less renovation** → Exclude major red flags
- **Move-in ready** → Prioritize good/excellent condition

### Opportunity Scoring System
Instead of rigid filters, a **weighted scoring engine** (0-10):
```
Overall Score = (Price Ratio × 0.3) + (Location × 0.25) + (Space/€ × 0.2) + (Condition × 0.15) + (Isolation × 0.1)
```

**Components**:
- **Price Ratio** (30%): How close to target €/m²
- **Location Score** (25%): Preferred neighborhoods
- **Space/Euro** (20%): Sqm per €1000
- **Condition** (15%): Excellent/Good/Fair/Cosmetics
- **Isolation** (10%): No major work flags

### Expanded Sources
Now scans **9+ real estate portals**:
- SeLoger, LeBonCoin, PAP
- BienIci, ORPI
- Century21, Immobilier, Propriétés
- Direct agency listings

### Enhanced Discord Integration
- **Buy Advice Channel**: #real-estate-opportunities
- **Expert Recommendations**: Why buy each property
- **Score Tiers**: Excellent (≥9.0) / Very Good (8-9) / Good (7-8)
- **Market Stats**: Price distribution, location breakdown
- **Rich Embeds**: Full property details with images

---

## 📊 Scoring Example

```
Property: Apartment in Lyon, 85m², 3 rooms, €320,000
- Price: €3,765/m² vs target €4,000 → Score 0.81 (Price Ratio)
- Location: "quiet", "near-shops" → Score 0.6 (Location)
- Space: 85/320 × 1000 = 0.266 → Score 1.0 (Space/Euro)
- Condition: "renovated" → Score 0.9 (Condition)
- Red flags: None → Score 1.0 (Isolation)

Final: (0.81×0.3 + 0.6×0.25 + 1.0×0.2 + 0.9×0.15 + 1.0×0.1) × 10 = 8.4/10 ✨ VERY GOOD
```

---

## 📁 Project Structure

```
realestate-scraper/
├── scraper.js                 # v2.0 Scanner with opportunity scoring
├── discord-formatter.js        # Rich embeds + buy advice
├── discord-setup.js           # Channel configuration
├── search_config.json         # Configurable search criteria
├── discord_config.json        # Discord notification settings
├── cron-setup.js             # Automated job scheduler
├── data/
│   ├── listings_db.json      # All found listings
│   ├── listings_history.jsonl # Historical log
│   ├── alerted_listings.json  # Already notified
│   ├── alerts_log.jsonl       # Alert history
│   └── report-*.json          # Scan reports
├── DISCORD_SETUP.md          # Channel setup guide
└── README.md                 # This file
```

---

## ⚙️ Configuration

### search_config.json

```json
{
  "locations": [
    {"city": "Paris", "postal_code": "75001-75020"},
    {"city": "Lyon", "postal_code": "69001-69009"},
    ...
  ],
  "opportunity_scoring": {
    "enabled": true,
    "min_score": 7.0,
    "weights": {
      "price_ratio": 0.3,
      "location_score": 0.25,
      "space_per_euro": 0.2,
      "condition": 0.15,
      "isolation_factor": 0.1
    },
    "target_price_per_sqm": 4000,
    "preferred_neighborhoods": ["accessible", "quiet", "near-transport"]
  },
  "price_range": {"min": 80000, "max": 750000},
  "area_sqm": {"min": 45, "max": 350},
  "condition": ["good", "excellent", "renovated", "needing-cosmetics"],
  "keywords_exclude": ["needs-major-work", "renovation-needed", "asbestos"]
}
```

---

## 🚀 Usage

### Run Manual Scan
```bash
node scraper.js
```

Output:
```
REAL ESTATE SCANNER v2.0 - BEST OPPORTUNITIES
═════════════════════════════════════════════
🔍 Fetching from 9 sources...
   📊 Total listings fetched: 150
   ✅ After filtering: 87
   ⭐ TOP OPPORTUNITIES (score ≥ 7.0): 23

📈 Report generated
✅ Report saved to: data/report-1779773238864.json
```

### Send to Discord
```bash
# First, create the channel in Discord
# Then set up cron job
node cron-setup.js --channel real-estate-opportunities

# Or test manually
node discord-integration.js
```

### View Reports
```bash
cat data/report-*.json | jq '.summary'
```

---

## 🎨 Discord Output Format

### Summary Embed
```
🏘️ Best Real Estate Opportunities - Daily Report
📊 Market scan for May 26, 2026

⭐ Top Opportunities: 23
🌟 Excellent (≥9.0): 4
✨ Very Good (8-9): 8
🎯 Good (7-8): 11

💰 Average Price: €385,000
⚖️ Average Score: 8.2/10
📊 Price Range: €180,000 - €680,000
```

### Individual Opportunity Card
```
🎯 Apartment in Lyon, 3 rooms, 85m²

🌟 Opportunity Score: 8.4/10
💰 €320,000 (€3,765/m²)
🏠 Apartment | 📏 85 m² | 🛏️ 3 rooms
🚗 ✅ Parking | 🌳 Near-shops
🔧 Renovated | 📍 Lyon (69001)

Why: Move-in ready, excellent price-to-space ratio
🔗 [View Details]
```

### Buy Advice Section
```
🎯 TOP BUY RECOMMENDATIONS 🎯

🥇 Apartment in Lyon...
   Score: 8.4/10 | €320,000 (€3,765/m²)
   85m² | 3 rooms | Lyon
   Why: Move-in ready, excellent price-to-space ratio
   🔗 [View Details]

🥈 House in Nantes...
   ...
```

---

## 🔧 Advanced Configuration

### Adjust Opportunity Threshold
```json
"opportunity_scoring": {
  "min_score": 7.5  // Higher = fewer but better deals
}
```

### Change Target Price/m²
```json
"opportunity_scoring": {
  "target_price_per_sqm": 3500  // Regional variation
}
```

### Add Preferred Neighborhoods
```json
"opportunity_scoring": {
  "preferred_neighborhoods": ["accessible", "quiet", "family-friendly", "vibrant"]
}
```

### Exclude More Cities
```json
"locations": [
  // Remove Paris, keep only secondary cities
  {"city": "Lyon"},
  {"city": "Marseille"}
]
```

---

## 📈 Upcoming Features

- [ ] Real web scraping (Puppeteer/Playwright)
- [ ] ML scoring model trained on market data
- [ ] Email alerts with digest
- [ ] Price history tracking
- [ ] Neighborhood analysis (walkability, schools, transport)
- [ ] Investment ROI calculator
- [ ] Mortgage affordability check

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2026-05-26 | Refocus on best opportunities, scoring engine, Discord integration |
| 1.0 | 2026-05-25 | Initial multi-source aggregator |

---

## 🔐 Security

- No credentials stored in code
- Channel IDs from environment variables
- Database files in `.gitignore`
- Historical logs for audit trail

---

## 📞 Support

See `DISCORD_SETUP.md` for channel configuration.

For issues or questions: Check data/report-*.json for detailed scan logs.

---

**Scanner v2.0** • Best Opportunities Edition • May 2026
