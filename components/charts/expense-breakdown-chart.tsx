"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

import type { Transaction } from "@/lib/firestore"

type ExpenseBreakdownChartProps = {
  transactions: Transaction[]
}

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#6366f1", "#a21caf", "#f472b6", "#facc15"]

function getCategoryData(transactions: Transaction[]) {
  const categoryMap: Record<string, number> = {}
  let total = 0
  transactions.forEach((t) => {
    if (t.type === "Expenses") {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount
      total += t.amount
    }
  })
  const entries = Object.entries(categoryMap)
  return entries.map(([name, amount], i) => ({
    name,
    value: total ? Math.round((amount / total) * 100) : 0,
    amount,
    color: COLORS[i % COLORS.length],
  }))
}

export function ExpenseBreakdownChart({ transactions }: ExpenseBreakdownChartProps) {
  const data = getCategoryData(transactions)
  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string, props: any) => [`${value}%`, props.payload.name]}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm text-gray-600">{item.name}</span>
              <span className="text-xs text-gray-500">{item.value}%</span>
            </div>
            <span className="text-sm font-medium text-gray-900">Rp {item.amount.toLocaleString("id-ID")}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
