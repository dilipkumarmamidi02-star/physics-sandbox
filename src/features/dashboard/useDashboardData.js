import { useEffect, useState } from "react"

import {
  doc,
  onSnapshot
} from "firebase/firestore"

import { db } from "@/lib/firebase"

import { useAuth } from "@/lib/AuthContext"

export function useDashboardData() {

  const { user } = useAuth()

  const [stats, setStats] = useState({
    streak: 0,
    totalScore: 0,
    quizzesAttempted: 0
  })

  useEffect(() => {

    if (!user?.id) return

    const ref = doc(
      db,
      "profiles",
      user.id
    )

    const unsub = onSnapshot(
      ref,
      (snap) => {

        if (!snap.exists()) return

        const data = snap.data()

        console.log(data)

        setStats({
          streak:
            data.daily_streak || 0,

          totalScore:
            data.total_score || 0,

          quizzesAttempted:
            data.quizzes_attempted || 0
        })
      }
    )

    return () => unsub()

  }, [user])

  return stats
}
