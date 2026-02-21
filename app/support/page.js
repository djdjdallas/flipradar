import { LandingNav } from '@/components/LandingNav'
import Link from 'next/link'
import { generatePageMetadata } from '@/lib/seo'
import { Mail, MessageCircle, BookOpen, Clock } from 'lucide-react'

export const metadata = generatePageMetadata({
  title: 'Support',
  description: 'Get help with FlipChecker — contact support, browse guides, and find answers to common questions.',
  path: '/support',
})

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#F8F4E8]">
      <LandingNav />

      <main className="max-w-4xl mx-auto px-4 pt-28 pb-16">
        <div className="text-center mb-12">
          <h1 className="heading-font text-4xl md:text-5xl mb-4">Support</h1>
          <p className="text-lg text-[#09090B]/60 max-w-2xl mx-auto">
            Need help with FlipChecker? We&apos;re here for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <a
            href="mailto:support@flipchecker.io"
            className="bg-white border-2 border-[#09090B] p-6 hard-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <Mail className="h-8 w-8 text-[#D2E823] mb-4" />
            <h2 className="text-xl font-bold mb-2">Email Support</h2>
            <p className="text-[#09090B]/60 text-sm mb-3">
              Send us an email and we&apos;ll get back to you as soon as possible.
            </p>
            <span className="text-[#09090B] font-bold text-sm">support@flipchecker.io &rarr;</span>
          </a>

          <Link
            href="/guide/how-to-use-flipchecker"
            className="bg-white border-2 border-[#09090B] p-6 hard-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <BookOpen className="h-8 w-8 text-[#D2E823] mb-4" />
            <h2 className="text-xl font-bold mb-2">Getting Started Guide</h2>
            <p className="text-[#09090B]/60 text-sm mb-3">
              Step-by-step walkthrough of installing and using FlipChecker.
            </p>
            <span className="text-[#09090B] font-bold text-sm">Read the guide &rarr;</span>
          </Link>

          <Link
            href="/blog"
            className="bg-white border-2 border-[#09090B] p-6 hard-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <MessageCircle className="h-8 w-8 text-[#D2E823] mb-4" />
            <h2 className="text-xl font-bold mb-2">Blog &amp; Tips</h2>
            <p className="text-[#09090B]/60 text-sm mb-3">
              Flipping strategies, marketplace tips, and FlipChecker updates.
            </p>
            <span className="text-[#09090B] font-bold text-sm">Browse articles &rarr;</span>
          </Link>

          <Link
            href="/pricing"
            className="bg-white border-2 border-[#09090B] p-6 hard-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <Clock className="h-8 w-8 text-[#D2E823] mb-4" />
            <h2 className="text-xl font-bold mb-2">Plans &amp; Billing</h2>
            <p className="text-[#09090B]/60 text-sm mb-3">
              View plans, manage your subscription, or upgrade your account.
            </p>
            <span className="text-[#09090B] font-bold text-sm">View pricing &rarr;</span>
          </Link>
        </div>

        <div className="bg-white border-2 border-[#09090B] p-8 hard-shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <details className="border-2 border-[#09090B]/10 p-4 group">
              <summary className="font-bold cursor-pointer flex items-center justify-between">
                How do I install the Chrome extension?
                <span className="text-[#D2E823] text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-[#09090B]/70 mt-3">
                Visit the Chrome Web Store and search for &quot;FlipChecker,&quot; or follow the link from your
                dashboard after signing in. Click &quot;Add to Chrome&quot; and the extension will be ready to use
                on Facebook Marketplace.
              </p>
            </details>

            <details className="border-2 border-[#09090B]/10 p-4 group">
              <summary className="font-bold cursor-pointer flex items-center justify-between">
                Why isn&apos;t the extension showing prices?
                <span className="text-[#D2E823] text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-[#09090B]/70 mt-3">
                Make sure you&apos;re signed in to FlipChecker in the extension popup. If the issue persists,
                try refreshing the Facebook Marketplace page, or check that you haven&apos;t exceeded your
                daily lookup limit.
              </p>
            </details>

            <details className="border-2 border-[#09090B]/10 p-4 group">
              <summary className="font-bold cursor-pointer flex items-center justify-between">
                How do I cancel my subscription?
                <span className="text-[#D2E823] text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-[#09090B]/70 mt-3">
                Go to your dashboard settings and click &quot;Manage Subscription.&quot; You can cancel anytime
                and keep access until the end of your billing period. You can also email us at
                support@flipchecker.io for assistance.
              </p>
            </details>

            <details className="border-2 border-[#09090B]/10 p-4 group">
              <summary className="font-bold cursor-pointer flex items-center justify-between">
                How do I delete my account?
                <span className="text-[#D2E823] text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-[#09090B]/70 mt-3">
                Email us at support@flipchecker.io with the subject &quot;Account Deletion Request&quot; and
                we&apos;ll process it within 30 days. All your personal data will be removed in accordance
                with our Privacy Policy.
              </p>
            </details>
          </div>
        </div>
      </main>
    </div>
  )
}
