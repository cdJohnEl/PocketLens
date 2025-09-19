"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Download, Filter, Search, ArrowUpRight, ArrowDownRight, Edit, Trash2 } from "lucide-react"
import { AddTransactionModal } from "./add-transaction-modal"
import { type Transaction, transactionService } from "@/lib/firestore"
import { formatCurrency } from "../lib/currency"

interface TransactionsPageProps {
  transactions: Transaction[]
  onTransactionChange: () => void
}

export function TransactionsPage({ transactions, onTransactionChange }: TransactionsPageProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionService.deleteTransaction(id)
        onTransactionChange()
      } catch (error) {
        console.error("Error deleting transaction:", error)
      }
    }
  }

  const handleTransactionSuccess = () => {
    onTransactionChange()
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Your Transactions 💸</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            A detailed list of everything that comes in and out. Keep your finances in check.
          </p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transaction by type or method"
              className="pl-10 w-full sm:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Prepare CSV data
              const headers = ["Type", "Category", "Amount", "Method", "Date"]
              const rows = filteredTransactions.map((t) => [
                t.type,
                t.category,
                t.amount,
                t.method,
                t.date,
              ])
              const csvContent = [
                headers.join(","),
                ...rows.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")),
              ].join("\n")
              // Download as file
              const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = "transactions.csv"
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter by
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {searchTerm ? "No transactions match your search" : "No transactions yet"}
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add your first transaction
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left p-2 sm:p-4 font-medium text-gray-900">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="text-left p-2 sm:p-4 font-medium text-gray-900">Type</th>
                    <th className="text-left p-2 sm:p-4 font-medium text-gray-900 hidden sm:table-cell">Category</th>
                    <th className="text-left p-2 sm:p-4 font-medium text-gray-900">Amount</th>
                    <th className="text-left p-2 sm:p-4 font-medium text-gray-900 hidden md:table-cell">Method</th>
                    <th className="text-left p-2 sm:p-4 font-medium text-gray-900 hidden lg:table-cell">Date</th>
                    <th className="text-left p-2 sm:p-4 font-medium text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-2 sm:p-4">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="p-2 sm:p-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded flex items-center justify-center ${
                              transaction.type === "Income" ? "bg-green-100" : "bg-red-100"
                            }`}
                          >
                            {transaction.type === "Income" ? (
                              <ArrowUpRight className="h-3 w-3 text-green-600" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 text-red-600" />
                            )}
                          </div>
                          <span className="font-medium text-gray-900 text-sm sm:text-base">{transaction.type}</span>
                        </div>
                      </td>
                      <td className="p-2 sm:p-4 hidden sm:table-cell">
                        <Badge variant="secondary" className="text-xs">
                          {transaction.category}
                        </Badge>
                      </td>
                      <td className="p-2 sm:p-4">
                        <span
                          className={`font-semibold text-sm sm:text-base ${
                            transaction.type === "Income" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="p-2 sm:p-4 hidden md:table-cell">
                        <span className="text-gray-600 text-sm">{transaction.method}</span>
                      </td>
                      <td className="p-2 sm:p-4 hidden lg:table-cell">
                        <span className="text-gray-600 text-sm">{transaction.date}</span>
                      </td>
                      <td className="p-2 sm:p-4">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => transaction.id && handleDeleteTransaction(transaction.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  )
}
