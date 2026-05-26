/**
 * Discord Notification Formatter v2.0
 * Converts real estate TOP OPPORTUNITIES to rich Discord embeds for buy advice
 */

class DiscordNotificationFormatter {
  /**
   * Create opportunity embed with scoring breakdown
   */
  static createOpportunityEmbed(listing) {
    const pricePerSqm = listing.property.sqm
      ? Math.round(listing.price / listing.property.sqm)
      : 0;

    const scoreColor = this.getScoreColor(listing.score);
    const scoreEmoji = this.getScoreEmoji(listing.score);

    const fields = [
      {
        name: `${scoreEmoji} Opportunity Score`,
        value: `${listing.score.toFixed(1)}/10`,
        inline: true,
      },
      {
        name: '💰 Price',
        value: `€${listing.price.toLocaleString('fr-FR')}`,
        inline: true,
      },
      {
        name: '€/m²',
        value: `€${pricePerSqm.toLocaleString('fr-FR')}`,
        inline: true,
      },
      {
        name: '🏠 Type',
        value:
          listing.property.type
            .charAt(0)
            .toUpperCase() + listing.property.type.slice(1),
        inline: true,
      },
      {
        name: '📏 Area',
        value: listing.property.sqm ? `${listing.property.sqm} m²` : 'N/A',
        inline: true,
      },
      {
        name: '🛏️ Rooms',
        value: listing.property.rooms ? `${listing.property.rooms}` : 'N/A',
        inline: true,
      },
      {
        name: '🚗 Parking',
        value: listing.property.parking ? '✅ Yes' : '❌ No',
        inline: true,
      },
      {
        name: '🌳 Outdoor',
        value: listing.property.outdoor_space || 'None',
        inline: true,
      },
      {
        name: '🔧 Condition',
        value:
          listing.property.condition
            .charAt(0)
            .toUpperCase() + listing.property.condition.slice(1),
        inline: true,
      },
      {
        name: '📍 Location',
        value: `${listing.location.city} (${listing.location.postal_code})`,
        inline: false,
      },
      {
        name: '📝 Description',
        value: listing.description.substring(0, 300),
        inline: false,
      },
      {
        name: '📋 Source',
        value: listing.source.toUpperCase(),
        inline: true,
      },
      {
        name: '📅 Posted',
        value: new Date(listing.posted_at).toLocaleString('fr-FR'),
        inline: true,
      },
    ];

    return {
      title: `🎯 ${listing.title}`,
      url: listing.url,
      description: `Top opportunity - Score: ${listing.score.toFixed(1)}/10`,
      color: scoreColor,
      fields: fields,
      thumbnail: listing.images?.[0]
        ? { url: listing.images[0] }
        : undefined,
      footer: {
        text: `ID: ${listing.id} | Best Opportunities Scanner`,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create summary report embed
   */
  static createReportEmbed(report) {
    const summary = report.summary;
    const stats = report.statistics;

    const cityBreakdown = Object.entries(stats.by_city || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([city, count]) => `• ${city}: ${count}`)
      .join('\n') || 'No data';

    return {
      title: '🏘️ Best Real Estate Opportunities - Daily Report',
      description: `📊 Market scan for ${new Date().toLocaleDateString(
        'fr-FR'
      )}`,
      color: 3447003, // Blue
      fields: [
        {
          name: '⭐ Top Opportunities Found',
          value: `${summary.top_opportunities}`,
          inline: true,
        },
        {
          name: '🌟 Excellent (≥9.0)',
          value: `${summary.excellent}`,
          inline: true,
        },
        {
          name: '✨ Very Good (8-9)',
          value: `${summary.very_good}`,
          inline: true,
        },
        {
          name: '🎯 Good (7-8)',
          value: `${summary.good}`,
          inline: true,
        },
        {
          name: '💰 Avg Price',
          value: `€${stats.avg_price.toLocaleString('fr-FR')}`,
          inline: true,
        },
        {
          name: '⚖️ Avg Score',
          value: `${stats.avg_score}/10`,
          inline: true,
        },
        {
          name: '📊 Price Range',
          value: `€${stats.price_range.min.toLocaleString('fr-FR')} - €${stats.price_range.max.toLocaleString(
            'fr-FR'
          )}`,
          inline: false,
        },
        {
          name: '📍 Top Cities',
          value: cityBreakdown,
          inline: false,
        },
      ],
      footer: {
        text: 'Real Estate Best Opportunities Scanner v2.0',
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create buy advice message (expert analysis)
   */
  static createBuyAdviceMessage(topOpportunities) {
    const topThree = topOpportunities.slice(0, 3);
    
    let advice = '🎯 **TOP BUY RECOMMENDATIONS** 🎯\n\n';
    
    topThree.forEach((listing, idx) => {
      const emoji = ['🥇', '🥈', '🥉'][idx];
      const pricePerSqm = Math.round(listing.price / listing.property.sqm);
      
      advice += `${emoji} **${listing.title}**\n`;
      advice += `   Score: ${listing.score.toFixed(1)}/10 | €${listing.price.toLocaleString('fr-FR')} (€${pricePerSqm}/m²)\n`;
      advice += `   ${listing.property.sqm}m² | ${listing.property.rooms} rooms | ${listing.location.city}\n`;
      advice += `   Why: Move-in ready, excellent price-to-space ratio\n`;
      advice += `   🔗 [View Details](${listing.url})\n\n`;
    });

    return advice;
  }

  /**
   * Create Discord message with report + top opportunities
   */
  static createDiscordMessage(report) {
    const embeds = [
      this.createReportEmbed(report),
      ...report.top_opportunities
        .slice(0, 5)
        .map((listing) => this.createOpportunityEmbed(listing)),
    ];

    const buyAdvice = this.createBuyAdviceMessage(report.top_opportunities);

    return {
      content: `${'═'.repeat(50)}\n${buyAdvice}${'═'.repeat(50)}`,
      embeds: embeds,
    };
  }

  static getScoreColor(score) {
    if (score >= 9) return 0x00ff00; // Green - Excellent
    if (score >= 8) return 0x00cc00; // Light Green - Very Good
    if (score >= 7) return 0xffff00; // Yellow - Good
    return 0xff9900; // Orange
  }

  static getScoreEmoji(score) {
    if (score >= 9) return '🌟';
    if (score >= 8) return '✨';
    if (score >= 7) return '⭐';
    return '💫';
  }
}

module.exports = { DiscordNotificationFormatter };
