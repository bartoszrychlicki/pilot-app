const STORAGE_KEY = 'pilot-counter'

export type CounterState = Readonly<{
  value: number
  sessionClicks: number
  sessionResets: number
}>

export type CounterStore = Readonly<{
  getState: () => CounterState
  subscribe: (listener: (state: CounterState) => void) => () => void
}>

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
): CounterStore {
  let state: CounterState = {
    value: 0,
    sessionClicks: 0,
    sessionResets: 0,
  }
  const listeners = new Set<(state: CounterState) => void>()

  const setCounter = (value: number, clicksDelta = 0, resetsDelta = 0) => {
    state = {
      value,
      sessionClicks: state.sessionClicks + clicksDelta,
      sessionResets: state.sessionResets + resetsDelta,
    }
    try {
      localStorage.setItem(STORAGE_KEY, String(state.value))
    } catch (error) {
      if (import.meta.env?.DEV) {
        console.warn('Failed to save the counter to localStorage.', error)
      }
    }
    element.textContent = `Licznik: ${state.value}`
    listeners.forEach((listener) => listener(state))
  }
  element.addEventListener('click', () => setCounter(state.value + 1, 1))
  resetElement.addEventListener('click', () => setCounter(0, 0, 1))
  setCounter(readStoredCounter())

  return {
    getState: () => state,
    subscribe: (listener) => {
      listeners.add(listener)
      listener(state)
      return () => listeners.delete(listener)
    },
  }
}
