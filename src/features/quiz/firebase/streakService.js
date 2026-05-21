import {
  doc,
  getDoc,
  updateDoc,
  increment
} from 'firebase/firestore'

import { db } from '@/lib/firebase'

function today() {
  return new Date()
    .toISOString()
    .slice(0, 10)
}

function yesterday() {
  return new Date(
    Date.now() - 86400000
  )
    .toISOString()
    .slice(0, 10)
}

export async function updateUserStreak(uid) {
  try {
    const ref = doc(db, 'profiles', uid)

    const snap = await getDoc(ref)

    if (!snap.exists()) return

    const user = snap.data()

    let streak = 1

    if (
      user.lastQuizDate === yesterday()
    ) {
      streak = (user.streak || 0) + 1
    }

    if (
      user.lastQuizDate === today()
    ) {
      return
    }

    await updateDoc(ref, {
      streak,
      lastQuizDate: today(),
      quizzesAttempted: increment(1)
    })

  } catch (err) {
    console.error('STREAK ERROR:', err)
  }
}
