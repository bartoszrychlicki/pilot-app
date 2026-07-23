import { useCallback, useEffect, useRef, useState } from 'react'
import { Badge, Card } from '@/components/br/primitives'
import { Button } from '@/components/ui/button'
import { getClickNoun, readStoredCounter, STORAGE_KEY } from '@/lib/counter'

interface CounterCardProps {
  clickCount?: number
  onIncrement?: () => void
  onReset?: () => void
}

function readInitialCounter(): number {
  try {
    return readStoredCounter(localStorage.getItem(STORAGE_KEY))
  } catch {
    return 0
  }
}

function copyWithLegacyApi(value: string): boolean {
  if (typeof document.execCommand !== 'function') return false

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.append(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  textarea.remove()
  return copied
}

export function CounterCard({ clickCount, onIncrement, onReset }: CounterCardProps) {
  const [counter, setCounter] = useState(readInitialCounter)
  const [feedback, setFeedback] = useState('')
  const counterButtonRef = useRef<HTMLButtonElement>(null)
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(counter))
    } catch {
      // The counter remains usable when storage is unavailable.
    }
  }, [counter])

  useEffect(
    () => () => {
      if (feedbackTimeoutRef.current !== undefined) {
        clearTimeout(feedbackTimeoutRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    const element = counterButtonRef.current
    if (element === null) return
    const handleAnimationEnd = () => element.classList.remove('counter--pulse')
    element.addEventListener('animationend', handleAnimationEnd)
    return () => element.removeEventListener('animationend', handleAnimationEnd)
  }, [])

  const pulse = useCallback(() => {
    const element = counterButtonRef.current
    if (element === null) return
    element.classList.remove('counter--pulse')
    void element.offsetWidth
    element.classList.add('counter--pulse')
  }, [])

  const increment = useCallback(() => {
    pulse()
    onIncrement?.()
    setCounter((value) => value + 1)
  }, [onIncrement, pulse])

  const decrement = useCallback(() => {
    setCounter((value) => Math.max(0, value - 1))
  }, [])

  const reset = useCallback(() => {
    setCounter(0)
    onReset?.()
  }, [onReset])

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (event.ctrlKey || event.metaKey || event.altKey) return
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable === true
      ) {
        return
      }

      if (event.key === '+' || event.key === '=') {
        event.preventDefault()
        increment()
      } else if (event.key === 'r' || event.key === 'R') {
        event.preventDefault()
        reset()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [increment, reset])

  const showFeedback = useCallback((message: string, clearAfterDelay: boolean) => {
    setFeedback(message)
    if (feedbackTimeoutRef.current !== undefined) {
      clearTimeout(feedbackTimeoutRef.current)
      feedbackTimeoutRef.current = undefined
    }
    if (clearAfterDelay) {
      feedbackTimeoutRef.current = setTimeout(() => {
        setFeedback('')
        feedbackTimeoutRef.current = undefined
      }, 2000)
    }
  }, [])

  const copy = useCallback(async () => {
    try {
      if (navigator.clipboard !== undefined) {
        await navigator.clipboard.writeText(String(counter))
      } else if (!copyWithLegacyApi(String(counter))) {
        throw new Error('Clipboard API is unavailable')
      }
      showFeedback('Skopiowano!', true)
    } catch {
      showFeedback('Nie udało się skopiować', false)
    }
  }, [counter, showFeedback])

  const clickCountLabel =
    clickCount === undefined ? '' : ` (${clickCount} ${getClickNoun(clickCount)})`

  return (
    <Card className="counter-card">
      <div className="counter-card__heading">
        <h3>Licznik</h3>
        <Badge variant="accent">localStorage</Badge>
      </div>
      <div className="counter-card__actions">
        <Button
          ref={counterButtonRef}
          type="button"
          className="counter-card__value"
          aria-live="polite"
          onClick={increment}
        >
          Licznik: {counter}
          {clickCountLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="counter-card__secondary"
          aria-label="Zmniejsz licznik o 1"
          disabled={counter === 0}
          onClick={decrement}
        >
          −1
        </Button>
        <Button
          type="button"
          variant="outline"
          className="counter-card__secondary"
          aria-label="Kopiuj wartość licznika"
          onClick={() => void copy()}
        >
          Kopiuj
        </Button>
        <Button
          type="button"
          variant="outline"
          className="counter-card__secondary"
          disabled={counter === 0}
          onClick={reset}
        >
          Reset
        </Button>
      </div>
      <p className="counter-card__hint">
        Skróty: + / = zwiększ, r reset (nieaktywne w polach tekstowych)
      </p>
      <span className="counter-card__feedback" aria-live="polite">
        {feedback}
      </span>
    </Card>
  )
}
