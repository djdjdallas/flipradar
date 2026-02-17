'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AuthForm } from '@/components/AuthForm'
import { Loader2, CheckCircle } from 'lucide-react'

export default function ExtensionAuthPage() {
  const [status, setStatus] = useState('checking') // checking, needs_auth, authenticated, redirecting
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
      setUser(session.user)
      setStatus('authenticated')

      // Redirect to callback with token for extension to capture
      setTimeout(() => {
        setStatus('redirecting')
        const callbackUrl = new URL('/auth/extension/callback', window.location.origin)
        callbackUrl.searchParams.set('token', session.access_token)
        callbackUrl.searchParams.set('refresh_token', session.refresh_token)
        callbackUrl.searchParams.set('user', JSON.stringify({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email
        }))
        window.location.href = callbackUrl.toString()
      }, 1500)
    } else {
      setStatus('needs_auth')
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user)
        setStatus('authenticated')

        setTimeout(() => {
          setStatus('redirecting')
          const callbackUrl = new URL('/auth/extension/callback', window.location.origin)
          callbackUrl.searchParams.set('token', session.access_token)
          callbackUrl.searchParams.set('refresh_token', session.refresh_token)
          callbackUrl.searchParams.set('user', JSON.stringify({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email
          }))
          window.location.href = callbackUrl.toString()
        }, 1500)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto" />
          <p className="mt-4 text-gray-600">Connecting FlipChecker...</p>
        </div>
      </div>
    )
  }

  if (status === 'authenticated' || status === 'redirecting') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold">
            {status === 'authenticated' ? 'Authenticated!' : 'Connecting to Extension...'}
          </h2>
          <p className="mt-2 text-gray-600">
            {user?.email}
          </p>
          {status === 'redirecting' && (
            <p className="mt-4 text-sm text-gray-500">
              You can close this tab after the extension connects.
            </p>
          )}
        </div>
      </div>
    )
  }

  // needs_auth - show login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">
            Connect <span className="text-green-500">Flip</span>Checker Extension
          </h1>
          <p className="text-gray-600 mt-2">
            Sign in to sync your extension with your account
          </p>
        </div>
        <AuthForm
          mode="login"
          redirectTo={`${window.location.origin}/auth/callback?extension=true`}
        />
      </div>
    </div>
  )
}
