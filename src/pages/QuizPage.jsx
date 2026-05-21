import { useEffect, useState }
from 'react'

import { useDailyQuiz }
from '@/features/quiz/hooks/useDailyQuiz'

import {
  submitQuizAttempt,
  getLeaderboard,
  hasAttemptedToday
} from '@/features/quiz/firebase/quizService'

import {
  useAuth
} from '@/lib/AuthContext'

export default function QuizPage() {

  const { user } = useAuth()

  const {
    questions,
    loading
  } = useDailyQuiz('Class 11')

  const [answers, setAnswers] =
    useState({})

  const [submitted, setSubmitted] =
    useState(false)

  const [score, setScore] =
    useState(0)

  const [leaderboard, setLeaderboard] =
    useState([])

  const [alreadyAttempted,
    setAlreadyAttempted] =
    useState(false)

  useEffect(() => {

    async function loadData() {

      const board =
        await getLeaderboard(
          'Class 11'
        )

      setLeaderboard(board)

      if (user?.email) {

        const attempted =
          await hasAttemptedToday(
            user.email
          )

        setAlreadyAttempted(
          attempted
        )

        setSubmitted(
          attempted
        )
      }
    }

    loadData()

  }, [user])

  async function handleSubmit() {

    if (alreadyAttempted) {
      alert(
        'Already attempted today'
      )
      return
    }

    let correct = 0

    questions.forEach(q => {

      if (
        answers[q.id] === q.ans
      ) {
        correct++
      }

    })

    const finalScore =
      correct * 10

    setScore(finalScore)

    try {

      await submitQuizAttempt({

        email: user.email,

        classLevel: 'Class 11',

        score: finalScore,

        correct,

        totalQ: questions.length,

        answers

      })

      setSubmitted(true)

      setAlreadyAttempted(true)

      const board =
        await getLeaderboard(
          'Class 11'
        )

      setLeaderboard(board)

    } catch (err) {

      alert(err.message)

    }
  }

  if (loading) {

    return (
      <div className="p-10 text-white">
        Loading...
      </div>
    )
  }

  return (

    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold mb-3">
        Daily Physics Quiz
      </h1>

      <p className="text-zinc-400 mb-10">
        10 new questions every day
      </p>

      {alreadyAttempted && (
        <div className="mb-8 bg-yellow-500/20 border border-yellow-500 rounded-2xl p-5 text-yellow-300">
          You already attempted today's quiz
        </div>
      )}

      <div className="space-y-8">

        {questions.map((q, index) => (

          <div
            key={q.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
          >

            <h2 className="text-2xl font-bold mb-6">
              {index + 1}. {q.q}
            </h2>

            <div className="space-y-3">

              {q.opts.map((opt, i) => (

                <button
                  key={i}

                  disabled={submitted}

                  onClick={() =>
                    setAnswers({
                      ...answers,
                      [q.id]: i
                    })
                  }

                  className={`
                    w-full
                    text-left
                    px-5
                    py-4
                    rounded-xl
                    border

                    ${
                      answers[q.id] === i
                        ? 'bg-cyan-500 text-black border-cyan-400'
                        : 'bg-zinc-950 border-zinc-700'
                    }
                  `}
                >
                  {opt}
                </button>

              ))}

            </div>

          </div>

        ))}

      </div>

      {!submitted && (

        <button
          onClick={handleSubmit}
          className="mt-10 bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-2xl font-bold"
        >
          Submit Quiz
        </button>

      )}

      {submitted && (

        <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

          <h2 className="text-4xl font-bold text-green-400">
            Your Score: {score}
          </h2>

        </div>

      )}

      <div className="mt-16">

        <h2 className="text-4xl font-bold mb-6">
          Leaderboard
        </h2>

        <div className="space-y-4">

          {leaderboard.map((item, index) => (

            <div
              key={index}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex justify-between"
            >

              <div>
                #{index + 1}
                {' '}
                {item.email}
              </div>

              <div className="text-cyan-400 font-bold">
                {item.score} pts
              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}
