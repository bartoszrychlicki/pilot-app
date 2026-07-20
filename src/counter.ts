export function setupCounter(element: HTMLButtonElement, resetElement: HTMLButtonElement) {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = `Count is ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  resetElement.addEventListener('click', () => setCounter(0))
  setCounter(0)
}
