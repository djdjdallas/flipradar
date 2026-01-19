/**
 * API Key Management Endpoint
 * Allows users to generate, view (masked), and revoke their extension API key
 */

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET - Retrieve current API key status (masked)
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('api_key')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('[FlipRadar API] Profile fetch error:', profileError)
      return NextResponse.json({ error: 'Failed to fetch API key status' }, { status: 500 })
    }

    if (!profile?.api_key) {
      return NextResponse.json({ hasKey: false, maskedKey: null })
    }

    // Mask the key (show first 7 chars "fr_XXXX" and last 4 chars)
    const key = profile.api_key
    const masked = key.substring(0, 7) + '...' + key.substring(key.length - 4)

    return NextResponse.json({ hasKey: true, maskedKey: masked })

  } catch (error) {
    console.error('[FlipRadar API] API key GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST - Generate a new API key
 * This replaces any existing key
 * Returns the full key (shown only once)
 */
export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use service client to call the RPC function
    const serviceClient = await createServiceClient()
    const { data: apiKey, error } = await serviceClient.rpc('generate_api_key', {
      p_user_id: user.id
    })

    if (error) {
      console.error('[FlipRadar API] API key generation error:', error)
      return NextResponse.json({ error: 'Failed to generate API key' }, { status: 500 })
    }

    // Return the full key (this is the only time it's shown in full)
    return NextResponse.json({
      success: true,
      apiKey,
      message: 'Copy this key now - it will only be shown once!'
    })

  } catch (error) {
    console.error('[FlipRadar API] API key POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE - Revoke (delete) the API key
 * The extension will stop working until a new key is generated
 */
export async function DELETE() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use service client to call the RPC function
    const serviceClient = await createServiceClient()
    const { error } = await serviceClient.rpc('revoke_api_key', {
      p_user_id: user.id
    })

    if (error) {
      console.error('[FlipRadar API] API key revoke error:', error)
      return NextResponse.json({ error: 'Failed to revoke API key' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'API key revoked successfully'
    })

  } catch (error) {
    console.error('[FlipRadar API] API key DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
