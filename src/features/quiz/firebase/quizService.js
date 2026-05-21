import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where
} from 'firebase/firestore'

import { db } from '@/lib/firebase'

function today() {
  return new Date()
    .toISOString()
    .slice(0, 10)
}

export async function hasAttemptedToday(
  email
) {

  const id =
    `${email}_${today()}`

  const snap =
    await getDoc(
      doc(
        db,
        'quiz_attempts',
        id
      )
    )

  return snap.exists()
}

export async function submitQuizAttempt({
  email,
  classLevel,
  score,
  correct,
  totalQ,
  answers
}) {

  const id =
    `${email}_${today()}`

  const existing =
    await getDoc(
      doc(
        db,
        'quiz_attempts',
        id
      )
    )

  if (existing.exists()) {
    throw new Error(
      'Already attempted today'
    )
  }

  await setDoc(
    doc(
      db,
      'quiz_attempts',
      id
    ),
    {
      email,
      classLevel,
      score,
      correct,
      totalQ,
      answers,
      createdAt:
        serverTimestamp(),
      date: today()
    }
  )
}

export async function getLeaderboard(
  classLevel
) {

  const q = query(

    collection(
      db,
      'quiz_attempts'
    ),

    where(
      'classLevel',
      '==',
      classLevel
    ),

    orderBy(
      'score',
      'desc'
    ),

    limit(10)
  )

  const snapshot =
    await getDocs(q)

  return snapshot.docs.map(
    doc => doc.data()
  )
}
