"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { DashboardContent } from "./dashboard-content"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6">
        <DashboardContent activeTab={activeTab} />
      </main>
    </div>
  )
}
