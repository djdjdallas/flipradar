import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { authenticateBearer } from '@/lib/auth'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

export async function POST(request) {
  try {
    // 1. Authenticate via Bearer token (supports both JWT and API key)
    const auth = await authenticateBearer(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { user } = auth

    // 2. Parse request body
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { screenshot, url } = body

    if (!screenshot) {
      return NextResponse.json({ error: 'screenshot is required' }, { status: 400 })
    }

    // Validate screenshot size (5MB base64 ~ 6.67MB string)
    if (screenshot.length > 5 * 1024 * 1024 * 1.34) {
      return NextResponse.json({ error: 'Screenshot too large (max 5MB)' }, { status: 400 })
    }

    // 3. Check usage limits
    const serviceClient = await createServiceClient()
    const { data: usageResult, error: usageError } = await serviceClient.rpc('increment_usage', {
      p_user_id: user.id,
      p_action: 'extraction'
    })

    if (usageError) {
      console.error('[FlipChecker API] Usage check error:', usageError)
      return NextResponse.json({ error: 'Failed to check usage' }, { status: 500 })
    }

    if (!usageResult.allowed) {
      return NextResponse.json({
        error: 'Daily extraction limit reached',
        usage: usageResult
      }, { status: 429 })
    }

    // 4. Extract data using Gemini Vision (direct REST API call)
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('[FlipChecker API] No Gemini API key configured')
      return NextResponse.json({ error: 'Vision extraction not configured' }, { status: 500 })
    }

    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: screenshot
              }
            },
            {
              text: `Extract the following information from this Facebook Marketplace listing screenshot. Return ONLY valid JSON with no explanation.

Fields to extract:
- title: The product/item name (string)
- price: The CURRENT asking price as a number (no $ sign, just the number, or null if not found). IMPORTANT: If there are two prices shown (a crossed-out/strikethrough original price and a lower current price), extract the LOWER current price, not the crossed-out one.
- originalPrice: If there's a crossed-out/strikethrough price showing a price drop, extract that original higher price as a number (or null if no price drop shown)
- location: City and state (string, or null if not found)
- seller: Seller's name (string, or null if not found)
- daysListed: How long it's been listed (string like "Listed 3 days ago", or null if not found)
- condition: Item condition (string, or null if not found)

Return JSON:`
            }
          ]
        }]
      })
    })

    if (!geminiResponse.ok) {
      const errBody = await geminiResponse.text()
      console.error('[FlipChecker API] Gemini API error:', geminiResponse.status, errBody)
      throw new Error(`Gemini API returned ${geminiResponse.status}`)
    }

    const geminiData = await geminiResponse.json()
    let responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!responseText) {
      throw new Error('No text in Gemini response')
    }

    // Strip markdown code blocks if present
    if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }
    const extracted = JSON.parse(responseText)

    return NextResponse.json({
      ...extracted,
      extractionMethod: 'vision',
      usage: usageResult
    })

  } catch (error) {
    console.error('[FlipChecker API] Vision extraction error:', error)

    // Return null fields on failure
    return NextResponse.json({
      title: null,
      price: null,
      originalPrice: null,
      location: null,
      seller: null,
      daysListed: null,
      condition: null,
      error: error.message || 'Vision extraction failed'
    })
  }
}
