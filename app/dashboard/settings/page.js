'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import posthog from 'posthog-js'
import { UsageBar } from '@/components/UsageBar'
import { User, CreditCard, Download, Trash2, Loader2, ExternalLink, Key, Copy, RefreshCw, Bell } from 'lucide-react'

export default function SettingsPage() {
  const [profile, setProfile] = useState(null)
  const [usage, setUsage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [billingLoading, setBillingLoading] = useState(false)
  const [apiKey, setApiKey] = useState({ hasKey: false, maskedKey: null })
  const [fullApiKey, setFullApiKey] = useState(null)
  const [keyLoading, setKeyLoading] = useState(false)
  const [keyCopied, setKeyCopied] = useState(false)
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true)
  const [emailToggleLoading, setEmailToggleLoading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchProfile()
    fetchUsage()
    fetchApiKeyStatus()
  }, [])

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!error) {
      setProfile(data)
      setEmailAlertsEnabled(data?.email_alerts_enabled !== false)
    }
    setLoading(false)
  }

  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/usage')
      if (response.ok) {
        const data = await response.json()
        setUsage(data)
      }
    } catch (error) {
      console.error('Failed to fetch usage:', error)
    }
  }

  const fetchApiKeyStatus = async () => {
    try {
      const response = await fetch('/api/api-key')
      if (response.ok) {
        const data = await response.json()
        setApiKey(data)
      }
    } catch (error) {
      console.error('Failed to fetch API key status:', error)
    }
  }

  const handleGenerateApiKey = async () => {
    const confirmed = apiKey.hasKey
      ? confirm('This will replace your existing API key. The extension will need to be reconfigured. Continue?')
      : true

    if (!confirmed) return

    setKeyLoading(true)
    setFullApiKey(null)

    try {
      const response = await fetch('/api/api-key', { method: 'POST' })
      const data = await response.json()

      if (data.apiKey) {
        // Track API key generated event
        posthog.capture('api_key_generated', {
          is_regeneration: apiKey.hasKey
        })

        setFullApiKey(data.apiKey)
        setApiKey({
          hasKey: true,
          maskedKey: data.apiKey.substring(0, 7) + '...' + data.apiKey.slice(-4)
        })
        // Auto-hide full key after 60 seconds
        setTimeout(() => setFullApiKey(null), 60000)
      } else {
        alert('Failed to generate API key')
      }
    } catch (error) {
      console.error('Failed to generate API key:', error)
      alert('Failed to generate API key')
    } finally {
      setKeyLoading(false)
    }
  }

  const handleRevokeApiKey = async () => {
    if (!confirm('Are you sure? The extension will stop working until you generate a new key.')) {
      return
    }

    setKeyLoading(true)

    try {
      const response = await fetch('/api/api-key', { method: 'DELETE' })
      if (response.ok) {
        setApiKey({ hasKey: false, maskedKey: null })
        setFullApiKey(null)
      } else {
        alert('Failed to revoke API key')
      }
    } catch (error) {
      console.error('Failed to revoke API key:', error)
      alert('Failed to revoke API key')
    } finally {
      setKeyLoading(false)
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setKeyCopied(true)
      setTimeout(() => setKeyCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setKeyCopied(true)
      setTimeout(() => setKeyCopied(false), 2000)
    }
  }

  const handleToggleEmailAlerts = async () => {
    setEmailToggleLoading(true)
    const newValue = !emailAlertsEnabled
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ email_alerts_enabled: newValue })
        .eq('id', profile.id)

      if (!error) {
        setEmailAlertsEnabled(newValue)
      }
    } catch (err) {
      console.error('Failed to toggle email alerts:', err)
    } finally {
      setEmailToggleLoading(false)
    }
  }

  const handleManageBilling = async () => {
    setBillingLoading(true)

    // Track billing portal opened event
    posthog.capture('billing_portal_opened')

    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST'
      })
      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Failed to open billing portal')
      }
    } catch (error) {
      console.error('Billing portal error:', error)
      alert('Failed to open billing portal')
    } finally {
      setBillingLoading(false)
    }
  }

  const handleExportData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Fetch all user data
    const { data: deals } = await supabase
      .from('deals')
      .select('*')
      .eq('user_id', user.id)

    const { data: alerts } = await supabase
      .from('alerts')
      .select('*')
      .eq('user_id', user.id)

    const exportData = {
      exported_at: new Date().toISOString(),
      profile: profile,
      deals: deals || [],
      alerts: alerts || []
    }

    // Track data exported event
    posthog.capture('data_exported', {
      deals_count: (deals || []).length,
      alerts_count: (alerts || []).length
    })

    // Download as JSON
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `flipchecker-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    )
    if (!confirmed) return

    const doubleConfirmed = confirm(
      'This will permanently delete all your data. Type "DELETE" to confirm.'
    )
    if (!doubleConfirmed) return

    // For now, just sign out - actual deletion would need admin API
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const tierNames = {
    free: 'Free',
    flipper: 'Flipper',
    pro: 'Pro'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#D2E823]" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="heading-font text-3xl">Settings</h1>

      {/* Account Info */}
      <div className="border-2 border-[#09090B] hard-shadow-sm bg-white">
        <div className="p-4 border-b-2 border-[#09090B]">
          <h2 className="heading-font text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Account
          </h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[#09090B]/50 font-bold uppercase text-xs tracking-wider">Email</p>
              <p className="font-medium mt-1">{profile?.email}</p>
            </div>
            <div>
              <p className="text-[#09090B]/50 font-bold uppercase text-xs tracking-wider">Member Since</p>
              <p className="font-medium mt-1">
                {new Date(profile?.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="border-2 border-[#09090B] hard-shadow-sm bg-white">
        <div className="p-4 border-b-2 border-[#09090B]">
          <h2 className="heading-font text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription
          </h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#09090B]/50 font-bold uppercase text-xs tracking-wider">Current Plan</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xl font-bold">{tierNames[profile?.tier] || 'Free'}</p>
                {profile?.subscription_status === 'active' && (
                  <span className="bg-[#D2E823] text-[#09090B] border border-[#09090B] px-2 py-0.5 text-xs font-bold uppercase">
                    Active
                  </span>
                )}
                {profile?.subscription_status === 'past_due' && (
                  <span className="bg-red-100 text-red-700 border border-red-300 px-2 py-0.5 text-xs font-bold uppercase">
                    Past Due
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {profile?.stripe_customer_id && (
                <button
                  className="px-4 py-2 border-2 border-[#09090B] bg-white hard-shadow-sm btn-brutal font-bold flex items-center"
                  onClick={handleManageBilling}
                  disabled={billingLoading}
                >
                  {billingLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Manage Billing
                    </>
                  )}
                </button>
              )}
              {profile?.tier === 'free' && (
                <button
                  className="px-4 py-2 bg-[#09090B] text-[#D2E823] border-2 border-[#09090B] hard-shadow-sm btn-brutal font-bold"
                  onClick={() => window.location.href = '/pricing'}
                >
                  Upgrade
                </button>
              )}
            </div>
          </div>

          {profile?.current_period_end && (
            <p className="text-sm text-[#09090B]/50">
              {profile?.subscription_status === 'canceled'
                ? 'Access until'
                : 'Next billing date'}
              : {new Date(profile.current_period_end).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Usage */}
      {usage && (
        <div className="border-2 border-[#09090B] hard-shadow-sm bg-white">
          <div className="p-4 border-b-2 border-[#09090B]">
            <h2 className="heading-font text-lg">Usage</h2>
            <p className="text-[#09090B]/50 text-sm mt-1">Your current usage this billing period</p>
          </div>
          <div className="p-4 space-y-4">
            <UsageBar
              used={usage.lookups.used}
              limit={usage.lookups.limit}
              label="Price Lookups Today"
            />
            <UsageBar
              used={usage.deals.saved}
              limit={usage.deals.limit}
              label="Saved Deals"
            />
            <p className="text-xs text-[#09090B]/50">
              Lookups reset at {new Date(usage.lookups.resets_at).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Extension API Key */}
      <div className="border-2 border-[#09090B] hard-shadow-sm bg-white">
        <div className="p-4 border-b-2 border-[#09090B]">
          <h2 className="heading-font text-lg flex items-center gap-2">
            <Key className="h-5 w-5" />
            Extension API Key
          </h2>
          <p className="text-[#09090B]/50 text-sm mt-1">
            Use this key to connect the FlipChecker Chrome extension to your account
          </p>
        </div>
        <div className="p-4 space-y-4">
          {fullApiKey ? (
            // Show full key after generation
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <code className="flex-1 p-3 bg-[#D2E823]/20 border-2 border-[#D2E823] text-sm font-mono break-all">
                  {fullApiKey}
                </code>
                <button
                  className="px-3 py-2 border-2 border-[#09090B] bg-white hard-shadow-sm btn-brutal font-bold flex items-center shrink-0"
                  onClick={() => copyToClipboard(fullApiKey)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  {keyCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-sm text-amber-600 font-bold">
                Copy this key now - it will only be shown once!
              </p>
            </div>
          ) : apiKey.hasKey ? (
            // Show masked key
            <div className="flex items-center gap-2">
              <code className="flex-1 p-3 bg-[#F8F4E8] border-2 border-[#09090B] text-sm font-mono">
                {apiKey.maskedKey}
              </code>
              <button
                className="px-3 py-2 border-2 border-[#09090B] bg-white hard-shadow-sm btn-brutal flex items-center"
                onClick={handleGenerateApiKey}
                disabled={keyLoading}
              >
                <RefreshCw className={`h-4 w-4 ${keyLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          ) : (
            // No key yet
            <p className="text-sm text-[#09090B]/50">No API key generated yet</p>
          )}

          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-[#09090B] text-[#D2E823] border-2 border-[#09090B] hard-shadow-sm btn-brutal font-bold flex items-center"
              onClick={handleGenerateApiKey}
              disabled={keyLoading}
            >
              {keyLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Key className="h-4 w-4 mr-2" />
              )}
              {apiKey.hasKey ? 'Regenerate Key' : 'Generate Key'}
            </button>

            {apiKey.hasKey && (
              <button
                className="px-4 py-2 border-2 border-red-500 text-red-600 bg-white hover:bg-red-50 font-bold btn-brutal"
                onClick={handleRevokeApiKey}
                disabled={keyLoading}
              >
                Revoke
              </button>
            )}
          </div>

          <p className="text-xs text-[#09090B]/50">
            Add this key to your FlipChecker extension settings to sync deals to your account.
          </p>
        </div>
      </div>

      {/* Email Alerts */}
      <div className="border-2 border-[#09090B] hard-shadow-sm bg-white">
        <div className="p-4 border-b-2 border-[#09090B]">
          <h2 className="heading-font text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Email Alerts
          </h2>
          <p className="text-[#09090B]/50 text-sm mt-1">
            Get notified by email when deals match your watchlist filters
          </p>
        </div>
        <div className="p-4">
          {profile?.tier === 'free' ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Email notifications</p>
                <p className="text-sm text-[#09090B]/50">
                  Available on Flipper and Pro plans
                </p>
              </div>
              <button
                className="px-4 py-2 bg-[#09090B] text-[#D2E823] border-2 border-[#09090B] hard-shadow-sm btn-brutal font-bold"
                onClick={() => window.location.href = '/pricing'}
              >
                Upgrade
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Email notifications</p>
                <p className="text-sm text-[#09090B]/50">
                  Receive an email when a deal matches your watchlist filters
                </p>
              </div>
              <button
                className={`relative w-12 h-7 rounded-full transition-colors border-2 border-[#09090B] ${
                  emailAlertsEnabled ? 'bg-[#D2E823]' : 'bg-[#09090B]/10'
                }`}
                onClick={handleToggleEmailAlerts}
                disabled={emailToggleLoading}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white border-2 border-[#09090B] rounded-full transition-transform ${
                    emailAlertsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Data Management */}
      <div className="border-2 border-[#09090B] hard-shadow-sm bg-white">
        <div className="p-4 border-b-2 border-[#09090B]">
          <h2 className="heading-font text-lg">Data</h2>
          <p className="text-[#09090B]/50 text-sm mt-1">Export or delete your data</p>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">Export Data</p>
              <p className="text-sm text-[#09090B]/50">
                Download all your deals and alerts as JSON
              </p>
            </div>
            <button
              className="px-4 py-2 border-2 border-[#09090B] bg-white hard-shadow-sm btn-brutal font-bold flex items-center"
              onClick={handleExportData}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>

          <hr className="border-t-2 border-[#09090B]" />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-red-600">Delete Account</p>
              <p className="text-sm text-[#09090B]/50">
                Permanently delete your account and all data
              </p>
            </div>
            <button
              className="px-4 py-2 border-2 border-red-500 text-red-600 bg-white hover:bg-red-50 font-bold btn-brutal flex items-center"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
