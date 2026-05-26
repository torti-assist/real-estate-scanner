#!/usr/bin/env node
/**
 * Real Estate Scanner v2.0 - Enhanced Multi-Source Aggregator
 * Scans multiple real estate portals for BEST opportunities
 * Focus: Lower price + Better location + Spacious + Move-in ready
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// OPPORTUNITY SCORER - Rate listings by value
// ============================================================================

class OpportunityScorer {
  constructor(config) {
    this.config = config;
    this.weights = config.opportunity_scoring?.weights || {};
    this.target_price_per_sqm = config.opportunity_scoring?.target_price_per_sqm || 5000;
  }

  score(listing) {
    if (!listing.property.sqm || !listing.price) return 0;

    const scores = {
      price_ratio: this.scorePriceRatio(listing),
      location_score: this.scoreLocation(listing),
      space_per_euro: this.scoreSpacePerEuro(listing),
      condition: this.scoreCondition(listing),
      isolation_factor: this.scoreIsolation(listing),
    };

    // Weighted average
    let total = 0;
    let weight_sum = 0;
    for (const [key, weight] of Object.entries(this.weights)) {
      if (scores[key] !== undefined) {
        total += scores[key] * weight;
        weight_sum += weight;
      }
    }

    const final_score = weight_sum > 0 ? (total / weight_sum) * 10 : 0;
    return {
      overall: Math.min(10, Math.max(0, final_score)),
      components: scores,
    };
  }

  scorePriceRatio(listing) {
    // Lower price relative to target = better score
    const actual_price_per_sqm = listing.price / listing.property.sqm;
    const ratio = 1 - Math.min(1, actual_price_per_sqm / this.target_price_per_sqm);
    return ratio;
  }

  scoreLocation(listing) {
    // Check for preferred neighborhoods
    const desc = (listing.description + ' ' + listing.title).toLowerCase();
    const preferred = this.config.opportunity_scoring?.preferred_neighborhoods || [];
    let matches = 0;
    for (const pref of preferred) {
      if (desc.includes(pref.toLowerCase())) matches++;
    }
    return Math.min(1, matches / Math.max(1, preferred.length));
  }

  scoreSpacePerEuro(listing) {
    // More space for the money = better
    const sqm_per_1000_euros = (listing.property.sqm / listing.price) * 1000;
    return Math.min(1, sqm_per_1000_euros / 0.3); // 0.3 sqm per 1000 euros is excellent
  }

  scoreCondition(listing) {
    const condition = (listing.property.condition || '').toLowerCase();
    const scores = {
      'excellent': 1.0,
      'good': 0.85,
      'renovated': 0.9,
      'needing-cosmetics': 0.7,
      'fair': 0.5,
    };
    return scores[condition] || 0.5;
  }

  scoreIsolation(listing) {
    // Avoid listings that need major work
    const desc = (listing.description + ' ' + listing.title).toLowerCase();
    const red_flags = [
      'needs-major-work',
      'renovation-needed',
      'structural',
      'foundation',
      'roof',
      'asbestos',
      'mold',
    ];
    for (const flag of red_flags) {
      if (desc.includes(flag)) return 0;
    }
    return 1.0;
  }
}

// ============================================================================
// CONFIGURATION LOADER
// ============================================================================

function loadConfig() {
  const configPath = path.join(__dirname, 'search_config.json');
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch (err) {
    console.error('Error loading config:', err);
    return {};
  }
}

// ============================================================================
// STORAGE MANAGER
// ============================================================================

class StorageManager {
  constructor(dataDir) {
    this.dataDir = dataDir;
    this.ensureDir();
  }

  ensureDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  loadListings() {
    const file = path.join(this.dataDir, 'listings_db.json');
    try {
      return JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch {
      return {};
    }
  }

  saveListings(listings) {
    const file = path.join(this.dataDir, 'listings_db.json');
    fs.writeFileSync(file, JSON.stringify(listings, null, 2));
  }

  appendHistory(listing) {
    const file = path.join(this.dataDir, 'listings_history.jsonl');
    fs.appendFileSync(file, JSON.stringify(listing) + '\n');
  }

  appendAlert(alert) {
    const file = path.join(this.dataDir, 'alerts_log.jsonl');
    fs.appendFileSync(file, JSON.stringify(alert) + '\n');
  }

  loadAlertedListings() {
    const file = path.join(this.dataDir, 'alerted_listings.json');
    try {
      return new Set(JSON.parse(fs.readFileSync(file, 'utf-8')));
    } catch {
      return new Set();
    }
  }

  saveAlertedListings(ids) {
    const file = path.join(this.dataDir, 'alerted_listings.json');
    fs.writeFileSync(file, JSON.stringify(Array.from(ids), null, 2));
  }

  saveReport(report) {
    const file = path.join(this.dataDir, `report-${Date.now()}.json`);
    fs.writeFileSync(file, JSON.stringify(report, null, 2));
    return file;
  }
}

// ============================================================================
// LISTING PARSER & NORMALIZER
// ============================================================================

class ListingParser {
  static createListing(data) {
    return {
      id: data.id || `${data.source}-${Date.now()}`,
      source: data.source,
      title: data.title || 'Untitled',
      price: data.price || 0,
      currency: data.currency || 'EUR',
      location: {
        address: data.address || '',
        city: data.city || '',
        postal_code: data.postal_code || '',
        region: data.region || '',
        lat: data.lat,
        lon: data.lon,
      },
      property: {
        type: data.property_type || 'unknown',
        rooms: data.rooms,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        sqm: data.sqm,
        floor: data.floor,
        parking: data.parking,
        outdoor_space: data.outdoor_space,
        condition: data.condition || 'unknown',
      },
      description: data.description || '',
      images: data.images || [],
      url: data.url || '',
      agent: data.agent || '',
      phone: data.phone || '',
      posted_at: data.posted_at || new Date().toISOString(),
      first_seen: data.first_seen || new Date().toISOString(),
      last_updated: new Date().toISOString(),
      status: 'active',
      score: data.score || 0,
    };
  }
}

// ============================================================================
// FILTERING ENGINE
// ============================================================================

class FilterEngine {
  static matches(listing, config) {
    // Price range
    if (
      listing.price < (config.price_range?.min || 0) ||
      listing.price > (config.price_range?.max || Infinity)
    ) {
      return false;
    }

    // Property type
    if (
      config.property_type &&
      !config.property_type.includes(listing.property.type)
    ) {
      return false;
    }

    // Rooms
    if (
      config.rooms?.min &&
      (!listing.property.rooms || listing.property.rooms < config.rooms.min)
    ) {
      return false;
    }

    // Area
    if (
      config.area_sqm?.min &&
      (!listing.property.sqm || listing.property.sqm < config.area_sqm.min)
    ) {
      return false;
    }

    // Keywords exclude
    const desc = (listing.description + ' ' + listing.title).toLowerCase();
    if (config.keywords_exclude) {
      for (const keyword of config.keywords_exclude) {
        if (desc.includes(keyword.toLowerCase())) return false;
      }
    }

    return true;
  }
}

// ============================================================================
// MOCK DATA GENERATOR (for demonstration)
// ============================================================================

class MockDataGenerator {
  static generateOpportunities(count = 150) {
    const listings = [];
    const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'];
    const types = ['apartment', 'house', 'townhouse'];
    const sources = ['seloger', 'leboncoin', 'pap', 'bieniici', 'orpi', 'immobilier', 'century21'];
    const conditions = ['good', 'excellent', 'renovated', 'needing-cosmetics'];
    const neighborhoods = ['accessible', 'quiet', 'near-transport', 'near-shops', 'low-noise', 'character', 'family-friendly'];

    for (let i = 0; i < count; i++) {
      const sqm = 50 + Math.random() * 250;
      const price = 100000 + Math.random() * 600000;
      const rooms = 2 + Math.floor(Math.random() * 4);
      const isExcellent = Math.random() < 0.2;
      const hasOutdoor = Math.random() < 0.6;

      listings.push({
        id: `listing-${Date.now()}-${i}`,
        source: sources[Math.floor(Math.random() * sources.length)],
        title: `${types[Math.floor(Math.random() * types.length)].charAt(0).toUpperCase()}${types[Math.floor(Math.random() * types.length)].slice(1)} in ${cities[Math.floor(Math.random() * cities.length)]}`,
        price: Math.floor(price),
        currency: 'EUR',
        city: cities[Math.floor(Math.random() * cities.length)],
        postal_code: '75' + Math.floor(Math.random() * 1000),
        property_type: types[Math.floor(Math.random() * types.length)],
        rooms,
        bedrooms: Math.floor(rooms * 0.8),
        sqm: Math.floor(sqm),
        condition: isExcellent ? 'excellent' : conditions[Math.floor(Math.random() * (conditions.length - 1))],
        parking: Math.random() < 0.5,
        outdoor_space: hasOutdoor ? neighborhoods[Math.floor(Math.random() * neighborhoods.length)] : null,
        description: neighborhoods.slice(0, 3).join(', ') + '. ' + (isExcellent ? 'Recently renovated' : 'Good condition'),
        address: `${Math.floor(Math.random() * 200)} Rue de ${cities[Math.floor(Math.random() * cities.length)]}`,
        posted_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        url: `https://example.com/listing-${i}`,
        agent: `Agent ${Math.floor(Math.random() * 100)}`,
      });
    }

    return listings;
  }
}

// ============================================================================
// MAIN ORCHESTRATOR
// ============================================================================

class RealEstateScannerV2 {
  constructor(dataDir) {
    this.config = loadConfig();
    this.storage = new StorageManager(dataDir);
    this.scorer = new OpportunityScorer(this.config);
  }

  async run() {
    console.log('='.repeat(80));
    console.log('REAL ESTATE SCANNER v2.0 - BEST OPPORTUNITIES');
    console.log('='.repeat(80));
    console.log(`Time: ${new Date().toISOString()}`);

    const previousListings = this.storage.loadListings();
    const alertedIds = this.storage.loadAlertedListings();
    const topOpportunities = [];

    try {
      // Fetch from all sources (currently mock data for testing)
      console.log(`\n🔍 Fetching from ${this.config.sources?.length || 7} sources...`);
      const allListings = await this.fetchAllSources();
      console.log(`   📊 Total listings fetched: ${allListings.length}`);

      // Filter by criteria
      const filteredListings = allListings.filter((listing) =>
        FilterEngine.matches(listing, this.config)
      );
      console.log(`   ✅ After filtering: ${filteredListings.length}`);

      // Score each listing
      const scoredListings = filteredListings.map((listing) => {
        const score = this.scorer.score(listing);
        listing.score = score.overall;
        listing.score_breakdown = score.components;
        return listing;
      });

      // Sort by score (best opportunities first)
      scoredListings.sort((a, b) => b.score - a.score);

      // Find top opportunities (new + high score)
      const currentIds = new Set(Object.keys(previousListings));
      for (const listing of scoredListings) {
        if (!currentIds.has(listing.id) && !alertedIds.has(listing.id)) {
          if (listing.score >= (this.config.opportunity_scoring?.min_score || 7)) {
            topOpportunities.push(listing);
            alertedIds.add(listing.id);
          }
        }
      }

      console.log(`   ⭐ TOP OPPORTUNITIES (score ≥ ${this.config.opportunity_scoring?.min_score || 7}): ${topOpportunities.length}`);

      // Save state
      const listingsObj = {};
      for (const listing of scoredListings) {
        listingsObj[listing.id] = listing;
      }
      this.storage.saveListings(listingsObj);
      this.storage.saveAlertedListings(alertedIds);

      // Log new opportunities
      for (const listing of topOpportunities) {
        this.storage.appendHistory(listing);
        this.storage.appendAlert({
          timestamp: new Date().toISOString(),
          listing_id: listing.id,
          title: listing.title,
          price: listing.price,
          score: listing.score,
          url: listing.url,
          reason: this.generateReason(listing),
        });
      }

      // Generate report
      const report = this.generateReport(
        scoredListings,
        topOpportunities,
        previousListings
      );
      
      this.storage.saveReport(report);
      return report;
    } catch (err) {
      console.error('Error during scan:', err);
      throw err;
    }
  }

  async fetchAllSources() {
    // For now, return mock data. In production, would use web_fetch or playwright
    console.log('   📝 Using test data generator');
    return MockDataGenerator.generateOpportunities(150);
  }

  generateReason(listing) {
    const score = listing.score;
    const price_per_sqm = Math.round(listing.price / listing.property.sqm);
    const reasons = [];

    if (listing.score_breakdown.price_ratio > 0.7) {
      reasons.push(`Great price (€${price_per_sqm}/m² vs target €${this.scorer.target_price_per_sqm}/m²)`);
    }
    if (listing.score_breakdown.space_per_euro > 0.8) {
      reasons.push('Excellent space for the price');
    }
    if (listing.property.condition === 'excellent' || listing.property.condition === 'renovated') {
      reasons.push('Move-in ready condition');
    }
    if (listing.property.outdoor_space) {
      reasons.push(`Has ${listing.property.outdoor_space}`);
    }

    return reasons.join(' • ') || 'Strong opportunity score';
  }

  generateReport(allListings, topOpportunities, previousListings) {
    // Group by score tier
    const by_tier = {
      excellent: topOpportunities.filter(l => l.score >= 9),
      very_good: topOpportunities.filter(l => l.score >= 8 && l.score < 9),
      good: topOpportunities.filter(l => l.score >= 7 && l.score < 8),
    };

    return {
      timestamp: new Date().toISOString(),
      summary: {
        total_found: allListings.length,
        top_opportunities: topOpportunities.length,
        excellent: by_tier.excellent.length,
        very_good: by_tier.very_good.length,
        good: by_tier.good.length,
      },
      top_opportunities: topOpportunities.slice(0, 20),
      statistics: {
        avg_price: this.calculateAvgPrice(topOpportunities),
        avg_score: this.calculateAvgScore(topOpportunities),
        price_range: {
          min: Math.min(...topOpportunities.map((l) => l.price)),
          max: Math.max(...topOpportunities.map((l) => l.price)),
        },
        by_city: this.groupByCity(topOpportunities),
        by_type: this.groupByType(topOpportunities),
      },
    };
  }

  calculateAvgPrice(listings) {
    if (listings.length === 0) return 0;
    return Math.round(listings.reduce((sum, l) => sum + l.price, 0) / listings.length);
  }

  calculateAvgScore(listings) {
    if (listings.length === 0) return 0;
    return (listings.reduce((sum, l) => sum + l.score, 0) / listings.length).toFixed(1);
  }

  groupByType(listings) {
    const groups = {};
    for (const listing of listings) {
      const type = listing.property.type || 'unknown';
      groups[type] = (groups[type] || 0) + 1;
    }
    return groups;
  }

  groupByCity(listings) {
    const groups = {};
    for (const listing of listings) {
      const city = listing.location.city || 'unknown';
      groups[city] = (groups[city] || 0) + 1;
    }
    return groups;
  }
}

// ============================================================================
// ENTRY POINT
// ============================================================================

async function main() {
  const dataDir = path.join(__dirname, 'data');
  const scraper = new RealEstateScannerV2(dataDir);

  try {
    const report = await scraper.run();

    console.log(`\n${'='.repeat(80)}`);
    console.log('OPPORTUNITIES REPORT:');
    console.log(JSON.stringify(report, null, 2));
    console.log(`${'='.repeat(80)}\n`);

    process.exit(0);
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  RealEstateScannerV2,
  OpportunityScorer,
  FilterEngine,
  ListingParser,
};
