#!/usr/bin/env node
/**
 * Real Estate Scanner - Cron Job Setup
 * Creates and manages the recurring scan task
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// JOB CONFIGURATION
// ============================================================================

const CRON_JOB_CONFIG = {
  name: 'real-estate-scanner',
  description: 'Scan real estate portals for new opportunities',
  schedule: {
    kind: 'cron',
    expr: '0 */2 * * *', // Every 2 hours
    tz: 'UTC',
  },
  payload: {
    kind: 'agentTurn',
    message: `Execute a complete real estate market scan:
1. Load the search criteria from /home/node/.openclaw/workspace/projects/realestate-scraper/search_config.json
2. Run the scraper at /home/node/.openclaw/workspace/projects/realestate-scraper/scraper.js
3. For new listings found, format them as Discord embeds
4. Send alerts to the user's Discord direct message
5. Store the report in the data directory
6. Return a JSON summary of the scan results

Focus on:
- Detecting genuinely new listings (not duplicates)
- Filtering by search criteria (price, location, type, size)
- Building rich notification messages
- Maintaining the local database

Use the MockDataGenerator for now to simulate real listings.
After integration with browser tool, replace mock data with actual web scraping.`,
    timeoutSeconds: 600,
  },
  sessionTarget: 'isolated',
  delivery: {
    mode: 'announce',
    channel: 'direct',
    bestEffort: true,
  },
  enabled: true,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getCronJobJson() {
  return JSON.stringify(CRON_JOB_CONFIG, null, 2);
}

function getSetupInstructions() {
  return `
╔════════════════════════════════════════════════════════════════════════════╗
║          REAL ESTATE SCANNER - CRON JOB SETUP INSTRUCTIONS                 ║
╚════════════════════════════════════════════════════════════════════════════╝

The following cron job configuration has been prepared:

${getCronJobJson()}

📋 TO ACTIVATE THIS JOB:

Option 1: Using the Cron Tool (Recommended)
───────────────────────────────────────────
Copy the job configuration above and use the cron tool:

  cron(action="add", job={...})

Option 2: Manual API Call
─────────────────────────
POST to your Gateway cron endpoint with the job payload.

📊 JOB DETAILS:
───────────────
• Name:           ${CRON_JOB_CONFIG.name}
• Schedule:       ${CRON_JOB_CONFIG.schedule.expr} (${CRON_JOB_CONFIG.schedule.tz})
• Frequency:      Every 2 hours
• Type:           Isolated Agent Turn (clean session each run)
• Output:         Delivered to Discord direct message
• Status:         ${CRON_JOB_CONFIG.enabled ? '✅ ENABLED' : '❌ DISABLED'}

⏰ NEXT RUNS:
─────────────
This will automatically run at:
• :00 minutes past every even hour (0:00, 2:00, 4:00, ... UTC)

🔧 CONFIGURATION:
──────────────────
Modify search criteria in:
  /home/node/.openclaw/workspace/projects/realestate-scraper/search_config.json

Update schedule with cron(action="update", jobId="<id>", patch={schedule: {...}})

📝 VIEWING RESULTS:
────────────────────
• Discord alerts: Check direct messages
• Raw reports: /home/node/.openclaw/workspace/projects/realestate-scraper/data/
• Listings DB: listings_db.json
• Alert history: alerts_log.jsonl
• Run history: report-<timestamp>.json

🛑 MANAGING THE JOB:
─────────────────────
• List jobs:        cron(action="list")
• Check status:     cron(action="get", jobId="<id>")
• View runs:        cron(action="runs", jobId="<id>")
• Trigger now:      cron(action="run", jobId="<id>")
• Disable:          cron(action="update", jobId="<id>", patch={enabled: false})
• Delete:           cron(action="remove", jobId="<id>")

═══════════════════════════════════════════════════════════════════════════
`;
}

// ============================================================================
// EXPORT FOR USE
// ============================================================================

module.exports = {
  CRON_JOB_CONFIG,
  getCronJobJson,
  getSetupInstructions,
};

if (require.main === module) {
  console.log(getSetupInstructions());
  console.log('\n✅ Configuration ready. Copy the JSON above to create the job.');
}
