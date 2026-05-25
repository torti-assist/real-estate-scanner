/**
 * Discord Notification Formatter
 * Converts real estate listings to rich Discord embeds
 */

class DiscordNotificationFormatter {
  /**
   * Create a single listing embed
   */
  static createListingEmbed(listing) {
    const pricePerSqm = listing.property.sqm
      ? Math.round(listing.price / listing.property.sqm)
      : 0;

    const fields = [
      {
        name: '💰 Price',
        value: `€${listing.price.toLocaleString('fr-FR')}${
          pricePerSqm ? ` (€${pricePerSqm}/m²)` : ''
        }`,
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
        name: '📍 Location',
        value: `${listing.location.city} (${listing.location.postal_code})`,
        inline: false,
      },
      {
        name: '📅 Posted',
        value: new Date(listing.posted_at).toLocaleString('fr-FR'),
        inline: true,
      },
      {
        name: '📋 Source',
        value: listing.source.toUpperCase(),
        inline: true,
      },
    ];

    if (listing.description) {
      fields.push({
        name: '📝 Description',
        value: listing.description.substring(0, 250),
        inline: false,
      });
    }

    return {
      title: listing.title,
      url: listing.url,
      description: `New listing found: ${listing.location.address}`,
      color: 3447003, // Blue
      fields: fields,
      thumbnail: listing.images?.[0]
        ? { url: listing.images[0] }
        : undefined,
      footer: {
        text: `ID: ${listing.id}`,
        icon_url: 'https://via.placeholder.com/32x32?text=RE',
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create summary embed
   */
  static createSummaryEmbed(report) {
    const summary = report.summary;
    const stats = report.statistics;

    const typeBreakdown = Object.entries(stats.by_type || {})
      .map(([type, count]) => `• ${type}: ${count}`)
      .join('\n') || 'No data';

    return {
      title: '🏘️ Real Estate Scan Report',
      description: `📊 Market update for ${new Date().toLocaleDateString(
        'fr-FR'
      )}`,
      color: 3447003, // Blue
      fields: [
        {
          name: '✨ New Listings',
          value: `${summary.new_listings}`,
          inline: true,
        },
        {
          name: '📈 Total Found',
          value: `${summary.total_found}`,
          inline: true,
        },
        {
          name: '💾 Database',
          value: `${summary.total_in_db} stored`,
          inline: true,
        },
        {
          name: '💰 Average Price',
          value: `€${stats.avg_price.toLocaleString('fr-FR')}`,
          inline: true,
        },
        {
          name: '📊 Price Range',
          value: `€${stats.price_range.min.toLocaleString('fr-FR')} - €${stats.price_range.max.toLocaleString(
            'fr-FR'
          )}`,
          inline: true,
        },
        {
          name: '🏠 Property Types',
          value: typeBreakdown,
          inline: false,
        },
      ],
      footer: {
        text: 'Real Estate Scanner',
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create a Discord message with multiple embeds
   */
  static createDiscordMessage(report) {
    const embeds = [
      this.createSummaryEmbed(report),
      ...report.new_listings
        .slice(0, 5) // Limit to 5 listings per message
        .map((listing) => this.createListingEmbed(listing)),
    ];

    return {
      content: `🚨 **${report.summary.new_listings} new real estate opportunities found!**`,
      embeds: embeds,
    };
  }

  /**
   * Create a detailed listing card
   */
  static createListingCard(listing) {
    const pricePerSqm = listing.property.sqm
      ? Math.round(listing.price / listing.property.sqm)
      : 0;

    return `
📍 **${listing.title}**
└─ ${listing.location.address}, ${listing.location.city} ${listing.location.postal_code}

💰 €${listing.price.toLocaleString('fr-FR')}${
      pricePerSqm ? ` (€${pricePerSqm}/m²)` : ''
    }
📏 ${listing.property.sqm || 'N/A'} m² | 🛏️ ${listing.property.rooms || 'N/A'} rooms
🚗 ${listing.property.parking ? '✅ Parking' : '❌ No Parking'} | 🌳 ${
      listing.property.outdoor_space || 'None'
    }

📝 ${listing.description.substring(0, 150)}...

🔗 [View Listing](${listing.url})
    `.trim();
  }
}

module.exports = { DiscordNotificationFormatter };
