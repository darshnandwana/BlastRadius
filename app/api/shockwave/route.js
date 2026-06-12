import OpenAI from 'openai'

async function fetchRSSHeadlines() {
  const feeds = [
    'https://feeds.bbci.co.uk/news/world/rss.xml',
    'https://www.aljazeera.com/xml/rss/all.xml',
    'https://feeds.reuters.com/reuters/worldNews',
  ]

  const headlines = []

  for (const url of feeds) {
    try {
      const res = await fetch(url)
      const text = await res.text()
      const titles = [...text.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/g)]
        .slice(1, 6)
        .map(m => m[1] || m[2])
        .filter(Boolean)
      headlines.push(...titles)
    } catch (e) {
      continue
    }
  }

  return headlines.slice(0, 15).join('\n')
}

export async function GET() {
  try {
    const headlines = await fetchRSSHeadlines()

    const client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    })

    const completion = await client.chat.completions.create({
      model: 'nex-agi/nex-n2-pro:free',
      messages: [
        {
          role: 'user',
          content: `You are Blastradius, an economic shockwave analyzer. Given these real headlines from today, identify the 3 most significant geopolitical events and provide a blast radius analysis for each.

Headlines:
${headlines}

Respond ONLY with a JSON array, no markdown, no explanation, just raw JSON:
[
  {
    "name": "Event name",
    "location": "Country or region",
    "lat": latitude_number,
    "lng": longitude_number,
    "date": "Approximate date",
    "summary": "2 sentence summary of economic impact",
    "metrics": [
      {"label": "Key metric 1", "value": "Value"},
      {"label": "Key metric 2", "value": "Value"},
      {"label": "Key metric 3", "value": "Value"}
    ],
    "industries": ["Industry1", "Industry2", "Industry3"]
  }
]`
        }
      ]
    })

    const text = completion.choices[0].message.content
    const clean = text.replace(/```json|```/g, '').trim()
    const events = JSON.parse(clean)

    return Response.json({ events, generatedAt: new Date().toISOString() })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}