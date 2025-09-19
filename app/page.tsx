"use client"

import { useAuth } from "@/lib/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { Dashboard } from "@/components/dashboard"
import { FirebaseSetupNotice } from "../components/firebase-setup-notice"

export default function Home() {
  const { firebaseConfigured, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!firebaseConfigured) {
    return <FirebaseSetupNotice />
  }

  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  )
}
