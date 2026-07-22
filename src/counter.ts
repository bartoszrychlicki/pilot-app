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
  callbacks?: {
    onIncrement?: () => void
    onReset?: () => void
  },
) {
  let counter = 0
  let feedbackTimeout: ReturnType<typeof setTimeout> | undefined
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
    callbacks?.onIncrement?.()
  }
  const reset = () => {
    setCounter(0)
    callbacks?.onReset?.()
  }
  const copy = () => {
    navigator.clipboard
      .writeText(String(counter))
      .then(() => {
        feedbackElement.textContent = 'Skopiowano!'
        if (feedbackTimeout !== undefined) clearTimeout(feedbackTimeout)
        feedbackTimeout = setTimeout(() => {
          feedbackElement.textContent = ''
        }, 2000)
      })
      .catch((error) => {
        if (import.meta.env?.DEV) {
          console.warn('Failed to copy the counter value.', error)
        }
      })
  }
  element.addEventListener('animationend', () => element.classList.remove('counter--pulse'))
  element.addEventListener('click', increment)
  resetElement.addEventListener('click', reset)
  copyElement.addEventListener('click', copy)
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
      reset()
    }
  }
  keyTarget.addEventListener('keydown', handleKeydown)
  setCounter(readStoredCounter())

  return () => keyTarget.removeEventListener('keydown', handleKeydown)
}
