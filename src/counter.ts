const STORAGE_KEY = 'pilot-counter'

function readStoredCounter(): number {
  try {
    const storedCounter = localStorage.getItem(STORAGE_KEY)
    if (storedCounter === null) return 0
    if (!/^\d+$/.test(storedCounter)) return 0

    const parsedCounter = Number(storedCounter)
    return Number.isInteger(parsedCounter) && parsedCounter >= 0 ? parsedCounter : 0
  } catch {
    return 0
  }
}

export function setupCounter(
  element: HTMLButtonElement,
  resetElement: HTMLButtonElement,
  copyElement: HTMLButtonElement,
  feedbackElement: HTMLElement,
) {
  let counter = 0
  let feedbackTimer: ReturnType<typeof setTimeout> | undefined
  const showFeedback = (message: string) => {
    feedbackElement.textContent = message
    if (feedbackTimer !== undefined) clearTimeout(feedbackTimer)
    feedbackTimer = setTimeout(() => {
      feedbackElement.textContent = ''
    }, 2000)
  }
  const setCounter = (count: number) => {
    counter = count
    try {
      localStorage.setItem(STORAGE_KEY, String(counter))
    } catch (error) {
      if (import.meta.env?.DEV) {
        console.warn('Failed to save the counter to localStorage.', error)
      }
    }
    element.innerHTML = `Licznik: ${counter}`
    resetElement.disabled = counter === 0
  }
  element.addEventListener('animationend', () => element.classList.remove('counter--pulse'))
  element.addEventListener('click', () => {
    element.classList.remove('counter--pulse')
    void element.offsetWidth
    element.classList.add('counter--pulse')
    setCounter(counter + 1)
  })
  resetElement.addEventListener('click', () => setCounter(0))
  copyElement.addEventListener('click', () => {
    navigator.clipboard
      .writeText(String(counter))
      .then(() => {
        showFeedback('Skopiowano!')
      })
      .catch((error) => {
        showFeedback('Nie udało się skopiować.')
        if (import.meta.env?.DEV) {
          console.warn('Failed to copy the counter value.', error)
        }
      })
  })
  setCounter(readStoredCounter())
}
