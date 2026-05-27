#!/bin/bash

echo "🔍 DATABASE INTEGRITY VERIFICATION"
echo "===================================="
echo ""

echo "📊 Alerted Listings Count:"
jq '. | length' data/alerted_listings.json
echo ""

echo "📋 Listings Database Entries:"
jq '. | keys | length' data/listings_db.json 2>/dev/null || echo "No entries"
echo ""

echo "📝 Latest 3 Alert History Entries:"
tail -3 data/alerts_log.jsonl 2>/dev/null | jq -c . | head -3 || echo "No history"
echo ""

echo "✅ Last Report File Details:"
ls -lh data/report-scan*.json 2>/dev/null | tail -1
echo ""

echo "📄 Summary Files Created:"
ls -1 *2026-05-27* 2>/dev/null || echo "None yet"
ls -1 FINAL_*.json 2>/dev/null || echo "None yet"
echo ""

echo "🎯 Scan Timestamps (Last 5):"
ls -lt data/report-scan*.json 2>/dev/null | head -5 | awk '{print $6, $7, $8, $NF}'

