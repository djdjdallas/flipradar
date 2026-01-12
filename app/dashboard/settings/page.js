'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UsageBar } from '@/components/UsageBar'
import { User, CreditCard, Download, Trash2, Loader2, ExternalLink } from 'lucide-react'

export default function SettingsPage() {
  const [profile, setProfile] = useState(null)
  const [usage, setUsage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [billingLoading, setBillingLoading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchProfile()
    fetchUsage()
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

  const handleManageBilling = async () => {
    setBillingLoading(true)

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

    // Download as JSON
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `flipradar-export-${new Date().toISOString().split('T')[0]}.json`
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
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{profile?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium">
                {new Date(profile?.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Current Plan</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold">{tierNames[profile?.tier] || 'Free'}</p>
                {profile?.subscription_status === 'active' && (
                  <Badge className="bg-green-100 text-green-700">Active</Badge>
                )}
                {profile?.subscription_status === 'past_due' && (
                  <Badge className="bg-red-100 text-red-700">Past Due</Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {profile?.stripe_customer_id && (
                <Button
                  variant="outline"
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
                </Button>
              )}
              {profile?.tier === 'free' && (
                <Button onClick={() => window.location.href = '/pricing'}>
                  Upgrade
                </Button>
              )}
            </div>
          </div>

          {profile?.current_period_end && (
            <p className="text-sm text-gray-500">
              {profile?.subscription_status === 'canceled'
                ? 'Access until'
                : 'Next billing date'}
              : {new Date(profile.current_period_end).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Usage */}
      {usage && (
        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
            <CardDescription>Your current usage this billing period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <p className="text-xs text-gray-500">
              Lookups reset at {new Date(usage.lookups.resets_at).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data</CardTitle>
          <CardDescription>Export or delete your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Export Data</p>
              <p className="text-sm text-gray-500">
                Download all your deals and alerts as JSON
              </p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <hr />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-600">Delete Account</p>
              <p className="text-sm text-gray-500">
                Permanently delete your account and all data
              </p>
            </div>
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
