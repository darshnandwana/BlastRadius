import OpenAI from 'openai'

export async function GET() {
  try {
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
          content: `You are Blastradius, an economic shockwave analyzer. Based on your knowledge of current world events as of June 2026, generate a JSON array of exactly 5 major active geopolitical events and their economic blast radius.

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