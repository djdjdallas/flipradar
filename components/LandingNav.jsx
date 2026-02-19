'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
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
    <nav className="sticky top-4 z-50 mx-4 md:mx-10">
      <div className="bg-[#F8F4E8]/90 backdrop-blur-xl border-2 border-[#09090B] rounded-xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="heading-font text-2xl tracking-tighter hover:text-[#D2E823] transition-colors">
          FLIPCHECKER
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 font-bold text-sm uppercase">
          <a href="#features" className="hover:text-[#D2E823] transition-colors">Features</a>
          <a href="#pricing" className="hover:text-[#D2E823] transition-colors">Pricing</a>
          <Link href="/blog" className="hover:text-[#D2E823] transition-colors">Blog</Link>
          <a href="#faq" className="hover:text-[#D2E823] transition-colors">FAQ</a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="bg-[#09090B] text-white border-2 border-[#09090B] px-6 py-2 rounded-lg font-bold text-sm uppercase hard-shadow-sm btn-brutal"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="hidden sm:block font-bold text-sm uppercase px-2 hover:text-[#D2E823] transition-colors">
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="bg-[#09090B] text-white border-2 border-[#09090B] px-6 py-2 rounded-lg font-bold text-sm uppercase hard-shadow-sm btn-brutal"
              >
                Add to Chrome
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 bg-[#F8F4E8] border-2 border-[#09090B] rounded-xl px-6 py-4">
          <div className="flex flex-col gap-4 font-bold text-sm uppercase">
            <a href="#features" onClick={() => setMenuOpen(false)} className="hover:text-[#D2E823] transition-colors">Features</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)} className="hover:text-[#D2E823] transition-colors">Pricing</a>
            <Link href="/blog" onClick={() => setMenuOpen(false)} className="hover:text-[#D2E823] transition-colors">Blog</Link>
            <a href="#faq" onClick={() => setMenuOpen(false)} className="hover:text-[#D2E823] transition-colors">FAQ</a>
            <hr className="border-[#09090B]/20" />
            {user ? (
              <Link
                href="/dashboard"
                className="bg-[#09090B] text-white border-2 border-[#09090B] px-6 py-2 rounded-lg text-center hard-shadow-sm btn-brutal"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="hover:text-[#D2E823] transition-colors">Login</Link>
                <Link
                  href="/auth/signup"
                  className="bg-[#09090B] text-white border-2 border-[#09090B] px-6 py-2 rounded-lg text-center hard-shadow-sm btn-brutal"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
