import { getDayIndex } from '../utils/getDayIndex'
import { MAP } from '../utils/classMap'

const modules = import.meta.glob(
  '../../../data/**/*.js'
)

export async function loadDailyQuiz(classLevel) {
  try {
    const folder =
      MAP[classLevel] || 'class11'

    const day = getDayIndex()

    const path =
      `../../../data/${folder}/day${day}.js`


    const importer = modules[path]

    if (!importer) {
      console.error('FILE NOT FOUND:', path)
      return []
    }

    const module = await importer()


    return module.QUESTIONS || []
  } catch (err) {
    console.error('QUIZ LOAD ERROR:', err)

    return []
  }
}
