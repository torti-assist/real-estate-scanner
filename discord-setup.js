#!/usr/bin/env node
/**
 * Discord Integration Setup
 * Creates and configures the real-estate-opportunities channel
 */

const { DiscordNotificationFormatter } = require('./discord-formatter');
const fs = require('fs');
const path = require('path');

const DISCORD_CONFIG = {
  channel_name: 'real-estate-opportunities',
  channel_topic: '🏠 Best real estate opportunities - Buy recommendations from automated scanner v2.0',
  channel_description: 'Daily top real estate opportunities with scoring, price analysis, and expert buy advice',
  notification_type: 'buy-advice',
  mention_on_top_opportunity: true,
  group_by: 'score',
};

/**
 * Setup Discord Channel
 */
async function setupDiscordChannel() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     DISCORD CHANNEL SETUP - REAL ESTATE OPPORTUNITIES     ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('📋 Configuration:');
  console.log(`   Channel: #${DISCORD_CONFIG.channel_name}`);
  console.log(`   Topic: ${DISCORD_CONFIG.channel_topic}`);
  console.log(`   Notification Type: ${DISCORD_CONFIG.notification_type}`);
  console.log(`   Grouping: By ${DISCORD_CONFIG.group_by}\n`);

  // Save Discord configuration
  const configPath = path.join(__dirname, 'discord_config.json');
  fs.writeFileSync(configPath, JSON.stringify(DISCORD_CONFIG, null, 2));
  console.log(`✅ Discord config saved to: discord_config.json\n`);

  // Create channel setup instructions
  const instructions = `# Discord Channel Setup - Real Estate Opportunities

## Channel Information

- **Channel Name**: #${DISCORD_CONFIG.channel_name}
- **Type**: Text Channel
- **Topic**: ${DISCORD_CONFIG.channel_topic}
- **Description**: ${DISCORD_CONFIG.channel_description}

## Features

### 🎯 Buy Advice Notifications
The scanner sends personalized buy recommendations based on:
- **Opportunity Score**: Weighted analysis of price, location, space, condition
- **Expert Analysis**: Why each listing is recommended
- **Market Comparison**: Price/m², location tier, condition assessment

### 📊 Daily Report
- Total opportunities found
- Score breakdown (Excellent/Very Good/Good)
- Top 5 listings with details
- Market statistics by city

### ⭐ Score Tiers
- **Excellent (≥9.0)**: Exceptional deals
- **Very Good (8-9)**: Strong opportunities  
- **Good (7-8)**: Worth considering

## Integration Steps

1. **Create Channel**:
   - Go to Discord server
   - Create new text channel: \`#${DISCORD_CONFIG.channel_name}\`
   - Set topic: \`${DISCORD_CONFIG.channel_topic}\`

2. **Get Channel ID**:
   - Right-click channel → Copy Channel ID
   - Save in environment: \`export DISCORD_CHANNEL_ID=<id>\`

3. **Set Up Cron Job**:
   \`\`\`bash
   node cron-setup.js --channel real-estate-opportunities
   \`\`\`

4. **Manual Test**:
   \`\`\`bash
   node discord-integration.js
   \`\`\`

## Message Format

Each report includes:
1. **Summary Embed**: Overall market stats
2. **Top 5 Opportunity Embeds**: Individual listings with scores
3. **Buy Advice Text**: Expert recommendations

## Customization

Edit \`discord_config.json\` to adjust:
- Notification frequency
- Score thresholds
- Number of listings to show
- Grouping preferences
`;

  const instructionsPath = path.join(__dirname, 'DISCORD_SETUP.md');
  fs.writeFileSync(instructionsPath, instructions);
  console.log(`✅ Setup instructions saved: DISCORD_SETUP.md\n`);

  console.log('═'.repeat(62));
  console.log('✨ Discord Configuration Ready!');
  console.log('═'.repeat(62));
  console.log('\nFiles created:');
  console.log('  • discord_config.json');
  console.log('  • DISCORD_SETUP.md');
  console.log('\nNext Steps:');
  console.log('1. Create #real-estate-opportunities channel in Discord');
  console.log('2. Integrate with cron job for automated notifications');
  console.log('3. Test with: node scraper.js');
}

setupDiscordChannel();
