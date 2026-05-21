import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useDailyQuiz } from '../hooks/useDailyQuiz'
import {
  submitQuizAttempt,
  getLeaderboard
} from '../firebase/quizService'

export default function QuizHome() {
  const { userProfile, user } = useAuth()

  const {
    questions,
    loading
  } = useDailyQuiz(userProfile?.classLevel)

  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [leaderboard, setLeaderboard] = useState([])
  const [reviewCount, setReviewCount] = useState(0)

  const MAX_REVIEW = 10

  useEffect(() => {
    loadLeaderboard()
  }, [userProfile])

  async function loadLeaderboard() {
    if (!userProfile?.classLevel) return

    const data = await getLeaderboard(
      userProfile.classLevel
    )

    setLeaderboard(data)
  }

  function selectAnswer(qIndex, optIndex) {
    if (submitted) return

    setAnswers(prev => ({
      ...prev,
      [qIndex]: optIndex
    }))
  }

  async function handleSubmit() {
    if (!questions.length) return

    let correct = 0

    questions.forEach((q, i) => {
      if (answers[i] === q.ans) {
        correct++
      }
    })

    const finalScore = correct * 10

    setScore(finalScore)
    setSubmitted(true)

    await submitQuizAttempt({
      email: user.email,
      classLevel: userProfile?.classLevel || 'Class 11',
      score: finalScore,
      correct,
      totalQ: questions.length,
      answers
    })

    loadLeaderboard()
  }

  function handleReviewAgain() {
    if (reviewCount >= MAX_REVIEW) return

    setReviewCount(prev => prev + 1)
    setSubmitted(false)
  }

  if (loading) {
    return (
      <div className="text-white p-10">
        Loading Quiz...
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 text-white">
      <h1 className="text-4xl font-bold mb-2">
        Daily Physics Quiz
      </h1>

      <p className="text-slate-400 mb-8">
        10 new questions every day
      </p>

      <div className="space-y-6">
        {questions.map((q, i) => (
          <div
            key={q.id}
            className="bg-slate-900 border border-slate-700 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">
              Q{i + 1}. {q.q}
            </h2>

            <div className="grid gap-3">
              {q.opts.map((opt, j) => {
                const isCorrect = q.ans === j
                const isSelected = answers[i] === j

                return (
                  <button
                    key={j}
                    onClick={() => selectAnswer(i, j)}
                    className={`
                      text-left px-4 py-3 rounded-lg border transition-all
                      ${
                        isSelected
                          ? 'bg-cyan-600 border-cyan-400'
                          : 'bg-slate-800 border-slate-700 hover:border-cyan-500'
                      }
                      ${
                        submitted && isCorrect
                          ? '!bg-green-600 !border-green-400'
                          : ''
                      }
                      ${
                        submitted &&
                        isSelected &&
                        !isCorrect
                          ? '!bg-red-600 !border-red-400'
                          : ''
                      }
                    `}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>

            {submitted && (
              <div className="mt-4 p-4 rounded-lg bg-slate-800 border border-slate-700">
                <p className="text-green-400 font-semibold">
                  Correct Answer:
                  {' '}
                  {q.opts[q.ans]}
                </p>

                <p className="text-slate-300 mt-2">
                  {q.exp}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="mt-8 bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-xl font-bold"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="mt-8 space-y-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <h2 className="text-3xl font-bold text-green-400">
              Your Score: {score}
            </h2>

            <p className="text-slate-300 mt-2">
              Review Attempts:
              {' '}
              {reviewCount}/{MAX_REVIEW}
            </p>
          </div>

          {reviewCount < MAX_REVIEW && (
            <button
              onClick={handleReviewAgain}
              className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl font-bold"
            >
              Revise Quiz Again
            </button>
          )}
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">
          Leaderboard
        </h2>

        <div className="space-y-4">
          {leaderboard.map((item, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex justify-between"
            >
              <div>
                <span className="text-cyan-400 font-bold">
                  #{i + 1}
                </span>

                <span className="ml-4 text-white">
                  {item.email}
                </span>
              </div>

              <span className="text-yellow-400 font-bold">
                {item.score} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
