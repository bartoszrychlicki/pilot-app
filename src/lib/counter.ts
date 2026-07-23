export const STORAGE_KEY = 'pilot-counter'

export function getClickNoun(count: number): string {
  if (count === 1) return 'kliknięcie'

  const lastDigit = count % 10
  const lastTwoDigits = count % 100
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return 'kliknięcia'
  }

  return 'kliknięć'
}

export function readStoredCounter(storedCounter: string | null): number {
  if (storedCounter === null || !/^\d+$/.test(storedCounter)) return 0

  const parsedCounter = Number(storedCounter)
  return Number.isInteger(parsedCounter) && parsedCounter >= 0 ? parsedCounter : 0
}
