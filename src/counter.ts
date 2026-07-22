const STORAGE_KEY = 'pilot-counter'

function getClickNoun(count: number): string {
  if (count === 1) return 'kliknięcie'

  const lastDigit = count % 10
  const lastTwoDigits = count % 100
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return 'kliknięcia'
  }

  return 'kliknięć'
}

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
    getClickCount?: () => number
  },
) {
  let counter = 0
  let isDisposed = false
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
    const clickCount = callbacks?.getClickCount?.()
    const clickCountLabel =
      clickCount === undefined ? '' : ` (${clickCount} ${getClickNoun(clickCount)})`
    element.innerHTML = `Licznik: ${counter}${clickCountLabel}`
    resetElement.disabled = counter === 0
  }
  const increment = () => {
    element.classList.remove('counter--pulse')
    void element.offsetWidth
    element.classList.add('counter--pulse')
    // Update click stats first so getClickCount() renders the latest value.
    callbacks?.onIncrement?.()
    setCounter(counter + 1)
  }
  const reset = () => {
    setCounter(0)
    callbacks?.onReset?.()
  }
  const copy = () => {
    const clipboard = navigator.clipboard
    if (!clipboard) {
      if (import.meta.env?.DEV) {
        console.warn('Clipboard API is unavailable.')
      }
      return
    }

    clipboard
      .writeText(String(counter))
      .then(() => {
        if (isDisposed) return

        feedbackElement.textContent = 'Skopiowano!'
        if (feedbackTimeout !== undefined) clearTimeout(feedbackTimeout)
        feedbackTimeout = setTimeout(() => {
          feedbackElement.textContent = ''
          feedbackTimeout = undefined
        }, 2000)
      })
      .catch((error) => {
        if (import.meta.env?.DEV) {
          console.warn('Failed to copy the counter value.', error)
        }
      })
  }
  const handleAnimationEnd = () => element.classList.remove('counter--pulse')
  element.addEventListener('animationend', handleAnimationEnd)
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

  return () => {
    isDisposed = true
    if (feedbackTimeout !== undefined) {
      clearTimeout(feedbackTimeout)
      feedbackTimeout = undefined
    }
    element.removeEventListener('animationend', handleAnimationEnd)
    element.removeEventListener('click', increment)
    resetElement.removeEventListener('click', reset)
    copyElement.removeEventListener('click', copy)
    keyTarget.removeEventListener('keydown', handleKeydown)
  }
}
