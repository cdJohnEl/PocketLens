"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { formatCurrencyShort, formatCurrency } from "../../lib/currency"

import type { Transaction } from "@/lib/firestore"

type CashFlowChartProps = {
  transactions: Transaction[]
}

// Group transactions by month and sum income/expenses
function getMonthlyData(transactions: Transaction[]) {
  const monthMap: Record<string, { income: number; expenses: number }> = {}
  transactions.forEach((t) => {
    const date = new Date(t.date)
    const month = date.toLocaleString("default", { month: "short" })
    if (!monthMap[month]) monthMap[month] = { income: 0, expenses: 0 }
    if (t.type === "Income") monthMap[month].income += t.amount
    if (t.type === "Expenses") monthMap[month].expenses += t.amount
  })
  // Sort months by order in year
  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return monthOrder
    .map((m) => ({ month: m, ...monthMap[m] }))
    .filter((d) => d.income || d.expenses)
}

export function CashFlowChart({ transactions }: CashFlowChartProps) {
  const data = getMonthlyData(transactions)
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#666" }}
          tickFormatter={(value) => formatCurrencyShort(value)}
        />
        <Tooltip
          formatter={(value: number, name: string) => [
            formatCurrency(value),
            name === "income" ? "Income" : "Expenses",
          ]}
          labelStyle={{ color: "#666" }}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#3b82f6"
          strokeWidth={3}
          dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
          name="Income"
        />
        <Line
          type="monotone"
          dataKey="expenses"
          stroke="#ef4444"
          strokeWidth={3}
          dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2 }}
          name="Expenses"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
