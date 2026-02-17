import { verifyAdmin } from '@/lib/admin'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export const metadata = {
  title: 'Admin Dashboard - FlipChecker',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }) {
  const user = await verifyAdmin()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-lg font-bold">
              FlipChecker
            </Link>
            <Badge variant="destructive">Admin</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">{user.email}</span>
            <Link
              href="/dashboard"
              className="text-blue-600 hover:text-blue-800"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
