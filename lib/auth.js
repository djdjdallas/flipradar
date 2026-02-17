/**
 * Centralized authentication helper for FlipChecker API
 * Supports both session-based auth (dashboard) and API key auth (extension)
 */

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { createClient as createDirectClient } from '@supabase/supabase-js'

/**
 * Authenticate request via session cookies OR API key
 * Use this for endpoints that need to support both dashboard and extension access
 *
 * @param {Request} request - The incoming request
 * @returns {Promise<{user, profile, authMethod} | {error, status}>}
 */
export async function authenticateRequest(request) {
  // 1. Check for API key in header (X-API-Key or Authorization: Bearer fr_...)
  const apiKey = extractApiKey(request)

  if (apiKey) {
    return authenticateWithApiKey(apiKey)
  }

  // 2. Fall back to session-based auth
  return authenticateWithSession()
}

/**
 * Authenticate Bearer token (for /api/extract compatibility)
 * Supports both Supabase JWT tokens and FlipChecker API keys
 *
 * @param {Request} request - The incoming request
 * @returns {Promise<{user, profile, authMethod} | {error, status}>}
 */
export async function authenticateBearer(request) {
  const authHeader = request.headers.get('authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Missing authorization header', status: 401 }
  }

  const token = authHeader.substring(7)

  // Check if it's a FlipChecker API key
  if (token.startsWith('fr_')) {
    return authenticateWithApiKey(token)
  }

  // Otherwise treat as Supabase JWT token
  return authenticateWithJwt(token)
}

/**
 * Extract API key from request headers
 * Checks X-API-Key header first, then Authorization: Bearer
 *
 * @param {Request} request
 * @returns {string|null}
 */
function extractApiKey(request) {
  // Check X-API-Key header first (preferred for API keys)
  const xApiKey = request.headers.get('x-api-key')
  if (xApiKey?.startsWith('fr_')) {
    return xApiKey
  }

  // Check Authorization header for Bearer API key
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer fr_')) {
    return authHeader.substring(7)
  }

  // Not an API key (might be a Supabase JWT or session)
  return null
}

/**
 * Authenticate using FlipChecker API key
 *
 * @param {string} apiKey
 * @returns {Promise<{user, profile, authMethod} | {error, status}>}
 */
async function authenticateWithApiKey(apiKey) {
  try {
    const serviceClient = await createServiceClient()

    // Look up user by API key
    const { data: profile, error } = await serviceClient
      .from('profiles')
      .select('id, tier, deals_saved_count, lookups_used_today, lookups_reset_at')
      .eq('api_key', apiKey)
      .single()

    if (error || !profile) {
      console.log('[FlipChecker API] Invalid API key attempt')
      return { error: 'Invalid API key', status: 401 }
    }

    return {
      user: { id: profile.id },
      profile,
      authMethod: 'api_key'
    }
  } catch (err) {
    console.error('[FlipChecker API] API key auth error:', err)
    return { error: 'Authentication failed', status: 500 }
  }
}

/**
 * Authenticate using Supabase session cookies
 *
 * @returns {Promise<{user, profile, authMethod} | {error, status}>}
 */
async function authenticateWithSession() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Unauthorized', status: 401 }
    }

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, tier, deals_saved_count, lookups_used_today, lookups_reset_at')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('[FlipChecker API] Profile fetch error:', profileError)
      // Still return user even if profile fetch fails
    }

    return {
      user,
      profile: profile || { id: user.id, tier: 'free', deals_saved_count: 0 },
      authMethod: 'session'
    }
  } catch (err) {
    console.error('[FlipChecker API] Session auth error:', err)
    return { error: 'Authentication failed', status: 500 }
  }
}

/**
 * Authenticate using Supabase JWT token
 * Used for programmatic access with short-lived tokens
 *
 * @param {string} token - Supabase JWT token
 * @returns {Promise<{user, profile, authMethod} | {error, status}>}
 */
async function authenticateWithJwt(token) {
  try {
    // Create a direct Supabase client with the anon key
    const supabase = createDirectClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return { error: 'Invalid token', status: 401 }
    }

    // Get profile using service client (to bypass RLS for this lookup)
    const serviceClient = await createServiceClient()
    const { data: profile, error: profileError } = await serviceClient
      .from('profiles')
      .select('id, tier, deals_saved_count, lookups_used_today, lookups_reset_at')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('[FlipChecker API] Profile fetch error:', profileError)
    }

    return {
      user,
      profile: profile || { id: user.id, tier: 'free', deals_saved_count: 0 },
      authMethod: 'bearer_token'
    }
  } catch (err) {
    console.error('[FlipChecker API] JWT auth error:', err)
    return { error: 'Authentication failed', status: 500 }
  }
}
