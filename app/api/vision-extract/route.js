import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { authenticateBearer } from '@/lib/auth'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY })

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
      console.error('[FlipRadar API] Usage check error:', usageError)
      return NextResponse.json({ error: 'Failed to check usage' }, { status: 500 })
    }

    if (!usageResult.allowed) {
      return NextResponse.json({
        error: 'Daily extraction limit reached',
        usage: usageResult
      }, { status: 429 })
    }

    // 4. Extract data using Gemini Vision
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
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

    // Parse the response (strip markdown code blocks if present)
    let responseText = response.text.trim()
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
    console.error('[FlipRadar API] Vision extraction error:', error)

    // Return null fields on failure
    return NextResponse.json({
      title: null,
      price: null,
      originalPrice: null,
      location: null,
      seller: null,
      daysListed: null,
      condition: null,
      error: 'Vision extraction failed'
    })
  }
}
