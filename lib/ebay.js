// eBay API helpers for price lookups

let cachedToken = null
let tokenExpiry = null

// Get OAuth token for eBay API
async function getEbayOAuthToken() {
  // Return cached token if still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken
  }

  const credentials = Buffer.from(
    `${process.env.EBAY_APP_ID}:${process.env.EBAY_CERT_ID}`
  ).toString('base64')

  const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope'
  })

  if (!response.ok) {
    console.error('eBay OAuth error:', await response.text())
    throw new Error('Failed to get eBay OAuth token')
  }

  const data = await response.json()
  cachedToken = data.access_token
  // Token expires in seconds, cache for slightly less
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000

  return cachedToken
}

// Fetch active listings from eBay Browse API
export async function fetchEbayActiveListings(query, category = null, limit = 50) {
  try {
    const token = await getEbayOAuthToken()

    const params = new URLSearchParams({
      q: query,
      limit: String(limit),
      sort: 'price'
    })

    if (category) {
      params.set('category_ids', category)
    }

    const response = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      console.error('eBay API error:', await response.text())
      return emptyPriceResult('ebay_active')
    }

    const data = await response.json()

    if (!data.itemSummaries || data.itemSummaries.length === 0) {
      return emptyPriceResult('ebay_active')
    }

    // Extract prices (price + shipping)
    const prices = data.itemSummaries
      .map(item => {
        const price = parseFloat(item.price?.value || 0)
        const shipping = parseFloat(item.shippingOptions?.[0]?.shippingCost?.value || 0)
        return price + shipping
      })
      .filter(p => p > 0)
      .sort((a, b) => a - b)

    if (prices.length === 0) {
      return emptyPriceResult('ebay_active')
    }

    // Calculate stats
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length
    const median = prices[Math.floor(prices.length / 2)]

    // Remove outliers for low/high (10th and 90th percentile)
    const p10Index = Math.floor(prices.length * 0.1)
    const p90Index = Math.floor(prices.length * 0.9)
    const p10 = prices[p10Index] || prices[0]
    const p90 = prices[p90Index] || prices[prices.length - 1]

    return {
      source: 'ebay_active',
      sample_count: prices.length,
      low: round(p10),
      high: round(p90),
      avg: round(avg),
      median: round(median),
      samples: data.itemSummaries.slice(0, 10).map(item => ({
        title: item.title,
        price: item.price?.value,
        shipping: item.shippingOptions?.[0]?.shippingCost?.value,
        condition: item.condition,
        url: item.itemWebUrl,
        image: item.image?.imageUrl
      }))
    }
  } catch (error) {
    console.error('eBay fetch error:', error)
    return emptyPriceResult('ebay_active')
  }
}

// Generate eBay search URL for manual lookup
export function generateEbaySearchUrl(query, soldOnly = false) {
  const params = new URLSearchParams({
    _nkw: query,
    _sop: '13' // Sort by price + shipping lowest
  })

  if (soldOnly) {
    params.set('LH_Complete', '1')
    params.set('LH_Sold', '1')
  }

  return `https://www.ebay.com/sch/i.html?${params.toString()}`
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
