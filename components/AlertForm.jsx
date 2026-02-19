'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
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
    <div className="border-2 border-[#09090B] hard-shadow-sm bg-white">
      <div className="p-4 border-b-2 border-[#09090B]">
        <h3 className="heading-font text-lg flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Create Price Alert
        </h3>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="search_query" className="block font-bold uppercase text-xs tracking-wider text-[#09090B]">
              Search Query
            </label>
            <Input
              id="search_query"
              placeholder="e.g., iPhone 13 Pro"
              value={form.search_query}
              onChange={(e) => setForm({ ...form, search_query: e.target.value })}
              required
              className="border-2 border-[#09090B] rounded-none focus:ring-2 focus:ring-[#D2E823] focus:border-[#09090B]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="max_price" className="block font-bold uppercase text-xs tracking-wider text-[#09090B]">
              Max Price
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#09090B]/40" />
              <Input
                id="max_price"
                type="number"
                step="1"
                placeholder="200"
                className="pl-9 border-2 border-[#09090B] rounded-none focus:ring-2 focus:ring-[#D2E823] focus:border-[#09090B]"
                value={form.max_price}
                onChange={(e) => setForm({ ...form, max_price: e.target.value })}
                required
              />
            </div>
            <p className="text-xs text-[#09090B]/50">
              Alert when listing is below this price
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="block font-bold uppercase text-xs tracking-wider text-[#09090B]">
              Location (optional)
            </label>
            <Input
              id="location"
              placeholder="e.g., San Francisco, CA"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="border-2 border-[#09090B] rounded-none focus:ring-2 focus:ring-[#D2E823] focus:border-[#09090B]"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2.5 bg-[#09090B] text-[#D2E823] border-2 border-[#09090B] hard-shadow-sm btn-brutal font-bold uppercase tracking-wider flex items-center justify-center"
            disabled={loading}
          >
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
          </button>
        </form>
      </div>
    </div>
  )
}
