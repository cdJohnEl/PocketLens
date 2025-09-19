"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { transactionService, type Transaction } from "@/lib/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatCurrencyShort } from "@/lib/currency"
import { AIInsightsCard } from "./ai-insights-card"
import { SettingsPage } from "./settings-page"
import {
  TrendingUp,
  Plus,
  Eye,
  Calendar,
  Settings,
  Bell,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { TransactionsPage } from "./transactions-page"
import { ReportsPage } from "./reports-page"
import { AddTransactionModal } from "./add-transaction-modal"

interface DashboardContentProps {
  activeTab: string
}

export function DashboardContent({ activeTab }: DashboardContentProps) {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [exchangeRate, setExchangeRate] = useState(1)
  const [currentCurrency, setCurrentCurrency] = useState("NGN")

  useEffect(() => {
    if (user) {
      loadTransactions()
    }

    // Load currency settings
    const savedCurrency = getCurrentCurrency()
    setCurrentCurrency(savedCurrency)

    // Fetch exchange rate for selected currency
    if (savedCurrency !== "NGN") {
      getExchangeRate(savedCurrency).then(setExchangeRate)
    }

    // Listen for currency changes
    const handleCurrencyChange = (event: CustomEvent) => {
      const newCurrency = event.detail
      setCurrentCurrency(newCurrency)
      if (newCurrency !== "NGN") {
        getExchangeRate(newCurrency).then(setExchangeRate)
      } else {
        setExchangeRate(1)
      }
    }

    window.addEventListener("currency-changed", handleCurrencyChange as EventListener)
    return () => {
      window.removeEventListener("currency-changed", handleCurrencyChange as EventListener)
    }
  }, [user])

  const loadTransactions = async () => {
    if (!user) return

    try {
      const userTransactions = await transactionService.getTransactions(user.uid)
      setTransactions(userTransactions)
    } catch (error) {
      console.error("Error loading transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTransactionSuccess = () => {
    loadTransactions()
  }

  const getCurrentCurrency = () => {
    // Placeholder for retrieving saved currency
    return "NGN"
  }

  const getExchangeRate = async (currency: string) => {
    // Placeholder for fetching exchange rate
    return 1
  }

  if (activeTab === "transactions") {
    return <TransactionsPage transactions={transactions} onTransactionChange={loadTransactions} />
  }

  if (activeTab === "reports") {
    return <ReportsPage transactions={transactions} />
  }

  if (activeTab === "settings") {
    return <SettingsPage />
  }

  if (activeTab !== "dashboard") {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-600">This feature is under development.</p>
        </div>
      </div>
    )
  }

  const userName = user?.email?.split("@")[0] || "User"

  // Calculate totals from actual transactions
  const totalIncome = transactions.filter((t) => t.type === "Income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "Expenses").reduce((sum, t) => sum + t.amount, 0)

  const totalBalance = totalIncome - totalExpenses
  const savings = totalBalance > 0 ? totalBalance * 0.1 : 0 // Assume 10% savings rate

  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5)

  const formatAmount = (amount: number) => formatCurrency(amount, currentCurrency, exchangeRate)
  const formatAmountShort = (amount: number) => formatCurrencyShort(amount, currentCurrency, exchangeRate)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Hello, {userName.charAt(0).toUpperCase() + userName.slice(1)}! 👋
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Here's a quick look at your finances today.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm">
              Weekly
            </Button>
            <Button variant="outline" size="sm">
              Monthly
            </Button>
            <Button variant="ghost" size="sm">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">{userName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500 truncate max-w-[150px]">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-blue-100 mb-2">Total Balance</p>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">{formatAmount(totalBalance)}</h2>
              <div className="flex items-center gap-1 text-blue-100">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Based on your transactions</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Income
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">Income</p>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{formatAmount(totalIncome)}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  From {transactions.filter((t) => t.type === "Income").length} transactions
                </p>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">+</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">Expenses</p>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{formatAmount(totalExpenses)}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  From {transactions.filter((t) => t.type === "Expenses").length} transactions
                </p>
              </div>
              <div className="flex items-center gap-1 text-red-600">
                <ArrowDownRight className="h-4 w-4" />
                <span className="text-sm font-medium">-</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">Net Worth</p>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {formatAmount(totalIncome - totalExpenses)}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Income minus expenses</p>
              </div>
              <div className="flex items-center gap-1 text-blue-600">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">Net</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions and AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                View Details
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No transactions yet</p>
                <Button onClick={() => setShowAddModal(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add your first transaction
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          transaction.type === "Income" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "Income" ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.type}</p>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${transaction.type === "Income" ? "text-green-600" : "text-red-600"}`}
                      >
                        {formatAmount(transaction.amount)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {transaction.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{transaction.method}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Insights */}
        <AIInsightsCard transactions={transactions} />
      </div>

      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  )
}
