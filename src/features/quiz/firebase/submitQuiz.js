import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment
} from "firebase/firestore"

import { db } from "@/lib/firebase"

export async function submitQuiz({
  user,
  score
}) {

  if (!user?.id) {
    throw new Error("No user")
  }

  const today =
    new Date()
      .toISOString()
      .split("T")[0]

  const attemptId =
    user.id + "_" + today

  const attemptRef = doc(
    db,
    "quiz_attempts",
    attemptId
  )

  const profileRef = doc(
    db,
    "profiles",
    user.id
  )

  const existing =
    await getDoc(attemptRef)

  if (existing.exists()) {

    return {
      alreadyAttempted: true
    }
  }

  await setDoc(attemptRef, {

    userId: user.id,

    email: user.email,

    score,

    created_at:
      new Date().toISOString()
  })

  await updateDoc(profileRef, {

    total_score:
      increment(score),

    quizzes_attempted:
      increment(1),

    daily_streak:
      increment(1)
  })

  return {
    success: true
  }
}
