import { createServiceClient } from '@/lib/supabase/server'
import { getStripe, getTierFromPriceId } from '@/lib/stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  const stripe = getStripe()
  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const supabase = await createServiceClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const customerId = session.customer
        const subscriptionId = session.subscription
        const userId = session.metadata?.user_id

        if (!userId) {
          console.error('No user_id in checkout session metadata')
          break
        }

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const priceId = subscription.items.data[0].price.id
        const tier = getTierFromPriceId(priceId)

        // Update user profile
        const { error } = await supabase
          .from('profiles')
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_status: 'active',
            tier: tier,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
          })
          .eq('id', userId)

        if (error) {
          console.error('Failed to update profile after checkout:', error)
        } else {
          console.log(`User ${userId} subscribed to ${tier}`)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const customerId = subscription.customer

        // Find user by customer ID
        const { data: profile, error: findError } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (findError || !profile) {
          console.error('Could not find profile for customer:', customerId)
          break
        }

        const priceId = subscription.items.data[0].price.id
        const tier = getTierFromPriceId(priceId)

        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_status: subscription.status,
            tier: subscription.status === 'active' ? tier : 'free',
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
          })
          .eq('id', profile.id)

        if (error) {
          console.error('Failed to update subscription:', error)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const customerId = subscription.customer

        // Find user and downgrade to free
        const { data: profile, error: findError } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (findError || !profile) {
          console.error('Could not find profile for customer:', customerId)
          break
        }

        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'canceled',
            tier: 'free',
            stripe_subscription_id: null
          })
          .eq('id', profile.id)

        if (error) {
          console.error('Failed to downgrade user:', error)
        } else {
          console.log(`User ${profile.id} downgraded to free`)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const customerId = invoice.customer

        const { data: profile, error: findError } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (findError || !profile) {
          break
        }

        const { error } = await supabase
          .from('profiles')
          .update({ subscription_status: 'past_due' })
          .eq('id', profile.id)

        if (error) {
          console.error('Failed to mark subscription past_due:', error)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
