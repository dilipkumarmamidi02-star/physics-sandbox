export default function QuizCard({
  question,
  index,
  selected,
  onSelect
}) {
  return (
    <div className="border rounded-xl p-5 mb-5 bg-white shadow">
      <h2 className="text-lg font-bold mb-4">
        Q{index + 1}. {question.q}
      </h2>

      <div className="space-y-3">
        {question.opts.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`w-full text-left border p-3 rounded-lg transition ${
              selected === i
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
