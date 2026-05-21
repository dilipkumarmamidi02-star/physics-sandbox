import Navbar from '@/components/Navbar'

import {
  useProfileStats
} from '@/features/dashboard/hooks/useProfileStats'

import StreakCard from '@/features/dashboard/components/StreakCard'

import ScoreCard from '@/features/dashboard/components/ScoreCard'

import AttemptCard from '@/features/dashboard/components/AttemptCard'

export default function Dashboard() {
  const profile = useProfileStats()

  return (
    <div className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="p-8">

        <h1 className="text-5xl font-bold mb-10">
          Dashboard
        </h1>

        <div className="grid md:grid-cols-3 gap-6">

          <StreakCard
            streak={profile?.streak || 0}
          />

          <ScoreCard
            score={profile?.totalScore || 0}
          />

          <AttemptCard
            attempts={profile?.quizzesAttempted || 0}
          />

        </div>

      </div>

    </div>
  )
}
