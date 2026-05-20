import { useEffect, useState } from 'react'
import { loadDailyQuiz } from '../engine/loadDailyQuiz'

export function useDailyQuiz(classLevel) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const data = await loadDailyQuiz(classLevel)
        setQuestions(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (classLevel) {
      fetchQuiz()
    }
  }, [classLevel])

  return {
    questions,
    loading
  }
}
