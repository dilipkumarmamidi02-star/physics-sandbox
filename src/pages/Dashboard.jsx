import { useEffect, useState } from "react"

import { useAuth } from "@/lib/AuthContext"

import {
  doc,
  getDoc
} from "firebase/firestore"

import { db } from "@/lib/firebase"

export default function Dashboard() {

  const { user } = useAuth()

  const [stats, setStats] = useState({
    daily_streak: 0,
    total_score: 0,
    quizzes_attempted: 0
  })

  useEffect(() => {

    async function load() {

      if (!user?.id) return

      const ref = doc(
        db,
        "profiles",
        user.id
      )

      const snap = await getDoc(ref)

      if (!snap.exists()) return

      const data = snap.data()

      setStats({
        daily_streak:
          data.daily_streak || 0,

        total_score:
          data.total_score || 0,

        quizzes_attempted:
          data.quizzes_attempted || 0
      })
    }

    load()

  }, [user])

  return (

    <div className="p-6 text-white">

      <h1 className="text-3xl mb-6">
        Dashboard
      </h1>

      <div className="space-y-4">

        <div className="bg-zinc-800 p-5 rounded">

          <div className="text-lg">
            Daily Streak
          </div>

          <div className="text-3xl">
            🔥 {stats.daily_streak}
          </div>

        </div>

        <div className="bg-zinc-800 p-5 rounded">

          <div className="text-lg">
            Total Score
          </div>

          <div className="text-3xl">
            {stats.total_score}
          </div>

        </div>

        <div className="bg-zinc-800 p-5 rounded">

          <div className="text-lg">
            Quizzes Attempted
          </div>

          <div className="text-3xl">
            {stats.quizzes_attempted}
          </div>

        </div>

      </div>

    </div>
  )
}
