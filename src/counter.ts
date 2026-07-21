export function setupCounter(element: HTMLButtonElement, resetElement: HTMLButtonElement) {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
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
  setCounter(0)
}
