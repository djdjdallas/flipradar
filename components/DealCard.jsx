'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ExternalLink, Trash2, Edit, DollarSign } from 'lucide-react'

const statusColors = {
  watching: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  purchased: 'bg-purple-100 text-purple-700',
  sold: 'bg-green-100 text-green-700',
  passed: 'bg-gray-100 text-gray-700',
  expired: 'bg-red-100 text-red-700'
}

export function DealCard({ deal, onUpdate, onDelete }) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editForm, setEditForm] = useState({
    status: deal.status,
    purchase_price: deal.purchase_price || '',
    sold_price: deal.sold_price || '',
    notes: deal.notes || ''
  })
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    setLoading(true)
    await onUpdate(deal.id, editForm)
    setLoading(false)
    setShowEditDialog(false)
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this deal?')) {
      await onDelete(deal.id)
    }
  }

  const profitColor = (profit) => {
    if (profit > 0) return 'text-green-600'
    if (profit < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Image */}
            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
              {deal.image_url ? (
                <img
                  src={deal.image_url}
                  alt={deal.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-gray-900 truncate" title={deal.title}>
                  {deal.title}
                </h3>
                <Badge className={statusColors[deal.status]}>
                  {deal.status}
                </Badge>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div>
                  <span className="text-gray-500">FB Price:</span>{' '}
                  <span className="font-medium">${deal.price}</span>
                </div>
                {deal.ebay_estimate_avg && (
                  <div>
                    <span className="text-gray-500">eBay Est:</span>{' '}
                    <span className="font-medium">
                      ${deal.ebay_estimate_low} - ${deal.ebay_estimate_high}
                    </span>
                  </div>
                )}
                {deal.estimated_profit_low !== null && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Est. Profit:</span>{' '}
                    <span className={`font-medium ${profitColor(deal.estimated_profit_low)}`}>
                      ${deal.estimated_profit_low} - ${deal.estimated_profit_high}
                    </span>
                  </div>
                )}
                {deal.actual_profit !== null && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Actual Profit:</span>{' '}
                    <span className={`font-bold ${profitColor(deal.actual_profit)}`}>
                      ${deal.actual_profit}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-3 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(deal.fb_url, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  FB
                </Button>
                {deal.ebay_search_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(deal.ebay_search_url, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    eBay
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditDialog(true)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                className="w-full border rounded-md p-2"
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
                <Label>Purchase Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-9"
                    value={editForm.purchase_price}
                    onChange={(e) => setEditForm({ ...editForm, purchase_price: e.target.value })}
                  />
                </div>
              </div>
            )}

            {editForm.status === 'sold' && (
              <div className="space-y-2">
                <Label>Sold Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-9"
                    value={editForm.sold_price}
                    onChange={(e) => setEditForm({ ...editForm, sold_price: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Notes</Label>
              <textarea
                className="w-full border rounded-md p-2 min-h-[80px]"
                placeholder="Add notes about this deal..."
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
