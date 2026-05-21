export default function ScoreCard({
  score = 0
}) {
  return (
    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-cyan-400">
        Total Score
      </h2>

      <p className="text-5xl font-bold mt-4">
        {score}
      </p>
    </div>
  )
}
