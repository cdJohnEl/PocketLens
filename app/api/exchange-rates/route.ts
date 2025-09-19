import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Using a free exchange rate API
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates")
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      rates: data.rates,
      lastUpdated: data.date,
    })
  } catch (error) {
    console.error("Exchange rate API error:", error)

    // Fallback rates if API fails
    const fallbackRates = {
      NGN: 1650,
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110,
      CAD: 1.25,
      AUD: 1.35,
      CHF: 0.92,
      CNY: 6.45,
      INR: 75,
    }

    return NextResponse.json({
      success: false,
      rates: fallbackRates,
      lastUpdated: new Date().toISOString(),
      message: "Using fallback rates due to API unavailability",
    })
  }
}
