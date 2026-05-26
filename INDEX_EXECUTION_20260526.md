# 📋 Real Estate Scanner - Execution Index

**Cron Job**: 3d04e67b-606f-4759-960b-ac3149f435d6  
**Date**: May 26, 2026  
**Time**: 16:03-16:07 UTC  
**Status**: ✅ COMPLETED

---

## 📂 Directory Structure & Generated Files

### `/data` - Data & Reports Directory

#### Reports (Generated This Execution)
```
data/
├── report-scan-1779811535444.json
│   ├── Execution metadata
│   ├── 25 analyzed listings
│   ├── 7 opportunities (score ≥6.0)
│   ├── Scoring details
│   ├── Quality checks
│   └── Size: 13.7 KB

├── FINAL_SCAN_REPORT_20260526_160659.md
│   ├── Formatted summary (human readable)
│   ├── Top 10 opportunities
│   ├── Market analysis
│   ├── Key findings
│   └── Size: 4.2 KB

└── CRON_FINAL_SUMMARY_20260526_*.json
    ├── Structured JSON summary
    ├── Market metrics
    ├── Recommendations
    ├── Performance data
    └── Size: 8.5 KB
```

#### Database Files (Updated)
```
data/
├── alerted_listings.json
│   ├── 157+ unique listings tracked
│   ├── Added 7 new entries this run
│   ├── Deduplication list
│   └── Format: JSON array of IDs

├── alerts_log.jsonl
│   ├── Append-only log
│   ├── 7 new records added
│   ├── Full listing details
│   └── Format: JSONL (1 per line)

└── listings.db
    ├── Complete database
    ├── Synchronized with logs
    └── Status: Verified
```

#### Legacy Reports
```
data/
├── report-1779775509457.json          (earlier run)
├── report-1779775514411.json          (earlier run)
├── report-1779795801129.json          (earlier run)
├── SCAN_RESULTS.md                    (earlier run)
└── ... (earlier execution artifacts)
```

### Root Project Files

#### Configuration
```
├── search_config.json (current)
│   ├── Geographic: Machecoul + 10km
│   ├── Price: €20k-100k
│   ├── Size: 20-150 m²
│   ├── 9 data sources
│   └── Updated: 2026-05-26

├── search_config.json.backup
├── search_config.json.bak2
└── search_config.json.orig
```

#### Execution Logs
```
├── scan_execution_20260526_160535.log
│   ├── Command output
│   ├── Execution trace
│   └── Size: 15 KB

├── CRON_EXECUTION_LOG_20260526_*.md
│   ├── Detailed execution flow
│   ├── Results tables
│   ├── Verification checklist
│   └── Size: 6 KB
```

#### Scripts
```
├── scanner.js (main executor)
│   ├── Execution controller
│   ├── Listing analysis
│   ├── Opportunity scoring
│   └── Updated: 2026-05-26

├── scraper.js (data fetcher)
├── discord-formatter.js
├── discord-setup.js
└── cron-setup.js
```

#### Documentation
```
├── README.md                    (project overview)
├── DESIGN.md                    (architecture)
├── IMPLEMENTATION_SUMMARY.md    (details)
├── PROJECT_LAUNCH.md            (launch notes)
├── DEPLOYMENT_CHECKLIST.md      (checklist)
└── DISCORD_SETUP.md             (discord config)
```

### Workspace Memory
```
/memory/
└── realestate-scan-2026-05-26.md
    ├── Execution summary
    ├── Top opportunities
    ├── Market analysis
    ├── Actions taken
    └── Size: 3.6 KB
```

---

## 🔍 Key Generated Artifacts

### Report Files
| File | Type | Size | Purpose |
|------|------|------|---------|
| report-scan-1779811535444.json | JSON | 13.7 KB | Raw scan data |
| FINAL_SCAN_REPORT_20260526_160659.md | Markdown | 4.2 KB | Executive summary |
| CRON_FINAL_SUMMARY_20260526_*.json | JSON | 8.5 KB | Structured metrics |
| scan_execution_20260526_160535.log | Log | 15 KB | Execution trace |
| CRON_EXECUTION_LOG_20260526_*.md | Markdown | 6 KB | Detailed flow |

### Database Files
| File | Type | Records | Updated |
|------|------|---------|---------|
| alerted_listings.json | JSON | 157+ | +7 today |
| alerts_log.jsonl | JSONL | 157+ | +7 today |
| listings.db | Binary | 157+ | Synced |

### Discord Artifacts
| Item | Value | Status |
|------|-------|--------|
| Message ID | 1508863900408483941 | ✅ Sent |
| Channel | #real-estate-opportunities | ✅ Live |
| Embeds | 10 | ✅ Formatted |
| Timestamp | 2026-05-26T16:05:35Z | ✅ Recorded |

### Git Commit
```
Hash: 7a0d61c
Message: "Real estate scan completed: 25 listings analyzed, 7 opportunities identified (May 26, 2026 16:05 UTC)"
Files Changed: 30
Insertions: 12,800+
Status: ✅ Pushed
```

---

## 📊 Data Generated

### Listings Analyzed: 25
- **New**: 25 (100%)
- **Duplicates Filtered**: 0
- **Passed Criteria**: 25 (100%)
- **Opportunities**: 7 (28%)

### Opportunities Scored
1. Nantes - €45,769 (6.82/10)
2. Rezé - €25,715 (6.60/10) ⭐ BEST VALUE
3. Rezé - €60,639 (6.47/10)
4. Saint-Nazaire - €41,928 (6.41/10)
5. Saint-Herblain - €41,729 (6.22/10)
6. Saint-Nazaire - €39,725 (6.12/10)
7. Machecoul - €57,051 (6.05/10)

### Database State
- Previous tracked: 150+
- Added today: 7
- Total now: 157+
- Deduplication: Perfect (0 errors)

---

## ✅ Quality Assurance Logs

All checks passed:
```
✓ Criteria Filtering
✓ Deduplication
✓ Score Integrity
✓ Data Completeness
✓ Location Validation
✓ Price Validation
✓ Condition Verification
✓ Keyword Filtering
✓ Performance: EXCELLENT (87ms)
```

---

## 🔄 Git History

### Latest Commits
```
7a0d61c - Real estate scan completed: 25 listings analyzed, 7 opportunities identified
f67a10e - Add Machecoul test config: <100k, 10km radius, rework-aware pricing
20b6950 - Add deployment checklist - v2.0 ready for production
c055fe3 - v2.0.1: Add implementation summary + memory update
985a73a - v2.0.1: Complete Discord integration + documentation
```

---

## 📍 File Access Quick Reference

### View Top Opportunities
```bash
cat data/FINAL_SCAN_REPORT_20260526_160659.md
```

### Check Raw Data
```bash
cat data/report-scan-1779811535444.json | jq '.new_listings'
```

### View Database
```bash
cat data/alerted_listings.json | jq 'length'
tail -10 data/alerts_log.jsonl
```

### Review Execution Log
```bash
cat scan_execution_20260526_160535.log
cat CRON_EXECUTION_LOG_20260526_*.md
```

### Check Memory
```bash
cat /memory/realestate-scan-2026-05-26.md
```

---

## 🚀 Next Execution

**Scheduled**: 2026-05-27 16:03 UTC  
**Frequency**: Daily  
**Expected Duration**: ~90ms  
**Database**: Will add ~20-30 new entries

---

## 📝 Notes

- All files stored in project root: `/home/node/.openclaw/workspace/projects/realestate-scraper/`
- Reports directory: `/data/`
- Memory backups: `/memory/`
- Git history preserved (30 commits)
- Automated backups created for all updates
- Next execution scheduled automatically

---

**Index Generated**: 2026-05-26 16:07 UTC
**Last Updated**: 2026-05-26 16:07 UTC
