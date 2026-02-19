'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import posthog from 'posthog-js'
import { Check, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { LandingNav } from '@/components/LandingNav'

const plans = [
  {
    name: 'Free',
    monthlyPrice: 0,
    annualPerMonth: 0,
    annualTotal: 0,
    period: 'forever',
    description: 'Get started with basic price estimates',
    features: [
      '10 price lookups per day',
      '25 saved deals',
      '1 price alert',
      'Basic price estimates',
      'eBay search links'
    ],
    upsellNote: 'Most flippers upgrade within a week — start free and see for yourself.',
    tier: 'free',
    monthlyPriceId: null,
    annualPriceId: null
  },
  {
    name: 'Flipper',
    monthlyPrice: 19,
    annualPerMonth: 15.83,
    annualTotal: 190,
    period: '/month',
    description: 'Pays for itself with 1–2 good flips a month',
    features: [
      '150 price lookups per day',
      '1,000 saved deals',
      '20 price alerts',
      'Real eBay active listings data',
      'Price history charts',
      'Email alerts'
    ],
    tier: 'flipper',
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_FLIPPER,
    annualPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_FLIPPER_ANNUAL,
    popular: true
  },
  {
    name: 'Pro',
    monthlyPrice: 39,
    annualPerMonth: 32.50,
    annualTotal: 390,
    period: '/month',
    description: 'For full-time flippers. One avoided bad buy covers 3 months.',
    features: [
      'Unlimited lookups (fair use)',
      'Unlimited saved deals',
      '100 price alerts',
      'Real eBay SOLD data',
      'Advanced analytics',
      'Priority support',
      'API access'
    ],
    tier: 'pro',
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
    annualPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL
  }
]

export default function PricingPage() {
  const [user, setUser] = useState(null)
  const [currentTier, setCurrentTier] = useState(null)
  const [loading, setLoading] = useState(null)
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('tier')
        .eq('id', user.id)
        .single()

      setCurrentTier(profile?.tier || 'free')
    }
  }

  const handleSubscribe = async (priceId, tier) => {
    if (!user) {
      window.location.href = `/auth/login?redirect=/pricing`
      return
    }

    if (tier === 'free' || tier === currentTier) {
      return
    }

    setLoading(tier)

    // Track checkout started
    posthog.capture('checkout_started', {
      plan_name: tier,
      current_tier: currentTier,
      price_id: priceId,
      billing_period: billingPeriod
    })

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId })
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('Checkout error:', data.error)
        alert('Failed to start checkout. Please try again.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      posthog.captureException(error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F4E8]">
      <LandingNav />

      {/* Pricing Section */}
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="heading-font text-4xl md:text-5xl mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-[#09090B]/60 max-w-2xl mx-auto">
            Choose the plan that fits your flipping business. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Billing Period Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center bg-[#09090B] border-2 border-[#09090B] p-1">
            <button
              className={`px-5 py-2 text-sm font-bold uppercase transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-[#D2E823] text-[#09090B]'
                  : 'text-[#F8F4E8]/60 hover:text-[#F8F4E8]'
              }`}
              onClick={() => setBillingPeriod('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-5 py-2 text-sm font-bold uppercase transition-all flex items-center gap-2 ${
                billingPeriod === 'annual'
                  ? 'bg-[#D2E823] text-[#09090B]'
                  : 'text-[#F8F4E8]/60 hover:text-[#F8F4E8]'
              }`}
              onClick={() => setBillingPeriod('annual')}
            >
              Annual
              <span className="bg-[#D2E823] text-[#09090B] font-black text-xs px-2 py-0.5">
                Save 2 months
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className={`relative bg-white border-2 border-[#09090B] hard-shadow-sm flex flex-col ${
                plan.popular ? 'border-[#D2E823] border-3' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] px-4 py-1 font-black text-xs uppercase">
                  Most Popular
                </div>
              )}

              <div className="p-6 pb-4">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-sm text-[#09090B]/60 mt-1">{plan.description}</p>
                <div className="mt-4">
                  {plan.tier === 'free' ? (
                    <>
                      <span className="text-4xl font-bold">$0</span>
                      <span className="text-[#09090B]/50"> forever</span>
                    </>
                  ) : billingPeriod === 'monthly' ? (
                    <>
                      <span className="text-4xl font-bold">${plan.monthlyPrice}</span>
                      <span className="text-[#09090B]/50"> /mo</span>
                    </>
                  ) : (
                    <div>
                      <div>
                        <span className="text-4xl font-bold">${plan.annualPerMonth}</span>
                        <span className="text-[#09090B]/50"> /mo</span>
                        <span className="text-[#09090B]/30 line-through ml-2">${plan.monthlyPrice}/mo</span>
                      </div>
                      <p className="text-sm text-[#D2E823] font-bold mt-1">billed ${plan.annualTotal}/year</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 pb-6 flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-[#D2E823] shrink-0 mt-0.5" />
                      <span className="text-[#09090B]/70">{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.upsellNote && (
                  <p className="mt-4 text-sm text-[#09090B]/40 italic">{plan.upsellNote}</p>
                )}
              </div>

              <div className="p-6 pt-0">
                <button
                  className={`w-full border-2 border-[#09090B] px-6 py-3 font-bold text-sm uppercase hard-shadow-sm btn-brutal ${
                    plan.popular
                      ? 'bg-[#D2E823] text-[#09090B]'
                      : 'bg-white text-[#09090B] hover:bg-[#D2E823]'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={loading === plan.tier || currentTier === plan.tier}
                  onClick={() => handleSubscribe(
                    billingPeriod === 'annual' ? plan.annualPriceId : plan.monthlyPriceId,
                    plan.tier
                  )}
                >
                  {loading === plan.tier ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  ) : currentTier === plan.tier ? (
                    'Current Plan'
                  ) : plan.tier === 'free' ? (
                    'Get Started'
                  ) : (
                    `Upgrade to ${plan.name}`
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="heading-font text-2xl text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <details className="bg-white border-2 border-[#09090B] p-6 group">
              <summary className="font-bold cursor-pointer flex items-center justify-between">
                What&apos;s the difference between price estimates and sold data?
                <span className="text-[#D2E823] text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-[#09090B]/70 mt-3">
                Free and Flipper plans use active eBay listings to estimate prices. Pro plan uses actual sold listings from eBay, giving you real market data on what items actually sell for.
              </p>
            </details>

            <details className="bg-white border-2 border-[#09090B] p-6 group">
              <summary className="font-bold cursor-pointer flex items-center justify-between">
                Can I cancel anytime?
                <span className="text-[#D2E823] text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-[#09090B]/70 mt-3">
                Yes! You can cancel your subscription at any time. You&apos;ll keep access until the end of your billing period.
              </p>
            </details>

            <details className="bg-white border-2 border-[#09090B] p-6 group">
              <summary className="font-bold cursor-pointer flex items-center justify-between">
                Do unused lookups roll over?
                <span className="text-[#D2E823] text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-[#09090B]/70 mt-3">
                No, daily lookups reset every 24 hours. However, we cache results for 24 hours, so repeated searches for the same item don&apos;t count against your limit.
              </p>
            </details>

            <details className="bg-white border-2 border-[#09090B] p-6 group">
              <summary className="font-bold cursor-pointer flex items-center justify-between">
                How do price alerts work?
                <span className="text-[#D2E823] text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-[#09090B]/70 mt-3">
                Set up alerts for specific searches with a maximum price. We&apos;ll notify you by email when a matching listing appears on FB Marketplace below your target price.
              </p>
            </details>
          </div>
        </div>
      </main>
    </div>
  )
}
