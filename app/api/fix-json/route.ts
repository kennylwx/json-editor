import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { json, error, line } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const prompt = `You are a JSON fixing assistant. The user has invalid JSON with an error.

Current JSON:
\`\`\`json
${json}
\`\`\`

Error on line ${line}: ${error}

Please fix the JSON and return ONLY the corrected JSON, nothing else. Do not include any explanation or markdown formatting.`

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
      temperature: 0.1,
    })

    // Clean up the response in case it includes markdown
    let fixedJson = text.trim()
    if (fixedJson.startsWith('```json')) {
      fixedJson = fixedJson.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    } else if (fixedJson.startsWith('```')) {
      fixedJson = fixedJson.replace(/```\n?/g, '')
    }

    // Validate that the fixed JSON is actually valid
    try {
      JSON.parse(fixedJson)
    } catch (e) {
      return NextResponse.json(
        { error: 'AI generated invalid JSON' },
        { status: 500 }
      )
    }

    return NextResponse.json({ fixedJson })
  } catch (error) {
    console.error('Error fixing JSON:', error)
    return NextResponse.json(
      { error: 'Failed to fix JSON' },
      { status: 500 }
    )
  }
}
