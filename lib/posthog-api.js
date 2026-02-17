const POSTHOG_API_URL = 'https://us.posthog.com/api/projects/316158/query/'

async function queryPostHog(payload) {
  const res = await fetch(POSTHOG_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.POSTHOG_PERSONAL_API_KEY}`,
    },
    body: JSON.stringify({ query: payload }),
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PostHog API error ${res.status}: ${text}`)
  }

  return res.json()
}

export async function getDAU(days = 30) {
  const dateFrom = `-${days}d`
  return queryPostHog({
    kind: 'InsightVizNode',
    source: {
      kind: 'TrendsQuery',
      series: [
        {
          kind: 'EventsNode',
          event: '$pageview',
          custom_name: 'DAU',
          math: 'dau',
        },
      ],
      dateRange: { date_from: dateFrom },
      interval: 'day',
    },
  })
}

export async function getWAU(weeks = 12) {
  const dateFrom = `-${weeks * 7}d`
  return queryPostHog({
    kind: 'InsightVizNode',
    source: {
      kind: 'TrendsQuery',
      series: [
        {
          kind: 'EventsNode',
          event: '$pageview',
          custom_name: 'WAU',
          math: 'weekly_active',
        },
      ],
      dateRange: { date_from: dateFrom },
      interval: 'week',
    },
  })
}

export async function getReferrers(days = 30) {
  const dateFrom = `-${days}d`
  return queryPostHog({
    kind: 'InsightVizNode',
    source: {
      kind: 'TrendsQuery',
      series: [
        {
          kind: 'EventsNode',
          event: '$pageview',
          custom_name: 'Pageviews',
        },
      ],
      dateRange: { date_from: dateFrom },
      interval: 'day',
      breakdownFilter: {
        breakdown: '$referring_domain',
        breakdown_type: 'event',
        breakdown_limit: 10,
      },
      trendsFilter: {
        display: 'ActionsBarValue',
      },
    },
  })
}

export async function getErrors(days = 7) {
  const dateFrom = `-${days}d`
  return queryPostHog({
    kind: 'DataVisualizationNode',
    source: {
      kind: 'HogQLQuery',
      query: `
        SELECT
          properties.$exception_type AS error_type,
          properties.$exception_message AS message,
          count() AS occurrences,
          max(timestamp) AS last_seen
        FROM events
        WHERE event = '$exception'
          AND timestamp >= now() - interval ${days} day
        GROUP BY error_type, message
        ORDER BY occurrences DESC
        LIMIT 20
      `,
    },
  })
}

export async function getKeyEvents(days = 30) {
  const dateFrom = `-${days}d`
  return queryPostHog({
    kind: 'InsightVizNode',
    source: {
      kind: 'TrendsQuery',
      series: [
        {
          kind: 'EventsNode',
          event: 'deal_saved',
          custom_name: 'Deals Saved',
        },
        {
          kind: 'EventsNode',
          event: 'price_lookup_completed',
          custom_name: 'Price Lookups',
        },
        {
          kind: 'EventsNode',
          event: 'checkout_started',
          custom_name: 'Checkouts Started',
        },
      ],
      dateRange: { date_from: dateFrom },
      interval: 'day',
    },
  })
}
