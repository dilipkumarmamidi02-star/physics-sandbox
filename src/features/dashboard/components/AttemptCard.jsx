export default function AttemptCard({
  attempts = 0
}) {
  return (
    <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-purple-400">
        Quizzes Attempted
      </h2>

      <p className="text-5xl font-bold mt-4">
        {attempts}
      </p>
    </div>
  )
}
