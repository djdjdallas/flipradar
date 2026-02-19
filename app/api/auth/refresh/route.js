import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// POST /api/auth/refresh — exchange a refresh token for a new access token
export async function POST(request) {
  try {
    const body = await request.json()
    const { refresh_token } = body

    if (!refresh_token) {
      return NextResponse.json({ error: 'Missing refresh_token' }, { status: 400 })
    }

    // Create a direct Supabase client (not the server cookie-based one)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const { data, error } = await supabase.auth.refreshSession({ refresh_token })

    if (error || !data.session) {
      console.error('[FlipChecker API] Token refresh error:', error?.message)
      return NextResponse.json({ error: 'Refresh failed' }, { status: 401 })
    }

    return NextResponse.json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_in: data.session.expires_in
    })
  } catch (error) {
    console.error('[FlipChecker API] Auth refresh error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
