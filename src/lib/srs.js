export function createCardFromWord(word, kind = 'recognition') {
  const now = Date.now()

  return {
    id: `card_${word.id}_${kind}`,
    wordId: word.id,
    kind,
    state: 'new',
    due: now,
    intervalDays: 0,
    ease: 2.5,
    reps: 0,
    lapses: 0,
    createdAt: now,
  }
}

export function scheduleReview(card, rating = 3) {
  const safeCard = { ...card }
  const safeRating = Math.min(4, Math.max(1, Number(rating) || 3))

  const prevInterval = Number(safeCard.intervalDays) || 0
  const prevEase = Number(safeCard.ease) || 2.5

  let nextEase = prevEase
  let nextInterval = prevInterval

  if (safeRating >= 3) {
    nextEase = Math.max(1.3, prevEase + (safeRating - 3) * 0.2)
    nextInterval = prevInterval === 0
      ? (safeRating === 3 ? 1 : safeRating === 4 ? 3 : 0)
      : Math.round(prevInterval * nextEase)
  } else {
    nextEase = Math.max(1.3, prevEase - 0.2)
    nextInterval = 0
  }

  const nextCard = {
    ...safeCard,
    state: safeRating >= 3 ? 'review' : 'learning',
    intervalDays: nextInterval,
    ease: Number(nextEase.toFixed(2)),
    reps: Number(safeCard.reps || 0) + 1,
    lapses: Number(safeCard.lapses || 0) + (safeRating < 3 ? 1 : 0),
    due: Date.now() + nextInterval * 24 * 60 * 60 * 1000,
    lastReviewAt: Date.now(),
  }

  return nextCard
}

export function isMastered(card) {
  return Number(card?.intervalDays || 0) >= 21 && Number(card?.lapses || 0) === 0
}

export function isLeech(card) {
  return Number(card?.lapses || 0) >= 8
}
