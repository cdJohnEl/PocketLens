"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, BarChart3, ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react"
import { CashFlowChart } from "./charts/cash-flow-chart"
import { ExpenseBreakdownChart } from "./charts/expense-breakdown-chart"
import type { Transaction } from "@/lib/firestore"
import { formatCurrency } from "../lib/currency"

interface ReportsPageProps {
  transactions: Transaction[]
}

export function ReportsPage({ transactions }: ReportsPageProps) {
  // Calculate totals from actual transactions
  const totalIncome = transactions.filter((t) => t.type === "Income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "Expenses").reduce((sum, t) => sum + t.amount, 0)

  const savings = totalIncome - totalExpenses

  // Get top transactions
  const topIncomes = transactions
    .filter((t) => t.type === "Income")
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3)

  const topExpenses = transactions
    .filter((t) => t.type === "Expenses")
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Finance Reports 📊</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">A summary of your income and expenses in one place.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            Weekly
          </Button>
          <Button variant="outline" size="sm">
            Monthly
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-gray-600">Income</p>
                  <Badge variant="secondary" className="text-xs">
                    {transactions.filter((t) => t.type === "Income").length}
                  </Badge>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(totalIncome)}</h3>
                <p className="text-sm text-gray-500 mt-1">Total income earned</p>
              </div>
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded">
                <ArrowUpRight className="h-3 w-3" />
                <span className="text-xs font-medium">+</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-gray-600">Expenses</p>
                  <Badge variant="secondary" className="text-xs">
                    {transactions.filter((t) => t.type === "Expenses").length}
                  </Badge>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</h3>
                <p className="text-sm text-gray-500 mt-1">Total expenses spent</p>
              </div>
              <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded">
                <ArrowDownRight className="h-3 w-3" />
                <span className="text-xs font-medium">-</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <p className="text-sm text-gray-600">Net Worth</p>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(savings)}</h3>
                <p className="text-sm text-gray-500 mt-1">Income minus expenses</p>
              </div>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded ${
                  savings >= 0 ? "text-blue-600 bg-blue-50" : "text-red-600 bg-red-50"
                }`}
              >
                {savings >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                <span className="text-xs font-medium">{savings >= 0 ? "+" : "-"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Cash Flow Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Cash Flow Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CashFlowChart transactions={transactions} />
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Expenses</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Expense Breakdown</CardTitle>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ExpenseBreakdownChart transactions={transactions} />
          </CardContent>
        </Card>
      </div>

      {/* Top Income and Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Incomes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Top Incomes
              <Badge variant="secondary" className="text-xs">
                {topIncomes.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topIncomes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No income transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topIncomes.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.category}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{formatCurrency(transaction.amount)}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {transaction.method}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Top Expenses
              <Badge variant="secondary" className="text-xs">
                {topExpenses.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topExpenses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No expense transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topExpenses.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.category}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">{formatCurrency(transaction.amount)}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {transaction.method}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
