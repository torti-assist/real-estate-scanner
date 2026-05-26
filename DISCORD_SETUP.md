# Discord Channel Setup - Real Estate Opportunities

## Channel Information

- **Channel Name**: #real-estate-opportunities
- **Type**: Text Channel
- **Topic**: 🏠 Best real estate opportunities - Buy recommendations from automated scanner v2.0
- **Description**: Daily top real estate opportunities with scoring, price analysis, and expert buy advice

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
   - Create new text channel: `#real-estate-opportunities`
   - Set topic: `🏠 Best real estate opportunities - Buy recommendations from automated scanner v2.0`

2. **Get Channel ID**:
   - Right-click channel → Copy Channel ID
   - Save in environment: `export DISCORD_CHANNEL_ID=<id>`

3. **Set Up Cron Job**:
   ```bash
   node cron-setup.js --channel real-estate-opportunities
   ```

4. **Manual Test**:
   ```bash
   node discord-integration.js
   ```

## Message Format

Each report includes:
1. **Summary Embed**: Overall market stats
2. **Top 5 Opportunity Embeds**: Individual listings with scores
3. **Buy Advice Text**: Expert recommendations

## Customization

Edit `discord_config.json` to adjust:
- Notification frequency
- Score thresholds
- Number of listings to show
- Grouping preferences
