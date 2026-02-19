'use client'

import { useState } from 'react'
import posthog from 'posthog-js'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ExternalLink, Trash2, Edit, DollarSign, Package, Zap, Bot, Code, Tag, MapPin, User } from 'lucide-react'

// Extraction method configuration
const extractionMethods = {
  graphql: { icon: Zap, label: 'GraphQL', color: 'bg-green-100 text-green-700 border border-green-300 rounded-none' },
  ai: { icon: Bot, label: 'AI', color: 'bg-blue-100 text-blue-700 border border-blue-300 rounded-none' },
  dom: { icon: Code, label: 'DOM', color: 'bg-gray-100 text-gray-700 border border-gray-300 rounded-none' },
  meta: { icon: Tag, label: 'Meta', color: 'bg-yellow-100 text-yellow-700 border border-yellow-300 rounded-none' }
}

const statusColors = {
  watching: 'bg-blue-100 text-blue-700 border border-blue-300 rounded-none',
  contacted: 'bg-yellow-100 text-yellow-700 border border-yellow-300 rounded-none',
  purchased: 'bg-purple-100 text-purple-700 border border-purple-300 rounded-none',
  sold: 'bg-green-100 text-green-700 border border-green-300 rounded-none',
  passed: 'bg-gray-100 text-gray-700 border border-gray-300 rounded-none',
  expired: 'bg-red-100 text-red-700 border border-red-300 rounded-none'
}

export function DealCard({ deal, onUpdate, onDelete }) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [editForm, setEditForm] = useState({
    status: deal.status,
    purchase_price: deal.purchase_price || '',
    sold_price: deal.sold_price || '',
    notes: deal.notes || ''
  })
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    setLoading(true)
    const previousStatus = deal.status
    await onUpdate(deal.id, editForm)

    // Track deal updated event
    posthog.capture('deal_updated', {
      deal_id: deal.id,
      previous_status: previousStatus,
      new_status: editForm.status,
      has_purchase_price: !!editForm.purchase_price,
      has_sold_price: !!editForm.sold_price
    })

    setLoading(false)
    setShowEditDialog(false)
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this deal?')) {
      // Track deal deleted event
      posthog.capture('deal_deleted', {
        deal_id: deal.id,
        deal_status: deal.status
      })

      await onDelete(deal.id)
    }
  }

  const profitColor = (profit) => {
    if (profit > 0) return 'text-green-600'
    if (profit < 0) return 'text-red-600'
    return 'text-[#09090B]/60'
  }

  return (
    <>
      <div className="border-2 border-[#09090B] hard-shadow-sm bg-white">
        <div className="p-4">
          <div className="flex gap-4">
            <div className="w-24 h-24 bg-[#F8F4E8] border-2 border-[#09090B] overflow-hidden shrink-0 flex items-center justify-center">
              {deal.images?.[0] && !imgError ? (
                <img
                  src={deal.images[0]}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Package className="h-8 w-8 text-[#09090B]/30" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-[#09090B] truncate" title={deal.user_title}>
                  {deal.user_title}
                </h3>
                <div className="flex gap-1 shrink-0">
                  {deal.extraction_method && extractionMethods[deal.extraction_method] && (
                    <Badge className={extractionMethods[deal.extraction_method].color}>
                      {(() => {
                        const Icon = extractionMethods[deal.extraction_method].icon
                        return <Icon className="h-3 w-3 mr-1" />
                      })()}
                      {extractionMethods[deal.extraction_method].label}
                    </Badge>
                  )}
                  <Badge className={statusColors[deal.status]}>
                    {deal.status}
                  </Badge>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div>
                  <span className="text-[#09090B]/50">Asking Price:</span>{' '}
                  <span className="font-bold">${deal.user_asking_price}</span>
                </div>
                {deal.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-[#09090B]/40" />
                    <span className="text-[#09090B]/60 truncate">{deal.location}</span>
                  </div>
                )}
                {deal.seller_name && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 text-[#09090B]/40" />
                    <span className="text-[#09090B]/60 truncate">{deal.seller_name}</span>
                  </div>
                )}
                {deal.condition && (
                  <div>
                    <span className="text-[#09090B]/50">Condition:</span>{' '}
                    <span className="text-[#09090B]/60">{deal.condition}</span>
                  </div>
                )}
                {deal.ebay_estimate_avg && (
                  <div>
                    <span className="text-[#09090B]/50">eBay Est:</span>{' '}
                    <span className="font-bold">
                      ${deal.ebay_estimate_low} - ${deal.ebay_estimate_high}
                    </span>
                  </div>
                )}
                {deal.estimated_profit_low !== null && (
                  <div className="col-span-2">
                    <span className="text-[#09090B]/50">Est. Profit:</span>{' '}
                    <span className={`font-bold ${profitColor(deal.estimated_profit_low)}`}>
                      ${deal.estimated_profit_low} - ${deal.estimated_profit_high}
                    </span>
                    {deal.user_asking_price > 0 && (
                      <span className="text-[#09090B]/40 text-xs ml-1">
                        ({Math.round((deal.estimated_profit_low / deal.user_asking_price) * 100)}% – {Math.round((deal.estimated_profit_high / deal.user_asking_price) * 100)}% ROI)
                      </span>
                    )}
                  </div>
                )}
                {deal.actual_profit !== null && (
                  <div className="col-span-2">
                    <span className="text-[#09090B]/50">Actual Profit:</span>{' '}
                    <span className={`font-bold ${profitColor(deal.actual_profit)}`}>
                      ${deal.actual_profit}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-3 flex items-center gap-2">
                {(() => {
                  const sourceUrl = deal.source_url ||
                    (deal.fb_listing_id ? `https://www.facebook.com/marketplace/item/${deal.fb_listing_id}/` : null)
                  const ebayUrl = deal.ebay_search_url ||
                    (deal.user_title ? `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(deal.user_title)}&LH_Complete=1&LH_Sold=1` : null)
                  return (
                    <>
                      <button
                        className="px-3 py-1.5 text-sm border-2 border-[#09090B] bg-white hard-shadow-sm btn-brutal font-bold flex items-center disabled:opacity-50"
                        disabled={!sourceUrl}
                        onClick={() => sourceUrl && window.open(sourceUrl, '_blank')}
                        title={sourceUrl || 'No source URL'}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </button>
                      <button
                        className="px-3 py-1.5 text-sm border-2 border-[#09090B] bg-white hard-shadow-sm btn-brutal font-bold flex items-center disabled:opacity-50"
                        disabled={!ebayUrl}
                        onClick={() => ebayUrl && window.open(ebayUrl, '_blank')}
                        title={ebayUrl || 'No eBay URL'}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        eBay
                      </button>
                    </>
                  )
                })()}
                <button
                  className="px-3 py-1.5 text-sm border-2 border-[#09090B] bg-white hard-shadow-sm btn-brutal font-bold flex items-center"
                  onClick={() => setShowEditDialog(true)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </button>
                <button
                  className="px-3 py-1.5 text-sm text-red-500 hover:text-red-700 font-bold flex items-center"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="border-2 border-[#09090B] hard-shadow-lg rounded-none bg-[#F8F4E8]">
          <DialogHeader>
            <DialogTitle className="heading-font text-lg">Edit Deal</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="block font-bold uppercase text-xs tracking-wider text-[#09090B]">Status</label>
              <select
                className="w-full border-2 border-[#09090B] rounded-none p-2 bg-white focus:ring-2 focus:ring-[#D2E823] focus:border-[#09090B]"
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              >
                <option value="watching">Watching</option>
                <option value="contacted">Contacted</option>
                <option value="purchased">Purchased</option>
                <option value="sold">Sold</option>
                <option value="passed">Passed</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {(editForm.status === 'purchased' || editForm.status === 'sold') && (
              <div className="space-y-2">
                <label className="block font-bold uppercase text-xs tracking-wider text-[#09090B]">Purchase Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#09090B]/40" />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-9 border-2 border-[#09090B] rounded-none focus:ring-2 focus:ring-[#D2E823] focus:border-[#09090B]"
                    value={editForm.purchase_price}
                    onChange={(e) => setEditForm({ ...editForm, purchase_price: e.target.value })}
                  />
                </div>
              </div>
            )}

            {editForm.status === 'sold' && (
              <div className="space-y-2">
                <label className="block font-bold uppercase text-xs tracking-wider text-[#09090B]">Sold Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#09090B]/40" />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-9 border-2 border-[#09090B] rounded-none focus:ring-2 focus:ring-[#D2E823] focus:border-[#09090B]"
                    value={editForm.sold_price}
                    onChange={(e) => setEditForm({ ...editForm, sold_price: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block font-bold uppercase text-xs tracking-wider text-[#09090B]">Notes</label>
              <textarea
                className="w-full border-2 border-[#09090B] rounded-none p-2 min-h-[80px] bg-white focus:ring-2 focus:ring-[#D2E823] focus:border-[#09090B] focus:outline-none"
                placeholder="Add notes about this deal..."
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <button
              className="px-4 py-2 border-2 border-[#09090B] bg-white hard-shadow-sm btn-brutal font-bold"
              onClick={() => setShowEditDialog(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-[#09090B] text-[#D2E823] border-2 border-[#09090B] hard-shadow-sm btn-brutal font-bold"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
