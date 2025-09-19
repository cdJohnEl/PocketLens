import type { FirebaseApp } from "firebase/app"
import type { Auth } from "firebase/auth"
import type { Firestore } from "firebase/firestore"

const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const hasFirebaseConfig = Object.values(requiredEnvVars).every(
  (value) => value && value.trim() !== "" && !value.includes("your-") && !value.includes("demo-"),
)

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value || value.trim() === "" || value.includes("your-") || value.includes("demo-"))
  .map(([key]) => {
    const envVarName = `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, "_$1").toUpperCase()}`
    return envVarName.replace("_A_P_I_", "_API_").replace("_I_D", "_ID")
  })

if (!hasFirebaseConfig) {
  console.warn("Firebase not initialized - missing environment variables:", missingVars.join(", "))
}


import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

if (hasFirebaseConfig) {
  try {
    const firebaseConfig = {
      apiKey: requiredEnvVars.apiKey!,
      authDomain: requiredEnvVars.authDomain!,
      projectId: requiredEnvVars.projectId!,
      storageBucket: requiredEnvVars.storageBucket!,
      messagingSenderId: requiredEnvVars.messagingSenderId!,
      appId: requiredEnvVars.appId!,
    }
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
    auth = getAuth(app)
    db = getFirestore(app)
    console.log("Firebase initialized successfully")
  } catch (error) {
    console.error("Firebase initialization error:", error)
    app = null
    auth = null
    db = null
  }
}

export const getFirebaseAuth = (): Auth | null => auth
export const getFirebaseDb = (): Firestore | null => db
export const getFirebaseApp = (): FirebaseApp | null => app

export { auth, db, app }
