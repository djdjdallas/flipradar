'use client'

export function UsageBar({ used, limit, label = 'Lookups' }) {
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0
  const remaining = Math.max(limit - used, 0)

  let barColor = 'bg-green-500'
  if (percentage >= 80) {
    barColor = 'bg-red-500'
  } else if (percentage >= 50) {
    barColor = 'bg-yellow-500'
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">
          {used} / {limit === -1 ? '∞' : limit}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {limit > 0 && (
        <p className="text-xs text-gray-500">
          {remaining} remaining today
        </p>
      )}
    </div>
  )
}
