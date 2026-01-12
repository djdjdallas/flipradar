import { Card, CardContent } from '@/components/ui/card'

export function StatsCard({ title, value, subtitle, icon: Icon }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
          {Icon && (
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <Icon className="h-6 w-6 text-green-600" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
