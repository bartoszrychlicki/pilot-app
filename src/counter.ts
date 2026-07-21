const STORAGE_KEY = 'pilot-counter'

function readStoredCounter(): number {
  try {
    const storedCounter = localStorage.getItem(STORAGE_KEY)
    if (storedCounter === null) return 0

    const parsedCounter = Number(storedCounter)
    return Number.isInteger(parsedCounter) && parsedCounter >= 0 ? parsedCounter : 0
  } catch {
    return 0
  }
}

export function setupCounter(element: HTMLButtonElement, resetElement: HTMLButtonElement) {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    try {
      localStorage.setItem(STORAGE_KEY, String(counter))
    } catch {
      // The counter remains usable when storage is unavailable.
    }
    element.innerHTML = `Licznik: ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  resetElement.addEventListener('click', () => setCounter(0))
  setCounter(readStoredCounter())
}
