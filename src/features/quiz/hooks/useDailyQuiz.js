import { useEffect, useState } from "react"

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment
} from "firebase/firestore"

import { db } from "@/lib/firebase"

import { useAuth } from "@/lib/AuthContext"

import { loadDailyQuiz } from "../engine/loadDailyQuiz"

export function useDailyQuiz() {

  const { user } = useAuth()

  const [questions, setQuestions] = useState([])

  const [answers, setAnswers] = useState({})

  const [score, setScore] = useState(null)

  const [alreadyAttempted, setAlreadyAttempted] =
    useState(false)

  useEffect(() => {

    async function loadQuiz() {

      const q =
        await loadDailyQuiz("class11")

      setQuestions(q)
    }

    loadQuiz()

  }, [])

  async function submitQuiz() {

    if (!user?.id) return

    let total = 0

    questions.forEach((q, i) => {

      if (
        answers[i] === q.answer
      ) {
        total += 10
      }
    })

    setScore(total)

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

    const existing =
      await getDoc(attemptRef)

    if (existing.exists()) {

      setAlreadyAttempted(true)

      return
    }

    await setDoc(attemptRef, {

      email: user.email,

      score: total,

      created_at:
        new Date().toISOString()
    })

    const profileRef = doc(
      db,
      "profiles",
      user.id
    )

    await updateDoc(profileRef, {

      total_score:
        increment(total),

      quizzes_attempted:
        increment(1),

      daily_streak:
        increment(1)
    })

    window.location.reload()
  }

  return {

    questions,

    answers,

    setAnswers,

    submitQuiz,

    score,

    alreadyAttempted
  }
}
