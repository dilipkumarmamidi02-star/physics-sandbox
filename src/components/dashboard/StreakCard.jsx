import {
  Flame
} from 'lucide-react'

export default function StreakCard({
  streak
}) {
  return (
    <div
      className="
      bg-orange-500/10
      border
      border-orange-500/30
      rounded-2xl
      p-6
    "
    >
      <div className="flex items-center gap-4">
        <Flame
          className="text-orange-400"
          size={40}
        />

        <div>
          <p className="text-gray-400">
            Current Streak
          </p>

          <h2
            className="
            text-4xl
            font-bold
            text-orange-400
          "
          >
            {streak || 0} Days
          </h2>
        </div>
      </div>
    </div>
  )
}
