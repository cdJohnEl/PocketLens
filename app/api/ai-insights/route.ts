import { NextRequest, NextResponse } from "next/server"
import { google } from "@ai-sdk/google"
import { generateText } from "ai"

export async function POST(req: NextRequest) {
  try {
    const { transactions } = await req.json()
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return NextResponse.json({ insights: "No transactions provided." }, { status: 400 })
    }

  // Compose a concise prompt for Gemini
  const prompt = `Analyze the following financial transactions and provide a concise summary of 2-3 actionable insights or tips to help the user improve their financial health. Be brief, use no more than 3 sentences, and do not include disclaimers.\n\nTransactions:\n${JSON.stringify(transactions, null, 2)}`

    const { text } = await generateText({
  model: google.generativeAI("gemini-2.0-flash"),
      prompt,
    })

    return NextResponse.json({ insights: text })
  } catch (error) {
    console.error("AI Insights API error:", error)
    return NextResponse.json({ insights: "Unable to generate insights at the moment. Please try again." }, { status: 500 })
  }
}
