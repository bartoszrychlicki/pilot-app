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
  keyTarget: EventTarget = document,
) {
  let counter = 0
  let copyFeedbackTimer: ReturnType<typeof setTimeout> | undefined
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
  const increment = () => {
    element.classList.remove('counter--pulse')
    void element.offsetWidth
    element.classList.add('counter--pulse')
    setCounter(counter + 1)
  }
  element.addEventListener('animationend', () => element.classList.remove('counter--pulse'))
  element.addEventListener('click', increment)
  resetElement.addEventListener('click', () => setCounter(0))
  copyElement.addEventListener('click', () => {
    navigator.clipboard
      .writeText(String(counter))
      .then(() => {
        feedbackElement.textContent = 'Skopiowano!'
        if (copyFeedbackTimer !== undefined) {
          clearTimeout(copyFeedbackTimer)
        }
        copyFeedbackTimer = setTimeout(() => {
          feedbackElement.textContent = ''
        }, 2000)
      })
      .catch((error) => {
        if (import.meta.env?.DEV) {
          console.warn('Failed to copy the counter value.', error)
        }
      })
  })
  const handleKeydown = (event: Event) => {
    const keyboardEvent = event as KeyboardEvent
    const target = keyboardEvent.target as HTMLElement | null

    if (keyboardEvent.ctrlKey || keyboardEvent.metaKey || keyboardEvent.altKey) {
      return
    }

    if (
      target?.tagName === 'INPUT' ||
      target?.tagName === 'TEXTAREA' ||
      target?.isContentEditable === true
    ) {
      return
    }

    if (keyboardEvent.key === '+' || keyboardEvent.key === '=') {
      keyboardEvent.preventDefault()
      increment()
    } else if (keyboardEvent.key === 'r' || keyboardEvent.key === 'R') {
      keyboardEvent.preventDefault()
      setCounter(0)
    }
  }
  keyTarget.addEventListener('keydown', handleKeydown)
  setCounter(readStoredCounter())

  return () => keyTarget.removeEventListener('keydown', handleKeydown)
}
