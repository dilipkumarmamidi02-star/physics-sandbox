import { useEffect, useState } from 'react'

import {
  doc,
  onSnapshot
} from 'firebase/firestore'

import { db } from '@/lib/firebase'

import { useAuth } from '@/lib/AuthContext'

export function useProfileStats() {
  const { user } = useAuth()

  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!user?.uid) return

    const ref = doc(
      db,
      'profiles',
      user.uid
    )

    const unsub = onSnapshot(ref, snap => {
      if (snap.exists()) {
        setProfile(snap.data())
      }
    })

    return () => unsub()
  }, [user])

  return profile
}
