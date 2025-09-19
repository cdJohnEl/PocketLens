import { hasFirebaseConfig, getFirebaseDb } from "./firebase"

export interface Transaction {
  id?: string
  userId: string
  type: "Income" | "Expenses"
  category: string
  amount: number
  method: string
  date: string
  createdAt: Date
}

export const transactionService = {
  async addTransaction(transaction: Omit<Transaction, "id" | "createdAt">) {
    if (!hasFirebaseConfig) {
      throw new Error("Firebase not configured. Please add your Firebase environment variables.")
    }

    const db = getFirebaseDb()
    if (!db) {
      throw new Error("Firebase Firestore not initialized.")
    }

    try {
      const { collection, addDoc } = await import("firebase/firestore")
      const docRef = await addDoc(collection(db, "transactions"), {
        ...transaction,
        createdAt: new Date(),
      })
      return docRef.id
    } catch (error) {
      console.error("Error adding transaction:", error)
      throw error
    }
  },

  async getTransactions(userId: string) {
    if (!hasFirebaseConfig) {
      console.warn("Firebase not configured - returning empty transactions array")
      return []
    }

    const db = getFirebaseDb()
    if (!db) {
      console.warn("Firebase Firestore not initialized - returning empty transactions array")
      return []
    }

    try {
      const { collection, getDocs, query, where, orderBy } = await import("firebase/firestore")
      const q = query(collection(db, "transactions"), where("userId", "==", userId), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[]
    } catch (error) {
      console.error("Error getting transactions:", error)
      throw error
    }
  },

  async updateTransaction(id: string, updates: Partial<Transaction>) {
    if (!hasFirebaseConfig) {
      throw new Error("Firebase not configured. Please add your Firebase environment variables.")
    }

    const db = getFirebaseDb()
    if (!db) {
      throw new Error("Firebase Firestore not initialized.")
    }

    try {
      const { doc, updateDoc } = await import("firebase/firestore")
      await updateDoc(doc(db, "transactions", id), updates)
    } catch (error) {
      console.error("Error updating transaction:", error)
      throw error
    }
  },

  async deleteTransaction(id: string) {
    if (!hasFirebaseConfig) {
      throw new Error("Firebase not configured. Please add your Firebase environment variables.")
    }

    const db = getFirebaseDb()
    if (!db) {
      throw new Error("Firebase Firestore not initialized.")
    }

    try {
      const { doc, deleteDoc } = await import("firebase/firestore")
      await deleteDoc(doc(db, "transactions", id))
    } catch (error) {
      console.error("Error deleting transaction:", error)
      throw error
    }
  },
}
