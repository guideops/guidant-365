import OpenAI from 'openai'

let openaiClient: OpenAI | null = null

export function getOpenAIClient() {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return openaiClient
}

export interface ExtractedDocument {
  amount?: number
  due_date?: string
  vendor?: string
  description?: string
  invoice_number?: string
  line_items?: Array<{ description: string; amount: number }>
  confidence: number
}

export async function extractDocumentData(rawText: string): Promise<ExtractedDocument> {
  const client = getOpenAIClient()
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: `You are a document data extractor for a contractor management system.
Extract structured data from the provided text. Return ONLY valid JSON with these fields:
- amount: number (total amount, null if not found)
- due_date: string ISO date (YYYY-MM-DD, null if not found)
- vendor: string (vendor/supplier name, null if not found)
- description: string (brief description of goods/services, null if not found)
- invoice_number: string (null if not found)
- line_items: array of {description: string, amount: number} (empty array if none found)
- confidence: number between 0 and 1 (your confidence in the extraction quality)
Return only the JSON object, no other text.`,
      },
      {
        role: 'user',
        content: rawText.slice(0, 4000),
      },
    ],
  })

  const content = response.choices[0]?.message?.content ?? '{}'
  try {
    return JSON.parse(content) as ExtractedDocument
  } catch {
    return { confidence: 0 }
  }
}

export async function generateEmailDrafts(
  threadContent: string,
  jobContext?: string
): Promise<{ formal: string; friendly: string; brief: string }> {
  const client = getOpenAIClient()
  const context = jobContext ? `\nJob context: ${jobContext}` : ''

  const [formal, friendly, brief] = await Promise.all([
    client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        { role: 'system', content: `You are a professional contractor's assistant. Write a formal, professional reply email. Keep it concise (under 200 words). Do not include a subject line.${context}` },
        { role: 'user', content: `Write a reply to this email thread:\n\n${threadContent.slice(0, 2000)}` },
      ],
    }),
    client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        { role: 'system', content: `You are a friendly contractor's assistant. Write a warm, friendly reply email. Keep it concise (under 200 words). Do not include a subject line.${context}` },
        { role: 'user', content: `Write a reply to this email thread:\n\n${threadContent.slice(0, 2000)}` },
      ],
    }),
    client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.5,
      messages: [
        { role: 'system', content: `You are a contractor's assistant. Write a brief, direct reply email (under 100 words). Do not include a subject line.${context}` },
        { role: 'user', content: `Write a reply to this email thread:\n\n${threadContent.slice(0, 2000)}` },
      ],
    }),
  ])

  return {
    formal: formal.choices[0]?.message?.content ?? '',
    friendly: friendly.choices[0]?.message?.content ?? '',
    brief: brief.choices[0]?.message?.content ?? '',
  }
}
