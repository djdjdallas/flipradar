'use client'

export function UsageBar({ used, limit, label = 'Lookups' }) {
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0
  const remaining = Math.max(limit - used, 0)

  let barColor = 'bg-[#D2E823]'
  if (percentage >= 80) {
    barColor = 'bg-red-500'
  } else if (percentage >= 50) {
    barColor = 'bg-yellow-500'
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-[#09090B]/70 font-bold uppercase text-xs tracking-wider">{label}</span>
        <span className="font-bold text-xs">
          {used} / {limit === -1 ? '∞' : limit}
        </span>
      </div>
      <div className="h-3 bg-white border-2 border-[#09090B] overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {limit > 0 && (
        <p className="text-xs text-[#09090B]/50 font-medium">
          {remaining} remaining today
        </p>
      )}
    </div>
  )
}
