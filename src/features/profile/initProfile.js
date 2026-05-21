import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "firebase/firestore"

import { db } from "@/lib/firebase"

export async function initProfile(user) {

  if (!user?.uid) return

  const ref = doc(db, "profiles", user.uid)

  const snap = await getDoc(ref)

  if (!snap.exists()) {

    await setDoc(ref, {

      email: user.email || "",

      name:
        user.displayName ||
        "User",

      role: "student",

      provider:
        user.providerData?.[0]?.providerId ||
        "google",

      photoURL:
        user.photoURL || "",

      total_score: 0,

      quizzes_attempted: 0,

      daily_streak: 0,

      created_at:
        new Date().toISOString()
    })

    return
  }

  const data = snap.data()

  const updates = {}

  if (data.total_score === undefined)
    updates.total_score = 0

  if (data.quizzes_attempted === undefined)
    updates.quizzes_attempted = 0

  if (data.daily_streak === undefined)
    updates.daily_streak = 0

  if (Object.keys(updates).length > 0) {
    await updateDoc(ref, updates)
  }
}
