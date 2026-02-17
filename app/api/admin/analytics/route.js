import { NextResponse } from 'next/server'
import { verifyAdminAPI } from '@/lib/admin'
import { getDAU, getWAU, getReferrers, getErrors, getKeyEvents } from '@/lib/posthog-api'

export async function GET(request) {
  const user = await verifyAdminAPI()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const section = searchParams.get('section')

  try {
    if (section) {
      const fetchers = {
        dau: () => getDAU(30),
        wau: () => getWAU(12),
        referrers: () => getReferrers(30),
        errors: () => getErrors(7),
        events: () => getKeyEvents(30),
      }

      const fetcher = fetchers[section]
      if (!fetcher) {
        return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
      }

      const data = await fetcher()
      return NextResponse.json({ [section]: data })
    }

    const results = await Promise.allSettled([
      getDAU(30),
      getWAU(12),
      getReferrers(30),
      getErrors(7),
      getKeyEvents(30),
    ])

    return NextResponse.json({
      dau: results[0].status === 'fulfilled' ? results[0].value : null,
      wau: results[1].status === 'fulfilled' ? results[1].value : null,
      referrers: results[2].status === 'fulfilled' ? results[2].value : null,
      errors: results[3].status === 'fulfilled' ? results[3].value : null,
      events: results[4].status === 'fulfilled' ? results[4].value : null,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
