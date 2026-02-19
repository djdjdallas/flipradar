import { LandingNav } from '@/components/LandingNav'
import Link from 'next/link'

export function ContentLayout({ children, breadcrumbs = [] }) {
  return (
    <div className="min-h-screen bg-[#F8F4E8]">
      <LandingNav />

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="pt-20 px-4" aria-label="Breadcrumb">
          <div className="max-w-4xl mx-auto">
            <ol className="flex items-center gap-2 text-sm text-[#09090B]/50">
              <li>
                <Link href="/" className="hover:text-[#09090B]">Home</Link>
              </li>
              {breadcrumbs.map((crumb, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span>/</span>
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-[#09090B]">{crumb.label}</Link>
                  ) : (
                    <span className="text-[#09090B]">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </nav>
      )}

      {/* Content */}
      <main className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#09090B] border-t-2 border-[#09090B] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="heading-font text-xl text-[#D2E823] mb-4">
                FLIPCHECKER
              </div>
              <p className="text-sm text-[#F8F4E8]/60">
                Find profitable flips on Facebook Marketplace with real eBay pricing data.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-[#F8F4E8] mb-3">Product</h4>
              <div className="space-y-2 text-sm text-[#F8F4E8]/60">
                <Link href="/pricing" className="block hover:text-[#D2E823]">Pricing</Link>
                <Link href="/auth/signup" className="block hover:text-[#D2E823]">Get Started</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-[#F8F4E8] mb-3">Resources</h4>
              <div className="space-y-2 text-sm text-[#F8F4E8]/60">
                <Link href="/blog" className="block hover:text-[#D2E823]">Blog</Link>
                <Link href="/guide/how-to-use-flipchecker" className="block hover:text-[#D2E823]">Guides</Link>
                <Link href="/categories/electronics-flipping-facebook-marketplace" className="block hover:text-[#D2E823]">Categories</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-[#F8F4E8] mb-3">Company</h4>
              <div className="space-y-2 text-sm text-[#F8F4E8]/60">
                <a href="mailto:support@flipchecker.io" className="block hover:text-[#D2E823]">Support</a>
                <a href="#" className="block hover:text-[#D2E823]">Privacy</a>
                <a href="#" className="block hover:text-[#D2E823]">Terms</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#F8F4E8]/10 text-center text-[#F8F4E8]/40 text-sm">
            &copy; {new Date().getFullYear()} FlipChecker. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
