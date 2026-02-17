import { LandingNav } from '@/components/LandingNav'
import Link from 'next/link'

export function ContentLayout({ children, breadcrumbs = [] }) {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="pt-20 px-4" aria-label="Breadcrumb">
          <div className="max-w-4xl mx-auto">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-gray-900">Home</Link>
              </li>
              {breadcrumbs.map((crumb, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span>/</span>
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-gray-900">{crumb.label}</Link>
                  ) : (
                    <span className="text-gray-900">{crumb.label}</span>
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
      <footer className="py-12 border-t px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold mb-4">
                <span className="text-green-500">Flip</span>Checker
              </div>
              <p className="text-sm text-gray-600">
                Find profitable flips on Facebook Marketplace with real eBay pricing data.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <Link href="/pricing" className="block hover:text-gray-900">Pricing</Link>
                <Link href="/auth/signup" className="block hover:text-gray-900">Get Started</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <Link href="/blog" className="block hover:text-gray-900">Blog</Link>
                <Link href="/guide/how-to-use-flipchecker" className="block hover:text-gray-900">Guides</Link>
                <Link href="/categories/electronics-flipping-facebook-marketplace" className="block hover:text-gray-900">Categories</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <a href="mailto:support@flipchecker.io" className="block hover:text-gray-900">Support</a>
                <a href="#" className="block hover:text-gray-900">Privacy</a>
                <a href="#" className="block hover:text-gray-900">Terms</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} FlipChecker. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
