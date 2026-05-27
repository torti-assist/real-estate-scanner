#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the scan report
const reportPath = 'data/report-scan-1779840334556.json';
const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

// Format the message with embeds for top opportunities
const embeds = report.top_opportunities.map((opp, idx) => {
  const pricePerSqm = opp.price_per_sqm || Math.round(opp.price / opp.size_sqm);
  const rating = opp.rating || (opp.score >= 8 ? '🔥 HIGHLY RECOMMENDED' : '✅ GOOD VALUE');
  
  return {
    title: `#${idx + 1}: ${opp.title}`,
    description: opp.description || 'Quality property opportunity matching your criteria',
    color: opp.score >= 7 ? 65280 : (opp.score >= 6.5 ? 255 : 16776960),
    fields: [
      { name: '💰 Price', value: `€${opp.price.toLocaleString('fr-FR')}`, inline: true },
      { name: '📐 Price/m²', value: `€${pricePerSqm}/m²`, inline: true },
      { name: '⭐ Opportunity Score', value: `${opp.score}/10`, inline: true },
      { name: '🏘️ Location', value: `${opp.city}`, inline: true },
      { name: '🏠 Size', value: `${opp.size_sqm}m² (${opp.rooms || 1} rooms)`, inline: true },
      { name: '📋 Condition', value: opp.condition || 'Good', inline: true },
      { name: '🚗 Parking', value: opp.parking ? '✅ Yes' : '❌ No', inline: true },
      { name: '🌳 Outdoor Space', value: opp.outdoor_space || 'None', inline: true },
      { name: '🏷️ Rating', value: rating, inline: true },
      { name: '📌 Source', value: opp.source, inline: true },
      { name: '🔗 View Listing', value: `[Click here](${opp.url})`, inline: false }
    ],
    footer: {
      text: `Updated: ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })}`
    }
  };
});

const notification = {
  content: `🏠 **REAL ESTATE MARKET SCAN** — Wednesday, May 27, 2026\n📊 **Scan Results:** 25 new listings analyzed | 4 opportunities found (score ≥6.0) ⭐`,
  embeds: embeds
};

console.log(JSON.stringify(notification, null, 2));
