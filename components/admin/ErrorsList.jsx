'use client'

import { Badge } from '@/components/ui/badge'

export function ErrorsList({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400">
        No errors in the last 7 days
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {data.map((error, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border"
        >
          <Badge variant="destructive" className="mt-0.5 shrink-0">
            {error.error_type || 'Error'}
          </Badge>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {error.message || 'Unknown error'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {error.occurrences} occurrence{error.occurrences !== 1 ? 's' : ''}
              {error.last_seen && (
                <> &middot; Last seen {new Date(error.last_seen).toLocaleDateString()}</>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
