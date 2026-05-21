import {
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore'

import { db } from '@/lib/firebase'

export async function initProfile(user) {

  if (!user?.uid) return

  const ref = doc(
    db,
    'profiles',
    user.uid
  )

  const snap =
    await getDoc(ref)

  if (snap.exists()) return

  await setDoc(ref, {

    email:
      user.email || '',

    name:
      user.displayName ||
      user.email?.split('@')[0] ||
      'User',

    role: 'student',

    phone:
      user.phoneNumber || '',

    photoURL:
      user.photoURL || '',

    provider:
      user.providerData?.[0]?.providerId ||
      'unknown',

    streak: 0,

    totalScore: 0,

    quizzesAttempted: 0,

    created_at:
      new Date().toISOString()

  })
}
