export function getRevisionKey(date) {
  return `phx_revision_${date}`
}

export function getRevisionCount(date) {
  const key = getRevisionKey(date)

  return Number(localStorage.getItem(key) || 0)
}

export function incrementRevisionCount(date) {
  const key = getRevisionKey(date)

  const current = getRevisionCount(date)

  localStorage.setItem(key, current + 1)
}

export function canRevise(date) {
  return getRevisionCount(date) < 10
}
