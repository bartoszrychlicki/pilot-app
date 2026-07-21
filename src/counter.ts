export function setupCounter(
  element: HTMLButtonElement,
  resetElement: HTMLButtonElement,
  decrementElement: HTMLButtonElement,
) {
  let counter = 0
  const setCounter = (count: number, shouldPulse = true) => {
    counter = count
    element.textContent = `Licznik: ${counter}`
    if (!shouldPulse) return

    element.classList.remove('pulse')
    void element.offsetWidth
    element.classList.add('pulse')
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  decrementElement.addEventListener('click', () => setCounter(Math.max(0, counter - 1)))
  resetElement.addEventListener('click', () => setCounter(0))
  setCounter(0, false)
}
