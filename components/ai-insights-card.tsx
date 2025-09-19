"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Sparkles, RefreshCw, TrendingUp } from "lucide-react"
import type { Transaction } from "@/lib/firestore"

interface AIInsightsCardProps {
  transactions: Transaction[]
}

export function AIInsightsCard({ transactions }: AIInsightsCardProps) {
  const [insights, setInsights] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const generateInsights = async () => {
    if (transactions.length === 0) {
      setInsights("Add some transactions to get personalized financial insights from MoneyMind! 💡")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions }),
      })

      const data = await response.json()
      setInsights(data.insights || "Unable to generate insights at the moment.")
    } catch (error) {
      console.error("Error fetching insights:", error)
      setInsights("Unable to generate insights at the moment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (transactions.length > 0) {
      generateInsights()
    }
  }, [transactions])

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <span className="text-lg font-bold">MoneyMind</span>
            <div className="flex items-center gap-1 text-sm font-normal text-purple-600">
              <Sparkles className="h-3 w-3" />
              AI Financial Insights
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-purple-600">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">MoneyMind is analyzing your finances...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-white/70 rounded-lg p-4 border border-purple-100">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {insights || "Add some transactions to get personalized insights! 💡"}
              </p>
            </div>
            <Button
              onClick={generateInsights}
              variant="outline"
              size="sm"
              className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
              disabled={loading || transactions.length === 0}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              {loading ? "Analyzing..." : "Refresh Insights"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
