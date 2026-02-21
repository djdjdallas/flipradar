import { LandingNav } from '@/components/LandingNav'
import Link from 'next/link'
import { generatePageMetadata } from '@/lib/seo'

export const metadata = generatePageMetadata({
  title: 'Privacy Policy',
  description: 'FlipChecker Privacy Policy — how we collect, use, and protect your data.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8F4E8]">
      <LandingNav />

      <main className="max-w-4xl mx-auto px-4 pt-28 pb-16">
        <h1 className="heading-font text-4xl md:text-5xl mb-2">Privacy Policy</h1>
        <p className="text-sm text-[#09090B]/50 mb-10">Last updated: February 20, 2026</p>

        <div className="space-y-8 text-[#09090B]/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">1. Introduction</h2>
            <p>
              FlipChecker Inc. (&quot;FlipChecker,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the FlipChecker
              web application and Chrome extension. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">2. Information We Collect</h2>

            <h3 className="text-lg font-bold text-[#09090B] mt-4 mb-2">Account Information</h3>
            <p>When you create an account, we collect your email address and authentication credentials. If you sign in via Google or other OAuth providers, we receive your name and email from the provider.</p>

            <h3 className="text-lg font-bold text-[#09090B] mt-4 mb-2">Usage Data</h3>
            <p>We collect information about how you use FlipChecker, including product lookups, saved deals, price alerts, and feature interactions. This helps us improve the service and enforce usage limits.</p>

            <h3 className="text-lg font-bold text-[#09090B] mt-4 mb-2">Marketplace Data</h3>
            <p>When you use the Chrome extension on Facebook Marketplace, we process publicly visible listing information (titles, prices, images) to provide price comparisons. We do not access your Facebook account or private messages.</p>

            <h3 className="text-lg font-bold text-[#09090B] mt-4 mb-2">Payment Information</h3>
            <p>Payment processing is handled entirely by Stripe. We do not store credit card numbers or bank account details on our servers. We receive only a transaction reference and subscription status from Stripe.</p>

            <h3 className="text-lg font-bold text-[#09090B] mt-4 mb-2">Screenshots (Vision Feature)</h3>
            <p>If you use the vision extraction feature, a screenshot of the current browser tab is captured temporarily, sent to Google Gemini for product identification, and immediately discarded. We do not store screenshots.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, operate, and maintain FlipChecker services</li>
              <li>Process transactions and manage subscriptions</li>
              <li>Send price alerts and service notifications</li>
              <li>Enforce usage limits based on your subscription tier</li>
              <li>Improve and personalize the user experience</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Respond to support requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">4. Third-Party Services</h2>
            <p className="mb-3">We use the following third-party services to operate FlipChecker:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Supabase</strong> &mdash; Authentication and database hosting</li>
              <li><strong>Stripe</strong> &mdash; Payment processing and subscription management</li>
              <li><strong>eBay API</strong> &mdash; Retrieving product pricing and sold listing data</li>
              <li><strong>Google Gemini</strong> &mdash; Vision-based product identification from screenshots</li>
              <li><strong>Anthropic (Claude)</strong> &mdash; AI-powered text extraction</li>
              <li><strong>Vercel</strong> &mdash; Web application hosting</li>
              <li><strong>PostHog</strong> &mdash; Product analytics</li>
            </ul>
            <p className="mt-3">Each third-party service has its own privacy policy governing the data they process on our behalf.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">5. Data Storage and Security</h2>
            <p>
              Your data is stored securely on Supabase infrastructure with encryption at rest and in transit.
              We implement industry-standard security measures including HTTPS, secure authentication tokens,
              and row-level security policies. However, no method of electronic transmission or storage is
              100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">6. Data Retention</h2>
            <p>
              We retain your account data for as long as your account is active. Saved deals and lookup
              history are retained according to your subscription tier. If you delete your account, we will
              remove your personal data within 30 days, except where we are required to retain it by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">7. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Export your saved deals and data</li>
              <li>Opt out of non-essential communications</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:support@flipchecker.io" className="text-[#09090B] font-bold underline hover:text-[#D2E823]">support@flipchecker.io</a>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">8. Cookies and Tracking</h2>
            <p>
              We use essential cookies for authentication and session management. We use PostHog for
              product analytics to understand how users interact with FlipChecker. You can opt out of
              analytics tracking through your browser settings or by using a tracking blocker.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">9. Children&apos;s Privacy</h2>
            <p>
              FlipChecker is not intended for use by anyone under the age of 13. We do not knowingly
              collect personal information from children under 13. If you believe a child has provided
              us with personal data, please contact us so we can remove it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material
              changes by posting the updated policy on this page and updating the &quot;Last updated&quot; date.
              Your continued use of FlipChecker after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">11. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our data practices, contact us at:{' '}
              <a href="mailto:support@flipchecker.io" className="text-[#09090B] font-bold underline hover:text-[#D2E823]">support@flipchecker.io</a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t-2 border-[#09090B]/10">
          <Link href="/terms" className="text-[#09090B] font-bold underline hover:text-[#D2E823]">
            View Terms of Service &rarr;
          </Link>
        </div>
      </main>
    </div>
  )
}
