export function getDayIndex() {
  const start = new Date('2025-01-01')
  const now = new Date()

  const diff = Math.floor(
    (now - start) / (1000 * 60 * 60 * 24)
  )

  return (diff % 365) + 1
}
