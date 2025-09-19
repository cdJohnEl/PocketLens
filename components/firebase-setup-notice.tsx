"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Settings } from "lucide-react"

export function FirebaseSetupNotice() {
  const missingVars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <CardTitle className="text-xl">Firebase Setup Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            To use this finance tracking app, you need to configure Firebase environment variables.
          </p>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Required Environment Variables:
            </h3>
            <ul className="text-xs space-y-1 text-gray-600">
              {missingVars.map((varName) => (
                <li key={varName} className="font-mono">
                  {varName}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded border-l-4 border-blue-200">
            <strong>How to set up:</strong>
            <ol className="mt-1 space-y-1 list-decimal list-inside">
              <li>Go to Project Settings (gear icon in top right)</li>
              <li>Add the Firebase environment variables</li>
              <li>Get these values from your Firebase project console</li>
              <li>Refresh the page after adding them</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
