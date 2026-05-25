#!/usr/bin/env node
/**
 * Real Estate Scraper - Multi-Source Aggregator
 * Scans multiple real estate portals and aggregates listings
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION LOADER
// ============================================================================

function loadConfig() {
  const configPath = path.join(__dirname, 'search_config.json');
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch (err) {
    console.error('Error loading config:', err);
    return getDefaultConfig();
  }
}

function getDefaultConfig() {
  return {
    locations: [{ city: 'Paris', postal_code: '75001-75020' }],
    property_type: ['apartment', 'house'],
    price_range: { min: 150000, max: 600000 },
    rooms: { min: 2, max: 5 },
    area_sqm: { min: 50 },
    sources: ['seloger', 'leboncoin', 'pap'],
    max_days_old: 7,
  };
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
    };
  }

  static normalizePrice(priceStr) {
    if (!priceStr) return 0;
    return parseInt(String(priceStr).replace(/[^0-9]/g, ''), 10) || 0;
  }
}

// ============================================================================
// SCRAPER: SELOGER
// ============================================================================

class SelogerScraper {
  static buildSearchUrl(config) {
    const location = config.locations[0];
    const params = new URLSearchParams({
      location: location.city || location.postal_code,
      resultsByPage: '120',
      bedroomMin: config.rooms?.min || 2,
      priceMin: config.price_range?.min || 0,
      priceMax: config.price_range?.max || 1000000,
    });
    return `https://www.seloger.com/list.htm?${params.toString()}`;
  }

  static parseListings(html) {
    // Mock parser - returns empty in headless
    // In real impl, use cheerio or playwright
    console.log('[SeLoger] Would parse HTML for listings');
    return [];
  }
}

// ============================================================================
// SCRAPER: LEBONCOIN
// ============================================================================

class LeBonCoinScraper {
  static buildSearchUrl(config) {
    const location = config.locations[0];
    const params = new URLSearchParams({
      category: 'ventes_immobilieres',
      locations: location.city || location.postal_code,
      price: `${config.price_range?.min || 0}-${config.price_range?.max || 1000000}`,
    });
    return `https://www.leboncoin.fr/recherche?${params.toString()}`;
  }

  static parseListings(html) {
    console.log('[LeBonCoin] Would parse HTML for listings');
    return [];
  }
}

// ============================================================================
// SCRAPER: PAP
// ============================================================================

class PAPScraper {
  static buildSearchUrl(config) {
    const location = config.locations[0];
    const params = new URLSearchParams({
      location: location.city || location.postal_code,
      price_min: config.price_range?.min || 0,
      price_max: config.price_range?.max || 1000000,
    });
    return `https://www.pap.fr/annonce/vente-immobilier?${params.toString()}`;
  }

  static parseListings(html) {
    console.log('[PAP] Would parse HTML for listings');
    return [];
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

    // Keywords
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
// MAIN ORCHESTRATOR
// ============================================================================

class RealEstateScraper {
  constructor(dataDir) {
    this.config = loadConfig();
    this.storage = new StorageManager(dataDir);
  }

  async run() {
    console.log('='.repeat(80));
    console.log('REAL ESTATE SCANNER - STARTING RUN');
    console.log('='.repeat(80));
    console.log(`Time: ${new Date().toISOString()}`);

    const previousListings = this.storage.loadListings();
    const alertedIds = this.storage.loadAlertedListings();
    const newListings = [];

    try {
      // Fetch from all sources
      const allListings = await this.fetchAllSources();

      // Filter by criteria
      const filteredListings = allListings.filter((listing) =>
        FilterEngine.matches(listing, this.config)
      );

      console.log(`\n📊 Results:`);
      console.log(`   Total found: ${allListings.length}`);
      console.log(`   After filtering: ${filteredListings.length}`);

      // Detect new listings
      const currentIds = new Set(Object.keys(previousListings));
      for (const listing of filteredListings) {
        if (!currentIds.has(listing.id) && !alertedIds.has(listing.id)) {
          newListings.push(listing);
          alertedIds.add(listing.id);
        }
      }

      console.log(`   ✨ NEW listings: ${newListings.length}`);

      // Save state
      const listingsObj = {};
      for (const listing of filteredListings) {
        listingsObj[listing.id] = listing;
      }
      this.storage.saveListings(listingsObj);
      this.storage.saveAlertedListings(alertedIds);

      // Log new listings
      for (const listing of newListings) {
        this.storage.appendHistory(listing);
        this.storage.appendAlert({
          timestamp: new Date().toISOString(),
          listing_id: listing.id,
          title: listing.title,
          price: listing.price,
          url: listing.url,
        });
      }

      // Generate report
      const report = this.generateReport(
        filteredListings,
        newListings,
        previousListings
      );
      return report;
    } catch (err) {
      console.error('Error during scan:', err);
      throw err;
    }
  }

  async fetchAllSources() {
    const listings = [];

    for (const source of this.config.sources) {
      try {
        console.log(`\n🔍 Fetching from ${source}...`);

        let url = '';
        if (source === 'seloger') url = SelogerScraper.buildSearchUrl(this.config);
        if (source === 'leboncoin')
          url = LeBonCoinScraper.buildSearchUrl(this.config);
        if (source === 'pap') url = PAPScraper.buildSearchUrl(this.config);

        console.log(`   URL: ${url}`);
        // In real implementation, would fetch and parse here
        // For now, mock data for testing
      } catch (err) {
        console.warn(`   ⚠️  Error fetching ${source}:`, err.message);
      }
    }

    return listings;
  }

  generateReport(allListings, newListings, previousListings) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total_found: allListings.length,
        new_listings: newListings.length,
        previously_known: allListings.length - newListings.length,
        total_in_db: Object.keys(previousListings).length,
      },
      new_listings: newListings,
      statistics: {
        avg_price: this.calculateAvgPrice(allListings),
        price_range: {
          min: Math.min(...allListings.map((l) => l.price)),
          max: Math.max(...allListings.map((l) => l.price)),
        },
        by_type: this.groupByType(allListings),
        by_location: this.groupByLocation(allListings),
      },
    };

    console.log(`\n📈 Report generated`);
    return report;
  }

  calculateAvgPrice(listings) {
    if (listings.length === 0) return 0;
    return Math.round(listings.reduce((sum, l) => sum + l.price, 0) / listings.length);
  }

  groupByType(listings) {
    const groups = {};
    for (const listing of listings) {
      const type = listing.property.type || 'unknown';
      groups[type] = (groups[type] || 0) + 1;
    }
    return groups;
  }

  groupByLocation(listings) {
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
  const scraper = new RealEstateScraper(dataDir);

  try {
    const report = await scraper.run();

    console.log(`\n${'='.repeat(80)}`);
    console.log('REPORT:');
    console.log(JSON.stringify(report, null, 2));
    console.log(`${'='.repeat(80)}\n`);

    // Write report to file
    const reportPath = path.join(dataDir, `report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`✅ Report saved to: ${reportPath}`);

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
  RealEstateScraper,
  ListingParser,
  FilterEngine,
  StorageManager,
  SelogerScraper,
  LeBonCoinScraper,
  PAPScraper,
};
