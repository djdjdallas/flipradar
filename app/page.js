import { LandingNav } from '@/components/LandingNav'
import { OverlayScreenshot } from '@/components/screenshots/OverlayScreenshot'
import { DashboardScreenshot } from '@/components/screenshots/DashboardScreenshot'
import { Check, Star, Plus, Zap, Search, Package } from 'lucide-react'
import Link from 'next/link'
import {
  generatePageMetadata,
  softwareApplicationSchema,
  organizationSchema,
  faqSchema,
  JsonLd
} from '@/lib/seo'

export const metadata = generatePageMetadata({
  title: null,
  description: 'Stop wasting hours researching prices. FlipChecker shows you what FB Marketplace items are worth on eBay, instantly.',
  path: '/',
  keywords: ['facebook marketplace', 'ebay', 'flipping', 'reselling', 'chrome extension', 'price comparison', 'arbitrage'],
})

const features = [
  {
    title: 'Real-Time Price Detection',
    description: 'Automatically identifies the item and pulls eBay sold comps instantly as you browse.',
  },
  {
    title: 'One-Click eBay Search',
    description: 'Jump straight to filtered eBay sold listings in one click. No more typing search terms.',
  },
  {
    title: 'Instant Profit Math',
    description: 'See your potential profit after shipping and seller fees before you ever place an offer.',
  },
  {
    title: 'Price Alerts',
    description: 'Get notified when a watched item hits your target price threshold so you never miss a deal.',
  },
]

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    features: [
      '10 price lookups/day',
      '25 saved deals',
      '1 price alert',
    ],
    cta: 'Get Started',
    href: '/auth/signup',
  },
  {
    name: 'Flipper',
    price: '$19',
    period: '/month',
    popular: true,
    features: [
      '750 price lookups / day',
      '1,000 saved deals',
      '30 price alerts',
    ],
    cta: 'Start Free Trial',
    href: '/auth/signup',
  },
  {
    name: 'Pro',
    price: '$39',
    period: '/month',
    features: [
      'Unlimited lookups',
      'API access',
    ],
    cta: 'Start Free Trial',
    href: '/auth/signup',
  },
]

const faqs = [
  {
    q: 'How does FlipChecker get price data?',
    a: 'We use the eBay API to fetch real-time sold listing data. Prices are based on actual completed sales — not estimates or guesses.',
  },
  {
    q: 'Does this work on any Marketplace listing?',
    a: 'Yes. The extension works on any FB Marketplace item page. Browse normally, and click Price Check on any listing you want to check.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. Cancel directly from your dashboard. You keep access until the end of your billing period with no questions asked.',
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. We only store what you explicitly save. We never track your browsing or sell your data to third parties.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8F4E8] text-[#09090B] relative flex flex-col">
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd data={organizationSchema()} />
      <JsonLd data={faqSchema(faqs.map(f => ({ question: f.q, answer: f.a })))} />

      <div className="noise-overlay" />

      {/* ── Nav ── */}
      <LandingNav />

      {/* ── Hero ── */}
      <section className="container mx-auto px-4 md:px-10 py-16 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <div className="inline-block bg-[#D2E823] border-2 border-[#09090B] px-4 py-1 font-bold text-xs uppercase mb-6 transform -rotate-1">
            Live Price Tracking Enabled
          </div>
          <h1 className="heading-font text-[4.5rem] md:text-[8rem] leading-[0.85] glitch-hover cursor-default mb-8">
            FIND.<br />CHECK.<br />FLIP.
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-xl mb-12">
            The ultimate workflow for FB Marketplace hunters. Real-time eBay comps, instant profit math, and high-speed deal alerts.
          </p>
          <div className="flex flex-col lg:flex-row gap-4">
            <Link
              href="/auth/signup"
              className="bg-[#09090B] text-[#D2E823] px-10 py-5 text-xl heading-font border-2 border-[#09090B] rounded-lg hard-shadow-lg btn-brutal inline-block text-center"
            >
              ADD TO CHROME — IT&apos;S FREE
            </Link>
            <a
              href="#features"
              className="bg-transparent text-[#09090B] px-10 py-5 text-xl heading-font border-2 border-[#09090B] rounded-lg hard-shadow-sm btn-brutal inline-block text-center"
            >
              HOW IT WORKS
            </a>
          </div>
        </div>

        {/* Floating extension popup mockup */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
          <div className="w-[300px] bg-[#09090B] border-2 border-[#09090B] hard-shadow-lg rounded-xl text-white floating-popup z-20">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2 font-bold text-xs text-[#F8F4E8]">
                <div className="w-5 h-5 bg-[#D2E823] flex items-center justify-center">
                  <Zap className="w-3 h-3 text-[#09090B]" />
                </div>
                <span className="tracking-tight uppercase">FlipChecker</span>
              </div>
              <div className="bg-[#D2E823] border border-[#09090B] px-2 py-0.5 rounded-sm">
                <span className="text-[10px] text-[#09090B] font-black">&bull; LIVE</span>
              </div>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <p className="text-[8px] text-[#D2E823] font-black uppercase tracking-[0.15em] mb-1">Item Detected</p>
                <p className="font-bold text-[16px] leading-tight text-white">Nintendo Switch<br />Pro Controller</p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">EBAY SOLD AVG</p>
                  <span className="text-[8px] text-[#D2E823] font-bold uppercase tracking-widest">&uarr; HIGH DEMAND</span>
                </div>
                <span className="text-[28px] heading-font block text-white">$127.00</span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                <div>
                  <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-1">LISTED AT</p>
                  <p className="text-[18px] font-bold text-white">$45.00</p>
                </div>
                <div className="border-l border-white/10 pl-4">
                  <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-1">EST. PROFIT</p>
                  <p className="text-[18px] font-bold text-[#D2E823]">+$82.00</p>
                </div>
              </div>

              <button className="w-full bg-[#D2E823] text-[#09090B] py-4 heading-font text-xs border-2 border-[#09090B] hard-shadow-sm btn-brutal">
                VIEW EBAY SOLD LISTINGS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee Banner ── */}
      <div className="bg-[#09090B] py-6 border-y-2 border-[#09090B] overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <div className="flex items-center gap-10 text-[#D2E823] heading-font text-3xl px-10">
            <span>SCAN FACEBOOK</span>
            <Star className="w-6 h-6 shrink-0" />
            <span>EBAY PRICE CHECK</span>
            <Star className="w-6 h-6 shrink-0" />
            <span>MAXIMIZE PROFIT</span>
            <Star className="w-6 h-6 shrink-0" />
            <span>SCAN FACEBOOK</span>
            <Star className="w-6 h-6 shrink-0" />
            <span>EBAY PRICE CHECK</span>
            <Star className="w-6 h-6 shrink-0" />
            <span>MAXIMIZE PROFIT</span>
            <Star className="w-6 h-6 shrink-0" />
          </div>
        </div>
      </div>

      {/* ── Features Section ── */}
      <section id="features" className="bg-[#09090B] py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-10">
          <div className="text-center mb-20">
            <h2 className="heading-font text-white text-5xl md:text-7xl mb-4">INTELLIGENCE BUILT INTO YOUR BROWSER</h2>
            <p className="text-white/60 text-xl max-w-2xl mx-auto">
              FlipChecker works silently in the background. Browse normally — we do the heavy lifting.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Browser mockup — OverlayScreenshot */}
            <div className="order-2 lg:order-1">
              <OverlayScreenshot />
            </div>

            {/* Feature list */}
            <div className="order-1 lg:order-2 grid grid-cols-1 gap-8">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-[#D2E823] border-2 border-[#09090B] flex items-center justify-center shrink-0">
                    <Check className="w-6 h-6 text-[#09090B]" />
                  </div>
                  <div>
                    <h3 className="heading-font text-white text-xl mb-2">{feature.title}</h3>
                    <p className="text-white/50">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Dashboard Section ── */}
      <section className="bg-[#F8F4E8] py-24 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="heading-font text-4xl md:text-6xl mb-4">MANAGE YOUR FLIPPING BUSINESS</h2>
            <p className="text-xl opacity-60 max-w-2xl mx-auto">
              Track every deal from discovery to sale. See your potential profit, realized gains, and win rate at a glance.
            </p>
          </div>
          <DashboardScreenshot />
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <section id="pricing" className="bg-[#F8F4E8] py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-10">
          <div className="text-center mb-20">
            <h2 className="heading-font text-5xl md:text-7xl mb-4">SIMPLE, TRANSPARENT PRICING</h2>
            <p className="text-xl opacity-60">Start free. Upgrade when you need more power.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={
                  plan.popular
                    ? 'bg-[#09090B] text-white border-2 border-[#09090B] p-12 hard-shadow-lg flex flex-col md:-my-6 z-10'
                    : 'bg-white border-2 border-[#09090B] p-10 hard-shadow flex flex-col h-fit'
                }
              >
                {plan.popular && (
                  <div className="bg-[#D2E823] text-[#09090B] text-[10px] font-black px-4 py-1 self-start rounded-full uppercase mb-6">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="heading-font text-2xl mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-2">
                  {plan.price}
                  <span className="text-sm font-normal opacity-50">{plan.period}</span>
                </div>
                {plan.popular && (
                  <p className="text-[10px] opacity-50 uppercase font-bold mb-8">billed monthly</p>
                )}
                {!plan.popular && <div className="mb-8" />}

                <ul className={`space-y-4 mb-10 flex-1 ${plan.popular ? 'space-y-5 mb-12' : ''}`}>
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm font-bold">
                      <Check className={`w-4 h-4 shrink-0 ${plan.popular ? 'text-[#D2E823]' : 'text-[#09090B] opacity-70'}`} />
                      <span className={plan.popular ? '' : 'opacity-70'}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={
                    plan.popular
                      ? 'w-full text-center bg-[#D2E823] text-[#09090B] py-5 font-bold uppercase hard-shadow-sm btn-brutal block'
                      : 'w-full text-center border-2 border-[#09090B] py-4 font-bold uppercase btn-brutal block'
                  }
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center opacity-50 mt-8">
            Annual plans available — save 2 months.{' '}
            <Link href="/pricing" className="text-[#09090B] font-bold underline underline-offset-2 hover:text-[#D2E823]">
              See full pricing
            </Link>
          </p>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section id="faq" className="bg-[#F8F4E8] py-24 md:py-32 border-t-2 border-[#09090B]">
        <div className="container mx-auto px-4 md:px-10 max-w-4xl">
          <h2 className="heading-font text-5xl md:text-7xl mb-16 text-center">FREQUENTLY ASKED QUESTIONS</h2>

          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <details key={i} className="group">
                <summary className="list-none cursor-pointer p-5 flex justify-between items-center bg-white border-b-2 border-[#09090B] group-open:border-l-4 group-open:border-l-[#D2E823] group-open:pl-4 transition-all">
                  <span className="text-lg md:text-xl font-bold uppercase text-[#09090B] tracking-tight pr-4">{faq.q}</span>
                  <Plus className="w-6 h-6 shrink-0 transition-transform group-open:rotate-45" />
                </summary>
                <div className="p-8 bg-white/50 border-x-2 border-b-2 border-[#09090B] text-base opacity-70">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="container mx-auto px-4 md:px-10 py-24">
        <div className="bg-[#D2E823] border-4 border-[#09090B] p-12 md:p-20 text-center relative overflow-hidden hard-shadow-lg">
          <div className="relative z-10">
            <h2 className="heading-font text-5xl md:text-8xl mb-8 glitch-hover inline-block">
              JOIN THE<br />HUNTERS.
            </h2>
            <p className="text-xl md:text-2xl font-bold mb-12 max-w-2xl mx-auto">
              Dominating Marketplace requires speed. Add FlipChecker to your browser today.
            </p>
            <Link
              href="/auth/signup"
              className="bg-[#09090B] text-[#D2E823] px-12 py-6 text-2xl heading-font border-2 border-[#09090B] rounded-lg hard-shadow-sm inline-block btn-brutal"
            >
              Add to Chrome — It&apos;s Free
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#09090B] text-white pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-6">
            <h2 className="heading-font text-4xl mb-6 text-[#D2E823]">FLIPCHECKER</h2>
            <p className="text-lg opacity-60 max-w-sm mb-8">
              The unfair advantage for the next generation of secondary market entrepreneurs.
            </p>
          </div>
          <div className="md:col-span-3">
            <h4 className="heading-font text-sm uppercase mb-6 tracking-widest text-[#D2E823]">Navigation</h4>
            <ul className="space-y-4 font-bold">
              <li><Link href="/" className="hover:text-[#D2E823] transition-colors">Home</Link></li>
              <li><a href="#features" className="hover:text-[#D2E823] transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-[#D2E823] transition-colors">Pricing</a></li>
              <li><Link href="/blog" className="hover:text-[#D2E823] transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h4 className="heading-font text-sm uppercase mb-6 tracking-widest text-[#D2E823]">Resources</h4>
            <ul className="space-y-4 font-bold">
              <li><Link href="/guide/how-to-use-flipchecker" className="hover:text-[#D2E823] transition-colors">Guides</Link></li>
              <li><Link href="/categories/electronics-flipping-facebook-marketplace" className="hover:text-[#D2E823] transition-colors">Categories</Link></li>
              <li><Link href="/support" className="hover:text-[#D2E823] transition-colors">Support</Link></li>
              <li><Link href="/privacy" className="hover:text-[#D2E823] transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-[#D2E823] transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-10 pt-12 border-t border-white/10">
          <p className="text-xs opacity-40 uppercase tracking-widest font-bold">
            &copy; {new Date().getFullYear()} FLIPCHECKER INC. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  )
}
