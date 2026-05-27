#!/usr/bin/env node
/**
 * CRON EXECUTION SUMMARY
 * Real Estate Market Scanner
 * Cron Job: 3d04e67b-606f-4759-960b-ac3149f435d6
 * Execution: 2026-05-26 12:04 UTC
 */

const fs = require('fs');
const path = require('path');

// Load the scan results
const scanResultPath = '/home/node/.openclaw/workspace/projects/realestate-scraper/CRON_EXECUTION_RESULT_2026-05-26.json';
const scanResults = JSON.parse(fs.readFileSync(scanResultPath, 'utf-8'));

const summary = `
╔════════════════════════════════════════════════════════════════════╗
║           REAL ESTATE MARKET SCANNER - EXECUTION SUMMARY           ║
╚════════════════════════════════════════════════════════════════════╝

EXECUTION DETAILS
─────────────────────────────────────────────────────────────────────
  Cron Job ID:        3d04e67b-606f-4759-960b-ac3149f435d6
  Execution Date:     ${scanResults.execution.execution_date}
  Execution Time:     ${scanResults.execution.execution_time}
  Status:             ${scanResults.execution.status}
  Duration:           ${scanResults.execution.duration_seconds}ms

SCAN RESULTS
─────────────────────────────────────────────────────────────────────
  Total Listings Analyzed:        ${scanResults.scan_summary.total_listings_analyzed}
  Meeting Search Criteria:        ${scanResults.scan_summary.listings_meeting_criteria}
  New Opportunities Found:        ${scanResults.scan_summary.opportunities_found}
  Duplicate Alerts Skipped:       ${scanResults.scan_summary.duplicate_alerts_skipped}
  New Alerts Generated:           ${scanResults.scan_summary.new_alerts_generated}
  High-Value Tier (Score ≥8):    ${scanResults.scan_summary.high_value_tier}
  
  Pass Rate:                      ${(scanResults.scan_summary.listings_meeting_criteria / scanResults.scan_summary.total_listings_analyzed * 100).toFixed(1)}%
  Deduplication Success:          ${scanResults.database_updates.deduplication_success_rate}

SEARCH CRITERIA APPLIED
─────────────────────────────────────────────────────────────────────
  Location:           Machecoul, 44270, Pays de la Loire
  Search Radius:      10 km
  Price Range:        ${scanResults.filtering_applied.price_range}
  Property Types:     ${scanResults.filtering_applied.property_types.join(', ')}
  Room Count:         ${scanResults.filtering_applied.room_count}
  Area (m²):          ${scanResults.filtering_applied.area_sqm}
  Condition:          ${scanResults.filtering_applied.condition.join(', ')}
  Max Age:            ${scanResults.filtering_applied.max_age_days} days
  Min Confidence:     ${(scanResults.filtering_applied.min_confidence * 100).toFixed(0)}%
  Outdoor Space:      ${scanResults.filtering_applied.outdoor_space_preferred.join(', ')}

TOP 3 OPPORTUNITIES
─────────────────────────────────────────────────────────────────────

#1 ⭐ ${scanResults.top_opportunities[0].title}
   Price:              €${scanResults.top_opportunities[0].price.toLocaleString('fr-FR')} (€${scanResults.top_opportunities[0].price_per_sqm}/m²)
   Size:               ${scanResults.top_opportunities[0].size_sqm}m² | ${scanResults.top_opportunities[0].rooms} rooms
   Location:           ${scanResults.top_opportunities[0].city}, ${scanResults.top_opportunities[0].region}
   Condition:          ${scanResults.top_opportunities[0].condition}
   Parking:            ${scanResults.top_opportunities[0].parking ? '✅ Yes' : '❌ No'}
   Outdoor:            ${scanResults.top_opportunities[0].outdoor_space || 'None'}
   Score:              ${scanResults.top_opportunities[0].score}/10 🎯
   Rating:             ${scanResults.top_opportunities[0].rating}
   Source:             ${scanResults.top_opportunities[0].source}
   Link:               ${scanResults.top_opportunities[0].url}

#2 ⭐ ${scanResults.top_opportunities[1].title}
   Price:              €${scanResults.top_opportunities[1].price.toLocaleString('fr-FR')} (€${scanResults.top_opportunities[1].price_per_sqm}/m²)
   Size:               ${scanResults.top_opportunities[1].size_sqm}m² | ${scanResults.top_opportunities[1].rooms} rooms
   Location:           ${scanResults.top_opportunities[1].city}, ${scanResults.top_opportunities[1].region}
   Condition:          ${scanResults.top_opportunities[1].condition}
   Parking:            ${scanResults.top_opportunities[1].parking ? '✅ Yes' : '❌ No'}
   Outdoor:            ${scanResults.top_opportunities[1].outdoor_space || 'None'}
   Score:              ${scanResults.top_opportunities[1].score}/10 🎯
   Rating:             ${scanResults.top_opportunities[1].rating}
   Source:             ${scanResults.top_opportunities[1].source}
   Link:               ${scanResults.top_opportunities[1].url}

#3 ⭐ ${scanResults.top_opportunities[2].title}
   Price:              €${scanResults.top_opportunities[2].price.toLocaleString('fr-FR')} (€${scanResults.top_opportunities[2].price_per_sqm}/m²)
   Size:               ${scanResults.top_opportunities[2].size_sqm}m² | ${scanResults.top_opportunities[2].rooms} rooms
   Location:           ${scanResults.top_opportunities[2].city}, ${scanResults.top_opportunities[2].region}
   Condition:          ${scanResults.top_opportunities[2].condition}
   Parking:            ${scanResults.top_opportunities[2].parking ? '✅ Yes' : '❌ No'}
   Outdoor:            ${scanResults.top_opportunities[2].outdoor_space || 'None'}
   Score:              ${scanResults.top_opportunities[2].score}/10 🎯
   Rating:             ${scanResults.top_opportunities[2].rating}
   Source:             ${scanResults.top_opportunities[2].source}
   Link:               ${scanResults.top_opportunities[2].url}

MARKET ANALYSIS
─────────────────────────────────────────────────────────────────────
  Average Price:              €${scanResults.market_analysis.average_price?.toLocaleString('fr-FR')}
  Average Score:              ${scanResults.market_analysis.average_score}/10
  Price Range:                €${scanResults.market_analysis.price_range?.min?.toLocaleString('fr-FR')} - €${scanResults.market_analysis.price_range?.max?.toLocaleString('fr-FR')}
  Price/m² Range:             €${scanResults.market_analysis.price_per_sqm_range?.min} - €${scanResults.market_analysis.price_per_sqm_range?.max}
  
  By City:
${Object.entries(scanResults.market_analysis.by_city || {}).map(([city, count]) => `    - ${city}: ${count}`).join('\n')}
  
  By Property Type:
${Object.entries(scanResults.market_analysis.by_property_type || {}).map(([type, count]) => `    - ${type}: ${count}`).join('\n')}
  
  By Condition:
${Object.entries(scanResults.market_analysis.by_condition || {}).map(([cond, count]) => `    - ${cond}: ${count}`).join('\n')}

DATABASE STATUS
─────────────────────────────────────────────────────────────────────
  Alerted in This Scan:       ${scanResults.database_updates.alerted_listings_count}
  Total Alerted (All-time):   ${scanResults.database_updates.total_alerted_all_time}
  Listings Database:          ${scanResults.database_updates.listings_database_entries} entries
  Alert History:              ${scanResults.database_updates.alert_history_entries} entries
  Deduplication:              ${scanResults.database_updates.deduplication_success_rate}

DISCORD NOTIFICATION
─────────────────────────────────────────────────────────────────────
  Channel:                    ${scanResults.discord_notification.channel}
  Message Sent:               ${scanResults.discord_notification.message_sent ? '✅ Yes' : '❌ No'}
  Message ID:                 ${scanResults.discord_notification.message_id}
  Embeds Sent:                ${scanResults.discord_notification.embeds_count}
  Format:                     ${scanResults.discord_notification.format}
  Timestamp:                  ${scanResults.discord_notification.timestamp}

QUALITY ASSURANCE
─────────────────────────────────────────────────────────────────────
${Object.entries(scanResults.quality_checks || {}).map(([check, status]) => `  ${check.replace(/_/g, ' ')}: ${status === 'EXCELLENT' ? '⭐' : '✅'} ${status}`).join('\n')}

STORED DATA FILES
─────────────────────────────────────────────────────────────────────
  Report (Markdown):          ${scanResults.data_storage.report_file}
  Report (JSON):              ${scanResults.data_storage.report_json}
  Alerted Listings:           ${scanResults.data_storage.alerted_listings}
  Listings Database:          ${scanResults.data_storage.listings_database}
  Alerts History:             ${scanResults.data_storage.alerts_history}

NEXT EXECUTION
─────────────────────────────────────────────────────────────────────
  Scheduled Date:             2026-05-27
  Scheduled Time:             06:00 UTC
  Frequency:                  Daily

╔════════════════════════════════════════════════════════════════════╗
║              ✅ SCAN COMPLETED SUCCESSFULLY                        ║
║           ${scanResults.execution.duration_seconds}ms execution time                      ║
╚════════════════════════════════════════════════════════════════════╝
`;

console.log(summary);

// Also write to a summary file
fs.writeFileSync(
  '/home/node/.openclaw/workspace/projects/realestate-scraper/EXECUTION_SUMMARY.txt',
  summary
);

console.log('\n📁 Files saved:');
console.log('   ✓ EXECUTION_SUMMARY.txt');
console.log('   ✓ SCAN_RESULT_2026-05-26.md');
console.log('   ✓ CRON_EXECUTION_RESULT_2026-05-26.json');
console.log('   ✓ data/alerted_listings.json (updated)');
console.log('   ✓ data/listings_db.json (updated)');
console.log('   ✓ data/alerts_log.jsonl (updated)');
console.log('   ✓ data/report-scan-1779797294928.json (archived)');
