'use client'

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444']

export function AnalyticsChart({ data, type = 'line', dataKeys = [], xAxisKey = 'date' }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No data available
      </div>
    )
  }

  const formatDate = (value) => {
    if (!value || typeof value !== 'string') return value
    const parts = value.split('-')
    if (parts.length >= 2) return `${parts[1]}/${parts[2] || '01'}`
    return value
  }

  const Chart = type === 'bar' ? BarChart : LineChart

  return (
    <ResponsiveContainer width="100%" height={280}>
      <Chart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey={xAxisKey}
          tickFormatter={xAxisKey === 'date' ? formatDate : undefined}
          tick={{ fontSize: 12 }}
          interval="preserveStartEnd"
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip labelFormatter={(v) => v} />
        {dataKeys.length > 1 && <Legend />}
        {dataKeys.map((key, i) =>
          type === 'bar' ? (
            <Bar
              key={key}
              dataKey={key}
              fill={COLORS[i % COLORS.length]}
              radius={[2, 2, 0, 0]}
            />
          ) : (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={false}
            />
          )
        )}
      </Chart>
    </ResponsiveContainer>
  )
}
