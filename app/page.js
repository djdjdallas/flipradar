import { LandingNav } from '@/components/LandingNav'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Check,
  Zap,
  DollarSign,
  Bell,
  Shield,
  TrendingUp,
  Clock,
  Search,
  ArrowRight,
  Chrome
} from 'lucide-react'
import Link from 'next/link'
import { OverlayScreenshot } from '@/components/screenshots/OverlayScreenshot'
import { DashboardScreenshot } from '@/components/screenshots/DashboardScreenshot'

export const metadata = {
  title: 'FlipRadar - Find Profitable Flips in Seconds',
  description: 'Stop wasting hours researching prices. FlipRadar shows you what FB Marketplace items are worth on eBay, instantly.',
  openGraph: {
    title: 'FlipRadar - Find Profitable Flips in Seconds',
    description: 'Stop wasting hours researching prices. FlipRadar shows you what FB Marketplace items are worth on eBay, instantly.',
    type: 'website'
  }
}

const features = [
  {
    icon: Zap,
    title: 'Instant Price Estimates',
    description: 'See real eBay market prices directly on FB Marketplace listings. No more switching between tabs.'
  },
  {
    icon: DollarSign,
    title: 'Profit Calculator',
    description: 'Automatically calculates your potential profit after fees. Know immediately if a deal is worth pursuing.'
  },
  {
    icon: Search,
    title: 'One-Click eBay Search',
    description: 'Jump directly to eBay sold listings with one click. Verify prices before you buy.'
  },
  {
    icon: Bell,
    title: 'Price Alerts',
    description: 'Get notified when items you\'re watching drop to your target price. Never miss a deal.'
  },
  {
    icon: Shield,
    title: 'Scam Detection',
    description: 'Warnings for suspiciously low prices help you avoid scams and fake listings.'
  },
  {
    icon: TrendingUp,
    title: 'Track Your Flips',
    description: 'Save deals, track purchases, and monitor your actual profit over time.'
  }
]

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      '10 price lookups/day',
      '25 saved deals',
      '1 price alert',
      'Basic estimates',
      'eBay search links'
    ],
    cta: 'Get Started',
    href: '/auth/signup'
  },
  {
    name: 'Flipper',
    price: '$19',
    period: '/month',
    popular: true,
    features: [
      '100 price lookups/day',
      '500 saved deals',
      '10 price alerts',
      'Real eBay active listings',
      'Email notifications',
      'Price history'
    ],
    cta: 'Start Free Trial',
    href: '/auth/signup'
  },
  {
    name: 'Pro',
    price: '$39',
    period: '/month',
    features: [
      '500 price lookups/day',
      'Unlimited saved deals',
      '50 price alerts',
      'Real eBay SOLD data',
      'Advanced analytics',
      'Priority support',
      'API access'
    ],
    cta: 'Start Free Trial',
    href: '/auth/signup'
  }
]

const faqs = [
  {
    q: 'How does FlipRadar get price data?',
    a: 'We use the official eBay API to fetch real listing data. Free users get estimates based on active listings. Pro users get actual sold data showing what items really sold for.'
  },
  {
    q: 'Does this work with any Facebook Marketplace listing?',
    a: 'Yes! The extension works on any FB Marketplace item page. Just browse normally and the price overlay will appear automatically.'
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. Cancel with one click from your dashboard. You\'ll keep access until the end of your billing period.'
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. We only store what you explicitly save. We don\'t track your browsing or sell your data. All connections are encrypted.'
  }
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
            Chrome Extension for FB Marketplace Flippers
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Find Profitable Flips
            <span className="text-green-500"> in Seconds</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stop wasting hours researching prices. FlipRadar shows you what Facebook Marketplace items are worth on eBay, instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="gap-2 text-lg px-8">
                <Chrome className="h-5 w-5" />
                Add to Chrome - It&apos;s Free
              </Button>
            </Link>
            <a href="#pricing">
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8">
                View Pricing
              </Button>
            </a>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Join 2,500+ flippers using FlipRadar
          </p>
        </div>

        {/* Hero Screenshot - Extension Overlay */}
        <div className="max-w-6xl mx-auto mt-16 px-4">
          <OverlayScreenshot />
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-4">
                The Old Way
              </h3>
              <h2 className="text-3xl font-bold mb-6">Hours of Manual Research</h2>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-red-500 shrink-0 mt-1" />
                  <span>Opening eBay in a new tab for every listing</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-red-500 shrink-0 mt-1" />
                  <span>Manually searching and comparing prices</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-red-500 shrink-0 mt-1" />
                  <span>Calculating profit after fees in your head</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-red-500 shrink-0 mt-1" />
                  <span>Missing deals while you research</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-green-500 uppercase tracking-wide mb-4">
                The FlipRadar Way
              </h3>
              <h2 className="text-3xl font-bold mb-6">Instant Profit Analysis</h2>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                  <span>Real eBay prices on every listing automatically</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                  <span>Profit calculated after all fees</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                  <span>One-click to verify on eBay</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                  <span>Alerts when deals hit your target price</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Screenshot Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Manage Your Flipping Business</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track every deal from discovery to sale. See your potential profit, realized gains, and win rate at a glance.
            </p>
          </div>
          <DashboardScreenshot />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Flip Smarter</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              FlipRadar gives you the tools to find, analyze, and track profitable deals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">
              Start free. Upgrade when you need more power.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.popular ? 'border-green-500 border-2 shadow-xl scale-105' : 'border shadow-lg'}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="pt-8 pb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.href}>
                    <Button
                      className="w-full"
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-500 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Find Your Next Flip?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of flippers who are saving hours every week with FlipRadar.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="gap-2 text-lg px-8">
              <Chrome className="h-5 w-5" />
              Get FlipRadar Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xl font-bold">
              <span className="text-green-500">Flip</span>Radar
            </div>
            <div className="flex gap-8 text-gray-600">
              <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
              <a href="#" className="hover:text-gray-900">Privacy</a>
              <a href="#" className="hover:text-gray-900">Terms</a>
              <a href="mailto:support@flipradar.com" className="hover:text-gray-900">Support</a>
            </div>
            <div className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} FlipRadar. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
