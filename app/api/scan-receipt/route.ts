import { type NextRequest, NextResponse } from "next/server"
import { google } from "@ai-sdk/google"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { transactions } = await request.json()

    if (!transactions || transactions.length === 0) {
      return NextResponse.json({ insights: "No transaction data available for analysis." })
    }

    // Calculate basic metrics
    const totalIncome = transactions
      .filter((t: any) => t.type === "Income")
      .reduce((sum: number, t: any) => sum + t.amount, 0)
    const totalExpenses = transactions
      .filter((t: any) => t.type === "Expenses")
      .reduce((sum: number, t: any) => sum + t.amount, 0)
    const netWorth = totalIncome - totalExpenses

    // Get expense categories
    const expensesByCategory = transactions
      .filter((t: any) => t.type === "Expenses")
      .reduce((acc: any, t: any) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {})

    const topExpenseCategory = Object.entries(expensesByCategory).sort(
      ([, a], [, b]) => (b as number) - (a as number),
    )[0]

    const prompt = `
    Analyze this financial data and provide 3-4 actionable insights in a friendly, encouraging tone:
    
    Financial Summary:
    - Total Income: ₦${totalIncome.toLocaleString("en-NG")}
    - Total Expenses: ₦${totalExpenses.toLocaleString("en-NG")}
    - Net Worth: ₦${netWorth.toLocaleString("en-NG")}
    - Top Expense Category: ${topExpenseCategory ? `${topExpenseCategory[0]} (₦${(topExpenseCategory[1] as number).toLocaleString("en-NG")})` : "None"}
    - Total Transactions: ${transactions.length}
    
    Provide insights about:
    1. Spending patterns and trends
    2. Savings opportunities
    3. Budget recommendations
    4. Financial health assessment
    
    Keep it concise, positive, and actionable. Use Nigerian Naira (₦) currency format.
    `

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt,
    })

    return NextResponse.json({ insights: text })
  } catch (error) {
    console.error("Error generating AI insights:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}
