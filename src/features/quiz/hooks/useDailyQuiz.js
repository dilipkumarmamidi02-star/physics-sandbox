import { useEffect, useState } from 'react'

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  doc,
  updateDoc,
  increment
} from 'firebase/firestore'

import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/AuthContext'
import { loadDailyQuiz } from '../engine/loadDailyQuiz'

export function useDailyQuiz() {

  const auth = useAuth()
  const user = auth?.user

  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [score, setScore] = useState(null)
  const [alreadyPlayed, setAlreadyPlayed] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])

  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    loadQuiz()
    checkAttempt()
    loadLeaderboard()
  }, [])

  async function loadQuiz() {
    const q = await loadDailyQuiz('class11')
    setQuestions(q)
  }

  async function checkAttempt() {

    if (!user) return

    const q = query(
      collection(db, 'quiz_attempts'),
      where('userId', '==', user.id),
      where('date', '==', today)
    )

    const snap = await getDocs(q)

    if (!snap.empty) {
      setAlreadyPlayed(true)
      setScore(snap.docs[0].data().score)
    }
  }

  async function loadLeaderboard() {

    const q = query(
      collection(db, 'quiz_attempts'),
      orderBy('score', 'desc'),
      limit(10)
    )

    const snap = await getDocs(q)

    setLeaderboard(
      snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    )
  }

  function selectAnswer(index, value) {

    setAnswers(prev => ({
      ...prev,
      [index]: value
    }))
  }

  async function submitQuiz() {

    if (!user) return

    let total = 0

    questions.forEach((q, index) => {

      if (answers[index] === q.answer) {
        total += 10
      }

    })

    setScore(total)

    await addDoc(collection(db, 'quiz_attempts'), {
      userId: user.id,
      email: user.email,
      score: total,
      date: today,
      created_at: new Date().toISOString()
    })

    await updateDoc(
      doc(db, 'profiles', user.id),
      {
        totalScore: increment(total),
        quizzesAttempted: increment(1)
      }
    )

    setAlreadyPlayed(true)

    loadLeaderboard()
  }

  return {
    questions,
    answers,
    score,
    leaderboard,
    alreadyPlayed,
    selectAnswer,
    submitQuiz
  }
}
