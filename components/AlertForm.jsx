'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Bell, Loader2 } from 'lucide-react'

export function AlertForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    search_query: '',
    max_price: '',
    location: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.search_query || !form.max_price) return
    onSubmit(form)
    setForm({ search_query: '', max_price: '', location: '' })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Create Price Alert
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search_query">Search Query</Label>
            <Input
              id="search_query"
              placeholder="e.g., iPhone 13 Pro"
              value={form.search_query}
              onChange={(e) => setForm({ ...form, search_query: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_price">Max Price</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="max_price"
                type="number"
                step="1"
                placeholder="200"
                className="pl-9"
                value={form.max_price}
                onChange={(e) => setForm({ ...form, max_price: e.target.value })}
                required
              />
            </div>
            <p className="text-xs text-gray-500">
              Alert when listing is below this price
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location (optional)</Label>
            <Input
              id="location"
              placeholder="e.g., San Francisco, CA"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Create Alert
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
