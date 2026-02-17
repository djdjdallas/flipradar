'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const TIER_COLORS = {
  free: '#9ca3af',
  flipper: '#3b82f6',
  pro: '#8b5cf6',
}

export function TierBreakdown({ data }) {
  if (!data) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No data available
      </div>
    )
  }

  const chartData = Object.entries(data)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: TIER_COLORS[name] || '#9ca3af',
    }))
    .filter((d) => d.value > 0)

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No users yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          dataKey="value"
          nameKey="name"
          label={({ name, value }) => `${name}: ${value}`}
        >
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
