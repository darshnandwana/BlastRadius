import OpenAI from 'openai'

async function fetchNews() {
  try {
    const res = await fetch(
      `https://gnews.io/api/v4/search?q=war+conflict+sanctions+geopolitical&lang=en&max=10&apikey=${process.env.GNEWS_API_KEY}`,
      { signal: AbortSignal.timeout(8000) }
    )
    const data = await res.json()
    return data.articles?.map(a => `${a.title}: ${a.description}`).join('\n') || ''
  } catch {
    return `
    Iran war escalates as US and Israel continue strikes
    Trump imposes new tariffs on Chinese goods
    Russia Ukraine conflict continues with no peace deal
    North Korea fires ballistic missiles toward Japan
    Red Sea shipping disruption as Houthi attacks persist
    India Pakistan border tensions rise
    Sudan civil war displaces millions
    Taiwan Strait Chinese military exercises increase
    `
  }
}

export async function GET() {
  try {
    const headlines = await fetchNews()

    const client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    })

    const completion = await client.chat.completions.create({
      model: 'nex-agi/nex-n2-pro:free',
      max_tokens: 3000,
      messages: [
        {
          role: 'system',
          content: 'You are a JSON API. You only respond with valid JSON arrays. No explanation, no markdown, no preamble. Just the raw JSON array.'
        },
        {
          role: 'user',
          content: `Analyze these geopolitical headlines and return a JSON array of exactly 5 events.

Headlines:
${headlines}

Return ONLY this JSON structure, nothing else:
[
  {
    "name": "Short event name",
    "location": "Country or region",
    "lat": 0.0,
    "lng": 0.0,
    "date": "2026-06-13",
    "summary": "Two sentence economic impact summary.",
    "metrics": [
      {"label": "Metric name", "value": "Value"},
      {"label": "Metric name", "value": "Value"},
      {"label": "Metric name", "value": "Value"}
    ],
    "industries": ["Industry1", "Industry2", "Industry3"]
  }
]`
        }
      ]
    })

    const raw = completion.choices[0].message.content
    const clean = raw
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    // Find the JSON array in the response
    const start = clean.indexOf('[')
    const end = clean.lastIndexOf(']')
    
    if (start === -1 || end === -1) {
      throw new Error('No JSON array found in response')
    }

    const jsonStr = clean.slice(start, end + 1)
    const events = JSON.parse(jsonStr)

    return Response.json({ events, generatedAt: new Date().toISOString() })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}