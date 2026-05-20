import { useState } from 'react'
import QuizCard from '../components/QuizCard'
import { useDailyQuiz } from '../hooks/useDailyQuiz'

export default function QuizHome() {
  const classLevel = 'Class 11'

  const { questions, loading } =
    useDailyQuiz(classLevel)

  const [answers, setAnswers] = useState({})

  function handleSelect(qid, opt) {
    setAnswers(prev => ({
      ...prev,
      [qid]: opt
    }))
  }

  function calculateScore() {
    let score = 0

    questions.forEach(q => {
      if (answers[q.id] === q.ans) {
        score += 10
      }
    })

    alert(`Score: ${score}`)
  }

  if (loading) {
    return (
      <div className="p-6">
        Loading Daily Quiz...
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        Daily Quiz
      </h1>

      <p className="mb-6 text-gray-600">
        10 new questions every day
      </p>

      {questions.map((q, index) => (
        <QuizCard
          key={q.id}
          question={q}
          index={index}
          selected={answers[q.id]}
          onSelect={(opt) =>
            handleSelect(q.id, opt)
          }
        />
      ))}

      <button
        onClick={calculateScore}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
      >
        Submit Quiz
      </button>
    </div>
  )
}
