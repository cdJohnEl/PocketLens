"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { hasFirebaseConfig, getFirebaseAuth } from "./firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  firebaseConfigured: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [firebaseConfigured] = useState(hasFirebaseConfig)

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false)
      return
    }

    const setupAuthListener = async () => {
      try {
        // Wait a bit for Firebase to initialize
        await new Promise((resolve) => setTimeout(resolve, 100))

        const auth = getFirebaseAuth()
        if (!auth) {
          setLoading(false)
          return
        }

        const { onAuthStateChanged } = await import("firebase/auth")
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user)
          setLoading(false)
        })

        return unsubscribe
      } catch (error) {
        console.error("Error setting up auth listener:", error)
        setLoading(false)
      }
    }

    const cleanup = setupAuthListener()
    return () => {
      cleanup.then((unsubscribe) => unsubscribe?.())
    }
  }, [firebaseConfigured])

  const signIn = async (email: string, password: string) => {
    if (!firebaseConfigured) {
      throw new Error("Firebase not configured. Please add your Firebase environment variables.")
    }

    const auth = getFirebaseAuth()
    if (!auth) {
      throw new Error("Firebase auth not initialized.")
    }

    const { signInWithEmailAndPassword } = await import("firebase/auth")
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string) => {
    if (!firebaseConfigured) {
      throw new Error("Firebase not configured. Please add your Firebase environment variables.")
    }

    const auth = getFirebaseAuth()
    if (!auth) {
      throw new Error("Firebase auth not initialized.")
    }

    const { createUserWithEmailAndPassword } = await import("firebase/auth")
    await createUserWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    if (!firebaseConfigured) {
      throw new Error("Firebase not configured. Please add your Firebase environment variables.")
    }

    const auth = getFirebaseAuth()
    if (!auth) {
      throw new Error("Firebase auth not initialized.")
    }

    const { signOut } = await import("firebase/auth")
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logout, firebaseConfigured }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
