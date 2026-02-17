import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getPostHogClient } from '@/lib/posthog-server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirect = searchParams.get('redirect') || '/dashboard'
  const isExtension = searchParams.get('extension') === 'true'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.session) {
      // Track OAuth login/signup on server side
      const posthog = getPostHogClient()
      const isNewUser = data.user.created_at === data.user.last_sign_in_at

      posthog.identify({
        distinctId: data.user.id,
        properties: {
          email: data.user.email,
          name: data.user.user_metadata?.full_name || data.user.email
        }
      })

      posthog.capture({
        distinctId: data.user.id,
        event: isNewUser ? 'user_signed_up' : 'user_logged_in',
        properties: {
          method: 'google',
          email: data.user.email
        }
      })

      // If this is an extension auth flow, redirect to extension callback
      if (isExtension) {
        const extensionCallbackUrl = new URL('/auth/extension/callback', origin)
        extensionCallbackUrl.searchParams.set('token', data.session.access_token)
        extensionCallbackUrl.searchParams.set('refresh_token', data.session.refresh_token)
        extensionCallbackUrl.searchParams.set('user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.full_name || data.user.email
        }))
        return NextResponse.redirect(extensionCallbackUrl)
      }

      // Normal web flow - redirect to dashboard or specified page
      return NextResponse.redirect(new URL(redirect, origin))
    }
  }

  // Auth error - redirect to login with error
  return NextResponse.redirect(new URL('/auth/login?error=auth_failed', origin))
}
