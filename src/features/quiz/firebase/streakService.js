import {
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore'

import { db } from '@/lib/firebase'

export async function updateStreak(userId) {

  const ref = doc(db, 'profiles', userId)

  const snap = await getDoc(ref)

  if (!snap.exists()) return

  const data = snap.data()

  const streak = data.streak || 0
  const lastQuizDate = data.lastQuizDate || null

  const today = new Date()
  const todayString = today.toISOString().slice(0, 10)

  if (lastQuizDate === todayString) {
    return
  }

  let nextStreak = streak + 1

  await updateDoc(ref, {
    streak: nextStreak,
    lastQuizDate: todayString
  })
}
