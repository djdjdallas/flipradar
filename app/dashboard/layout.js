'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { UsageBar } from '@/components/UsageBar'
import {
  LayoutDashboard,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Loader2
} from 'lucide-react'

const navigation = [
  { name: 'Deals', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Alerts', href: '/dashboard/alerts', icon: Bell },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings }
]

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [usage, setUsage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
    fetchUsage()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login?redirect=/dashboard')
      return
    }

    setUser(user)

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    setProfile(profile)
    setLoading(false)
  }

  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/usage')
      if (response.ok) {
        const data = await response.json()
        setUsage(data)
      }
    } catch (error) {
      console.error('Failed to fetch usage:', error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F4E8]">
        <Loader2 className="h-8 w-8 animate-spin text-[#D2E823]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F4E8]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#09090B] border-r border-white/10 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <Link href="/" className="heading-font text-xl text-[#D2E823]">
              FLIPCHECKER
            </Link>
            <button
              className="lg:hidden text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium truncate text-white/70">
                {profile?.email || user?.email}
              </span>
              <span className="bg-[#D2E823] text-[#09090B] border border-[#09090B] px-2 py-0.5 text-xs font-bold uppercase">
                {profile?.tier || 'free'}
              </span>
            </div>
            {usage && (
              <UsageBar
                used={usage.lookups.used}
                limit={usage.lookups.limit}
                label="Lookups today"
              />
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 transition-colors font-medium ${
                    isActive
                      ? 'bg-[#D2E823] text-[#09090B]'
                      : 'text-white/50 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Sign out */}
          <div className="p-4 border-t border-white/10">
            <button
              className="w-full flex items-center gap-3 px-3 py-2 text-white/50 hover:text-white transition-colors font-medium"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <header className="lg:hidden bg-[#09090B] border-b border-white/10 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6 text-white" />
            </button>
            <span className="heading-font text-[#D2E823]">
              FLIPCHECKER
            </span>
            <div className="w-6" />
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
