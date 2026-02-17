'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export function LandingNav() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            <span className="text-green-500">Flip</span>Checker
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </a>
            <Link href="/blog" className="text-gray-600 hover:text-gray-900">
              Blog
            </Link>
            <a href="#faq" className="text-gray-600 hover:text-gray-900">
              FAQ
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setMenuOpen(false)}
              >
                Pricing
              </a>
              <Link
                href="/blog"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setMenuOpen(false)}
              >
                Blog
              </Link>
              <a
                href="#faq"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setMenuOpen(false)}
              >
                FAQ
              </a>
              <hr />
              {user ? (
                <Link href="/dashboard">
                  <Button className="w-full">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
