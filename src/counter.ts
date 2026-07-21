const STORAGE_KEY = 'pilot-counter'

function readStoredCounter(): number {
  const storedCounter = localStorage.getItem(STORAGE_KEY)
  if (storedCounter === null) return 0

  const parsedCounter = parseInt(storedCounter, 10)
  return Number.isNaN(parsedCounter) ? 0 : parsedCounter
}

export function setupCounter(element: HTMLButtonElement, resetElement: HTMLButtonElement) {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    localStorage.setItem(STORAGE_KEY, String(counter))
    element.innerHTML = `Licznik: ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  resetElement.addEventListener('click', () => setCounter(0))
  setCounter(readStoredCounter())
}
