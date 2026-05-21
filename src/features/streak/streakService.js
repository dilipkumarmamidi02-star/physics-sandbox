import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment
} from 'firebase/firestore'

import { db } from '@/lib/firebase'

function today() {
  return new Date().toISOString().slice(0, 10)
}

function yesterday() {
  const d = new Date()

  d.setDate(d.getDate() - 1)

  return d.toISOString().slice(0, 10)
}

export async function updateStreak(uid) {
  const ref = doc(db, 'profiles', uid)

  const snap = await getDoc(ref)

  if (!snap.exists()) {
    await setDoc(ref, {
      streak: 1,
      lastQuizDate: today(),
      quizzesAttempted: 1,
      totalScore: 0
    })

    return 1
  }

  const data = snap.data()

  if (data.lastQuizDate === today()) {
    return data.streak || 1
  }

  if (data.lastQuizDate === yesterday()) {
    await updateDoc(ref, {
      streak: increment(1),
      lastQuizDate: today()
    })

    return (data.streak || 1) + 1
  }

  await updateDoc(ref, {
    streak: 1,
    lastQuizDate: today()
  })

  return 1
}
