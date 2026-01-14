import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServiceClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request) {
  try {
    // 1. Extract and validate Bearer token
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 })
    }

    const token = authHeader.substring(7)

    // Validate token with Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse request body
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { pageText, url } = body

    if (!pageText) {
      return NextResponse.json({ error: 'pageText is required' }, { status: 400 })
    }

    // 3. Check usage limits
    const serviceClient = await createServiceClient()
    const { data: usageResult, error: usageError } = await serviceClient.rpc('increment_usage', {
      p_user_id: user.id,
      p_action: 'extraction'
    })

    if (usageError) {
      console.error('Usage check error:', usageError)
      return NextResponse.json({ error: 'Failed to check usage' }, { status: 500 })
    }

    if (!usageResult.allowed) {
      return NextResponse.json({
        error: 'Daily extraction limit reached',
        usage: usageResult
      }, { status: 429 })
    }

    // 4. Extract data using Claude
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Extract the following information from this Facebook Marketplace listing text. Return ONLY valid JSON with no explanation.

Fields to extract:
- title: The product/item name (string)
- price: The CURRENT asking price as a number (no $ sign, just the number, or null if not found). IMPORTANT: If there are two prices shown (a crossed-out/strikethrough original price and a lower current price), extract the LOWER current price, not the crossed-out one.
- originalPrice: If there's a crossed-out/strikethrough price showing a price drop, extract that original higher price as a number (or null if no price drop shown)
- location: City and state (string, or null if not found)
- seller: Seller's name (string, or null if not found)
- daysListed: How long it's been listed (string like "Listed 3 days ago", or null if not found)
- condition: Item condition (string, or null if not found)

Page text:
${pageText}

Return JSON:`
      }]
    })

    // Parse the response (strip markdown code blocks if present)
    let responseText = message.content[0].text.trim()
    if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }
    const extracted = JSON.parse(responseText)

    return NextResponse.json({
      ...extracted,
      usage: usageResult
    })

  } catch (error) {
    console.error('Extraction error:', error)

    // Return null fields on failure
    return NextResponse.json({
      title: null,
      price: null,
      originalPrice: null,
      location: null,
      seller: null,
      daysListed: null,
      condition: null,
      error: 'Extraction failed'
    })
  }
}
