import { useAuth } from '@/lib/AuthContext'

export default function Dashboard() {

  const { user } = useAuth()

  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">

      <h1 className="text-4xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-3">

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-lg">

          <h2 className="text-xl font-semibold text-slate-300">
            Daily Streak
          </h2>

          <p className="text-5xl mt-4 font-bold">
            🔥 {user?.streak || 0}
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-lg">

          <h2 className="text-xl font-semibold text-slate-300">
            Total Score
          </h2>

          <p className="text-5xl mt-4 font-bold text-green-400">
            {user?.totalScore || 0}
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-lg">

          <h2 className="text-xl font-semibold text-slate-300">
            Quizzes Attempted
          </h2>

          <p className="text-5xl mt-4 font-bold text-blue-400">
            {user?.quizzesAttempted || 0}
          </p>

        </div>

      </div>

    </div>

  )
}
