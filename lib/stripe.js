import Stripe from 'stripe'

// Lazy initialization to avoid build-time errors when env vars aren't available
let stripeInstance = null

export function getStripe() {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16'
    })
  }
  return stripeInstance
}

// Price IDs for subscription tiers
export const PRICES = {
  flipper: process.env.STRIPE_PRICE_FLIPPER,
  pro: process.env.STRIPE_PRICE_PRO
}

// Get tier from Stripe price ID
export function getTierFromPriceId(priceId) {
  if (priceId === process.env.STRIPE_PRICE_PRO) {
    return 'pro'
  }
  if (priceId === process.env.STRIPE_PRICE_FLIPPER) {
    return 'flipper'
  }
  return 'free'
}
