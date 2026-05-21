import React from 'react'

export default function QuizCard({
  question,
  index,
  answers,
  setAnswers,
  reviewMode
}) {

  function chooseOption(i) {
    if (reviewMode) return

    setAnswers(prev => ({
      ...prev,
      [index]: i
    }))
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">

      <h2 className="text-2xl font-bold text-white mb-8">
        Q{index + 1}. {question.q}
      </h2>

      <div className="space-y-4">

        {question.opts.map((opt, i) => {

          const selected = answers[index] === i
          const correct = question.ans === i

          let styles =
            'border-zinc-700 bg-zinc-950 text-slate-300 hover:border-cyan-400'

          if (selected) {
            styles =
              'border-cyan-400 bg-cyan-500/20 text-cyan-300'
          }

          if (reviewMode && correct) {
            styles =
              'border-emerald-400 bg-emerald-500/20 text-emerald-300'
          }

          if (
            reviewMode &&
            selected &&
            !correct
          ) {
            styles =
              'border-red-400 bg-red-500/20 text-red-300'
          }

          return (
            <button
              key={i}
              onClick={() => chooseOption(i)}
              className={`
                w-full
                text-left
                px-6
                py-5
                rounded-2xl
                border
                transition-all
                duration-200
                font-medium
                ${styles}
              `}
            >
              {opt}
            </button>
          )
        })}

      </div>

      {reviewMode && (
        <div className="mt-8 p-5 rounded-2xl bg-zinc-950 border border-zinc-800">

          <h3 className="text-emerald-400 font-bold mb-2">
            Explanation
          </h3>

          <p className="text-slate-300">
            {question.exp}
          </p>

        </div>
      )}

    </div>
  )
}
