'use client'

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'

export function ReferrersTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No referrer data available
      </div>
    )
  }

  const maxCount = Math.max(...data.map((r) => r.count))

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Domain</TableHead>
          <TableHead className="text-right">Pageviews</TableHead>
          <TableHead className="w-1/3" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.domain}>
            <TableCell className="font-medium">{row.domain}</TableCell>
            <TableCell className="text-right">
              {row.count.toLocaleString()}
            </TableCell>
            <TableCell>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${maxCount > 0 ? (row.count / maxCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
