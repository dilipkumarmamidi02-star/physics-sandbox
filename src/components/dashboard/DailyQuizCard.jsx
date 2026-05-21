import { Link } from 'react-router-dom'

export default function DailyQuizCard() {
  return (
    <Link to="/quiz">

      <div
        className="
        bg-cyan-500/10
        border
        border-cyan-500/30
        rounded-2xl
        p-6
        hover:scale-[1.02]
        transition-all
        cursor-pointer
      "
      >
        <h2
          className="
          text-3xl
          font-bold
          text-cyan-400
        "
        >
          Daily Quiz
        </h2>

        <p className="text-gray-300 mt-2">
          10 new questions every day
        </p>
      </div>

    </Link>
  )
}
