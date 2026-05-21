export default function StreakCard({
  streak = 0
}) {
  return (
    <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-orange-400">
        Daily Streak
      </h2>

      <p className="text-5xl font-bold mt-4">
        🔥 {streak}
      </p>
    </div>
  )
}
