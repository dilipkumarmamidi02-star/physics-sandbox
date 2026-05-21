import { useEffect, useState } from 'react'
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/AuthContext'
import { loadDailyQuiz } from '../engine/loadDailyQuiz'

export function useDailyQuiz() {
  const { user } = useAuth()

  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [score, setScore] = useState(null)
  const [alreadyAttempted, setAlreadyAttempted] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    async function init() {
      if (!user) return

      const todayKey =
        'quiz_attempted_' + new Date().toDateString()

      const already = localStorage.getItem(todayKey)

      if (already) {
        setAlreadyAttempted(true)
      }

      const data = await loadDailyQuiz('class11')

      setQuestions(data)

      const snap = await getDocs(
        collection(db, 'quiz_attempts')
      )

      const board = snap.docs
        .map(doc => doc.data())
        .sort((a, b) => b.score - a.score)

      setLeaderboard(board)
    }

    init()
  }, [user])

  function selectAnswer(index, value) {
    setAnswers(prev => ({
      ...prev,
      [index]: value
    }))
  }

  async function submitQuiz() {
    if (!user) return

    if (alreadyAttempted) return

    let total = 0

    questions.forEach((q, i) => {
      if (answers[i] === q.answer) {
        total += 10
      }
    })

    setScore(total)

    await addDoc(collection(db, 'quiz_attempts'), {
      uid: user.id,
      name: user.name || user.email,
      email: user.email,
      score: total,
      class: user.role || 'student',
      created_at: new Date().toISOString(),
      day: new Date().toDateString()
    })

    localStorage.setItem(
      'quiz_attempted_' + new Date().toDateString(),
      'yes'
    )

    setAlreadyAttempted(true)
  }

  return {
    questions,
    answers,
    score,
    alreadyAttempted,
    leaderboard,
    selectAnswer,
    submitQuiz
  }
}
