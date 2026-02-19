export function StatsCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="border-2 border-[#09090B] hard-shadow-sm bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#09090B]/60 font-bold uppercase text-xs tracking-wider">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-[#09090B]/40 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="h-12 w-12 bg-[#D2E823] border-2 border-[#09090B] flex items-center justify-center">
            <Icon className="h-6 w-6 text-[#09090B]" />
          </div>
        )}
      </div>
    </div>
  )
}
