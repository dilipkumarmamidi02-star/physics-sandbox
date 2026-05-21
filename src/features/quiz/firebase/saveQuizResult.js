import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function saveQuizResult(user, score) {
  if (!user?.id) return

  const profileRef = doc(db, "profiles", user.id)

  const profileSnap = await getDoc(profileRef)

  if (!profileSnap.exists()) {
    await setDoc(profileRef, {
      email: user.email || "",
      total_score: score,
      quizzes_attempted: 1,
      daily_streak: 1
    })

    return
  }

  await updateDoc(profileRef, {
    total_score: increment(score),
    quizzes_attempted: increment(1),
    daily_streak: increment(1)
  })
}
