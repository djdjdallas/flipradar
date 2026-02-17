export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border p-6 space-y-3">
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-8 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border p-6 space-y-4">
            <div className="h-5 w-32 bg-gray-200 rounded" />
            <div className="h-64 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
