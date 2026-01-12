import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('tier, lookups_used_today, lookups_reset_at, deals_saved_count')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Get tier limits
    const { data: limits } = await supabase.rpc('get_tier_limits', {
      p_tier: profile.tier
    })

    // Check if usage needs reset
    const resetAt = new Date(profile.lookups_reset_at)
    const now = new Date()
    const hoursSinceReset = (now - resetAt) / (1000 * 60 * 60)

    let used = profile.lookups_used_today
    if (hoursSinceReset >= 24) {
      used = 0 // Will be reset on next usage
    }

    const limit = limits?.lookups_per_day || 10
    const nextReset = new Date(resetAt.getTime() + 24 * 60 * 60 * 1000)

    return NextResponse.json({
      tier: profile.tier,
      lookups: {
        used,
        limit,
        remaining: Math.max(0, limit - used),
        resets_at: nextReset.toISOString()
      },
      deals: {
        saved: profile.deals_saved_count,
        limit: limits?.saved_deals || 25
      },
      limits
    })

  } catch (error) {
    console.error('Usage check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
