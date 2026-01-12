import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirect = searchParams.get('redirect') || '/dashboard'
  const isExtension = searchParams.get('extension') === 'true'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.session) {
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
