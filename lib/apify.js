// Apify helpers for fetching real eBay sold data (Pro tier)

const APIFY_TOKEN = process.env.APIFY_API_TOKEN

export async function fetchApifySoldData(query, category = null) {
  if (!APIFY_TOKEN) {
    console.error('Apify token not configured')
    return emptyPriceResult('apify')
  }

  try {
    // Use Apify's eBay scraper for sold listings
    const response = await fetch(
      `https://api.apify.com/v2/acts/dtrungtin~ebay-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          search: query,
          categoryId: category || '',
          maxItems: 30,
          filterByPrice: false,
          countryCode: 'us',
          listingType: 'sold' // Only sold listings
        })
      }
    )

    if (!response.ok) {
      console.error('Apify error:', await response.text())
      return emptyPriceResult('apify')
    }

    const items = await response.json()

    if (!items || items.length === 0) {
      return emptyPriceResult('apify')
    }

    // Extract sold prices
    const prices = items
      .map(item => {
        const price = parseFloat(item.price?.replace(/[^0-9.]/g, '') || 0)
        const shipping = parseFloat(item.shipping?.replace(/[^0-9.]/g, '') || 0)
        return price + shipping
      })
      .filter(p => p > 0)
      .sort((a, b) => a - b)

    if (prices.length === 0) {
      return emptyPriceResult('apify')
    }

    const avg = prices.reduce((a, b) => a + b, 0) / prices.length
    const median = prices[Math.floor(prices.length / 2)]
    const p10Index = Math.floor(prices.length * 0.1)
    const p90Index = Math.floor(prices.length * 0.9)
    const p10 = prices[p10Index] || prices[0]
    const p90 = prices[p90Index] || prices[prices.length - 1]

    return {
      source: 'ebay_sold',
      sample_count: prices.length,
      low: round(p10),
      high: round(p90),
      avg: round(avg),
      median: round(median),
      samples: items.slice(0, 10).map(item => ({
        title: item.title,
        price: item.price,
        shipping: item.shipping,
        soldDate: item.soldDate,
        url: item.url,
        image: item.image
      }))
    }
  } catch (error) {
    console.error('Apify fetch error:', error)
    return emptyPriceResult('apify')
  }
}

function emptyPriceResult(source) {
  return {
    source,
    sample_count: 0,
    low: null,
    high: null,
    avg: null,
    median: null,
    samples: []
  }
}

function round(num) {
  return Math.round(num * 100) / 100
}
