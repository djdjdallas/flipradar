'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import posthog from 'posthog-js'
import { AlertForm } from '@/components/AlertForm'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Bell, BellOff, Trash2, Loader2, ExternalLink } from 'lucide-react'

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchAlerts()
    fetchMatches()
  }, [])

  const fetchAlerts = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error) {
      setAlerts(data || [])
    }
    setLoading(false)
  }

  const fetchMatches = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('alert_matches')
      .select('*, alerts(search_query)')
      .eq('user_id', user.id)
      .eq('is_dismissed', false)
      .order('created_at', { ascending: false })
      .limit(10)

    if (!error) {
      setMatches(data || [])
    }
  }

  const handleCreateAlert = async (form) => {
    setCreating(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setCreating(false)
      return
    }

    const { error } = await supabase
      .from('alerts')
      .insert({
        user_id: user.id,
        search_query: form.search_query,
        max_price: parseFloat(form.max_price)
      })

    if (!error) {
      // Track alert created event
      posthog.capture('alert_created', {
        search_query: form.search_query,
        max_price: parseFloat(form.max_price)
      })

      fetchAlerts()
    } else {
      alert('Failed to create alert: ' + error.message)
    }

    setCreating(false)
  }

  const handleToggleAlert = async (id, isActive) => {
    const { error } = await supabase
      .from('alerts')
      .update({ is_active: isActive })
      .eq('id', id)

    if (!error) {
      setAlerts(alerts.map(a => a.id === id ? { ...a, is_active: isActive } : a))
    }
  }

  const handleDeleteAlert = async (id) => {
    if (!confirm('Are you sure you want to delete this alert?')) return

    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', id)

    if (!error) {
      // Track alert deleted event
      posthog.capture('alert_deleted', {
        alert_id: id
      })

      setAlerts(alerts.filter(a => a.id !== id))
    }
  }

  const handleDismissMatch = async (id) => {
    const { error } = await supabase
      .from('alert_matches')
      .update({ is_dismissed: true })
      .eq('id', id)

    if (!error) {
      setMatches(matches.filter(m => m.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="heading-font text-3xl">Price Alerts</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Create Alert Form */}
        <div>
          <AlertForm onSubmit={handleCreateAlert} loading={creating} />
        </div>

        {/* Active Alerts */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="heading-font text-xl">Active Alerts</h2>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#D2E823]" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="border-2 border-[#09090B] hard-shadow-sm bg-white">
              <div className="py-8 text-center">
                <Bell className="h-10 w-10 text-[#D2E823] mx-auto mb-3" />
                <p className="text-[#09090B]/50 font-medium">No alerts yet. Create one to get started!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="border-2 border-[#09090B] hard-shadow-sm bg-white">
                  <div className="py-4 px-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {alert.is_active ? (
                          <Bell className="h-5 w-5 text-[#D2E823]" />
                        ) : (
                          <BellOff className="h-5 w-5 text-[#09090B]/30" />
                        )}
                        <div>
                          <p className="font-bold">{alert.search_query}</p>
                          <p className="text-sm text-[#09090B]/50">
                            Max: ${alert.max_price}
                            {alert.times_triggered > 0 && (
                              <Badge variant="outline" className="ml-2 border-2 border-[#09090B] rounded-none">
                                {alert.times_triggered} matches
                              </Badge>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={alert.is_active}
                          onCheckedChange={(checked) => handleToggleAlert(alert.id, checked)}
                          className="data-[state=checked]:bg-[#D2E823]"
                        />
                        <button
                          className="text-red-500 hover:text-red-700 p-1"
                          onClick={() => handleDeleteAlert(alert.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Matches */}
      {matches.length > 0 && (
        <div className="space-y-4">
          <h2 className="heading-font text-xl">Recent Matches</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {matches.map((match) => (
              <div key={match.id} className="border-2 border-[#09090B] hard-shadow-sm bg-white">
                <div className="py-4 px-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <p className="font-bold text-sm truncate">Match found</p>
                      <p className="text-xs text-[#09090B]/50">
                        Alert: {match.alerts?.search_query}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        className="px-2 py-1 text-sm border-2 border-[#09090B] bg-white hard-shadow-sm btn-brutal"
                        onClick={() => window.open(match.source_url, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </button>
                      <button
                        className="px-2 py-1 text-sm text-[#09090B]/50 hover:text-[#09090B]"
                        onClick={() => handleDismissMatch(match.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
