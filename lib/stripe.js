import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
})

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
