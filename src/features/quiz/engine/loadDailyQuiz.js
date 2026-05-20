import { getDayIndex } from '../utils/getDayIndex'
import { MAP } from '../utils/classMap'

export async function loadDailyQuiz(classLevel) {
  const folder = MAP[classLevel]

  const dayIndex = getDayIndex()

  try {
    const module = await import(
      `../../../data/${folder}/day${dayIndex}.js`
    )

    return module.QUESTIONS
  } catch (err) {
    console.error('Quiz loading failed:', err)
    return []
  }
}
