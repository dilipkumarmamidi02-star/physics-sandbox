export async function loadDailyQuiz(userClass = 'class11') {
  const day = new Date().getDate()

  const path = `../../../data/${userClass}/day${day}.js`

  try {
    const module = await import(path)

    return module.QUESTIONS || []
  } catch (err) {
    console.error('Quiz load error:', err)

    return []
  }
}
