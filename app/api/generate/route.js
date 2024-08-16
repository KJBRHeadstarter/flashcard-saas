import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`

export async function POST(req) {
  const data = await req.text()

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent([
      systemPrompt,
      data
    ]);

    const response = result.response;
    const flashcards = JSON.parse(response.text());

    return NextResponse.json(flashcards.flashcards)
  } catch (error) {
    console.error('Error generating flashcards:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
