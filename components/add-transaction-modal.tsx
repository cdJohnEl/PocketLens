"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { transactionService } from "@/lib/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Upload, Loader2 } from "lucide-react"

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddTransactionModal({ isOpen, onClose, onSuccess }: AddTransactionModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [scanningReceipt, setScanningReceipt] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    type: "Expenses" as "Income" | "Expenses", // Default to Expenses for receipt scanning
    category: "",
    amount: "",
    method: "",
    date: new Date().toISOString().split("T")[0],
  })

  const categories = {
    Income: ["Salary", "Freelance", "Commission", "Bonus", "Investment", "Other"],
    Expenses: [
      "Food & Drinks",
      "Groceries",
      "Utilities",
      "Transportation",
      "Entertainment",
      "Healthcare",
      "Shopping",
      "Other",
    ],
  }

  const methods = ["Cash", "Credit Card", "Bank Transfer", "E-Wallet Transfer"]

  const scanReceipt = async (file: File) => {
    setScanningReceipt(true)
    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      setUploadedImage(base64)

      // Call Gemini API to extract receipt data
      const response = await fetch("/api/scan-receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64 }),
      })

      if (!response.ok) {
        throw new Error("Failed to scan receipt")
      }

      const data = await response.json()

      if (data.amount) {
        setFormData((prev) => ({
          ...prev,
          amount: data.amount.toString(),
          category: data.category || prev.category,
          method: data.method || prev.method,
          date: data.date || prev.date,
        }))
      }
    } catch (error) {
      console.error("Error scanning receipt:", error)
      alert("Failed to scan receipt. Please try again or enter details manually.")
    } finally {
      setScanningReceipt(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      scanReceipt(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      await transactionService.addTransaction({
        userId: user.uid,
        type: formData.type,
        category: formData.category,
        amount: Number.parseFloat(formData.amount),
        method: formData.method,
        date: formData.date,
      })

      setFormData({
        type: "Expenses", // Reset to Expenses default
        category: "",
        amount: "",
        method: "",
        date: new Date().toISOString().split("T")[0],
      })
      setUploadedImage(null)

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error adding transaction:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Add Transaction ✏️</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">Fill in the details to record your transaction.</p>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">📸 Scan Receipt</h3>
            <p className="text-sm text-blue-700 mb-3">Upload a receipt photo to auto-fill transaction details</p>

            {uploadedImage && (
              <div className="mb-3">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Uploaded receipt"
                  className="w-full h-32 object-cover rounded border"
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={scanningReceipt}
                onClick={() => document.getElementById("receipt-upload")?.click()}
                className="flex-1"
              >
                {scanningReceipt ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Receipt
                  </>
                )}
              </Button>
            </div>

            <input id="receipt-upload" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Transaction Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "Income" | "Expenses") =>
                  setFormData({ ...formData, type: value, category: "" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Expenses">Expenses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Transaction Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories[formData.type].map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g. Rp 10,000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Method</Label>
              <Select value={formData.method} onValueChange={(value) => setFormData({ ...formData, method: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {methods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              💡 Tip: Upload a receipt photo to auto-fill details, or enter manually. You can always edit later.
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" disabled={loading || scanningReceipt} className="flex-1">
                {loading ? "Saving..." : "Save Transaction"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
