'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Loader2 } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with basic price estimates',
    features: [
      '10 price lookups per day',
      '25 saved deals',
      '1 price alert',
      'Basic price estimates',
      'eBay search links'
    ],
    tier: 'free',
    priceId: null
  },
  {
    name: 'Flipper',
    price: '$19',
    period: '/month',
    description: 'For serious part-time flippers',
    features: [
      '100 price lookups per day',
      '500 saved deals',
      '10 price alerts',
      'Real eBay active listings data',
      'Price history charts',
      'Email alerts'
    ],
    tier: 'flipper',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_FLIPPER,
    popular: true
  },
  {
    name: 'Pro',
    price: '$39',
    period: '/month',
    description: 'For full-time resellers',
    features: [
      '500 price lookups per day',
      'Unlimited saved deals',
      '50 price alerts',
      'Real eBay SOLD data',
      'Advanced analytics',
      'Priority support',
      'API access'
    ],
    tier: 'pro',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO
  }
]

export default function PricingPage() {
  const [user, setUser] = useState(null)
  const [currentTier, setCurrentTier] = useState(null)
  const [loading, setLoading] = useState(null)
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
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            <span className="text-green-500">Flip</span>Checker
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your flipping business. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.tier}
              className={`relative ${plan.popular ? 'border-green-500 border-2 shadow-lg' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500">
                  Most Popular
                </Badge>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  disabled={loading === plan.tier || currentTier === plan.tier}
                  onClick={() => handleSubscribe(plan.priceId, plan.tier)}
                >
                  {loading === plan.tier ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : currentTier === plan.tier ? (
                    'Current Plan'
                  ) : plan.tier === 'free' ? (
                    'Get Started'
                  ) : (
                    `Upgrade to ${plan.name}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">What&apos;s the difference between price estimates and sold data?</h3>
              <p className="text-gray-600">
                Free and Flipper plans use active eBay listings to estimate prices. Pro plan uses actual sold listings from eBay, giving you real market data on what items actually sell for.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time. You&apos;ll keep access until the end of your billing period.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Do unused lookups roll over?</h3>
              <p className="text-gray-600">
                No, daily lookups reset every 24 hours. However, we cache results for 24 hours, so repeated searches for the same item don&apos;t count against your limit.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">How do price alerts work?</h3>
              <p className="text-gray-600">
                Set up alerts for specific searches with a maximum price. We&apos;ll notify you by email when a matching listing appears on FB Marketplace below your target price.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
