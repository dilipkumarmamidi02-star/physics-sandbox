export const CLASS_MAP = {
  'Class 11': 'class11',
  'Class 12': 'class12',
  'B.Tech': 'btech'
}

export function getTodayString() {
  return new Date().toISOString().slice(0, 10)
}

export function getDayIndex() {
  const START_DATE = new Date('2025-01-01')
  const now = new Date()

  const diff = Math.floor(
    (now - START_DATE) /
    (1000 * 60 * 60 * 24)
  )

  return (diff % 365) + 1
}

export async function loadDailyQuestions(classLevel) {
  const folder =
    CLASS_MAP[classLevel] || 'class11'

  const day = getDayIndex()

  try {
    const module = await import(
      `../data/${folder}/day${day}.js`
    )

    return module.QUESTIONS || []

  } catch (err) {

    console.warn(
      `Missing day${day}.js → loading fallback`
    )

    const fallback = await import(
      `../data/${folder}/day1.js`
    )

    return fallback.QUESTIONS || []
  }
}
