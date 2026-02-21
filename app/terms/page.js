import { LandingNav } from '@/components/LandingNav'
import Link from 'next/link'
import { generatePageMetadata } from '@/lib/seo'

export const metadata = generatePageMetadata({
  title: 'Terms of Service',
  description: 'FlipChecker Terms of Service — the rules and guidelines for using our platform.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8F4E8]">
      <LandingNav />

      <main className="max-w-4xl mx-auto px-4 pt-28 pb-16">
        <h1 className="heading-font text-4xl md:text-5xl mb-2">Terms of Service</h1>
        <p className="text-sm text-[#09090B]/50 mb-10">Last updated: February 20, 2026</p>

        <div className="space-y-8 text-[#09090B]/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using FlipChecker (&quot;the Service&quot;), operated by FlipChecker Inc.
              (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of Service. If you
              do not agree to these terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">2. Description of Service</h2>
            <p>
              FlipChecker provides a web application and Chrome extension that helps users compare
              prices between Facebook Marketplace and eBay. The Service includes product price lookups,
              saved deals, price alerts, and related features based on your subscription tier.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">3. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must provide accurate and complete information when creating an account.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You must be at least 13 years old to use FlipChecker.</li>
              <li>One account per person. Sharing accounts is not permitted.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">4. Subscription and Payments</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>FlipChecker offers free and paid subscription tiers with different usage limits and features.</li>
              <li>Paid subscriptions are billed monthly or annually through Stripe.</li>
              <li>You may cancel your subscription at any time. Access continues until the end of the current billing period.</li>
              <li>We reserve the right to change pricing with 30 days&apos; notice. Existing subscriptions remain at their current price until renewal.</li>
              <li>Refunds are handled on a case-by-case basis. Contact support for refund requests.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">5. Acceptable Use</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service for any illegal purpose or in violation of any laws</li>
              <li>Attempt to circumvent usage limits, rate limits, or access controls</li>
              <li>Use automated scripts, bots, or scrapers to access the Service beyond the provided extension and API</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
              <li>Resell, redistribute, or sublicense access to FlipChecker</li>
              <li>Interfere with or disrupt the Service or its infrastructure</li>
              <li>Use the Service to harass, abuse, or harm others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">6. Intellectual Property</h2>
            <p>
              The FlipChecker name, logo, software, and all associated content are the intellectual
              property of FlipChecker Inc. You are granted a limited, non-exclusive, non-transferable
              license to use the Service for personal or business use in accordance with your subscription.
              You retain ownership of any data you create within the Service (saved deals, notes, etc.).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">7. Third-Party Data</h2>
            <p>
              FlipChecker displays pricing data sourced from eBay and processes listing data from
              Facebook Marketplace. This data is provided &quot;as is&quot; and may not always be accurate
              or up-to-date. We are not affiliated with eBay or Facebook/Meta. You are responsible
              for verifying pricing information before making purchasing or selling decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">8. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT
              WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">9. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, FLIPCHECKER INC. SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
              PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, ARISING FROM YOUR USE
              OF THE SERVICE. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE
              12 MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">10. Termination</h2>
            <p>
              We may suspend or terminate your account at any time if you violate these Terms or
              engage in activity that harms the Service or other users. You may delete your account
              at any time by contacting support. Upon termination, your right to use the Service
              ceases immediately, and we may delete your data in accordance with our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">11. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify you of material changes
              by posting the updated terms on this page and updating the &quot;Last updated&quot; date.
              Continued use of the Service after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">12. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of Delaware, United States, without
              regard to conflict of law principles. Any disputes arising under these Terms shall be
              resolved in the courts located in Delaware.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#09090B] mb-3">13. Contact Us</h2>
            <p>
              If you have questions about these Terms, contact us at:{' '}
              <a href="mailto:support@flipchecker.io" className="text-[#09090B] font-bold underline hover:text-[#D2E823]">support@flipchecker.io</a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t-2 border-[#09090B]/10">
          <Link href="/privacy" className="text-[#09090B] font-bold underline hover:text-[#D2E823]">
            View Privacy Policy &rarr;
          </Link>
        </div>
      </main>
    </div>
  )
}
