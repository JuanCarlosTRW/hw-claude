'use client'

import { useEffect, useRef, useState } from 'react'

const PHRASE = 'Some places are not found. They are imagined.'

// Light cream-to-sepia palette — readable against the dark ink background
const COLORS = [
  '#F5F0E8',
  '#EDE6D8',
  '#DDD3BF',
  '#C8B08A',
  '#B89060',
  '#A07848',
  '#8B6F47',
  '#C8B08A',
  '#EDE6D8',
  '#F5F0E8',
]

const HEIGHT_FACTOR = 0.8
const ANIMATION_DURATION = 4

// Pre-process phrase into word groups with global char indices
// so flex wrapping never splits a word mid-character
const WORD_GROUPS: { char: string; globalIdx: number }[][] = (() => {
  const words = PHRASE.split(' ')
  let gi = 0
  return words.map((word) => {
    const chars = word.split('').map((char) => ({ char, globalIdx: gi++ }))
    gi++ // account for the space
    return chars
  })
})()

export default function WaveText() {
  const rafRef = useRef<number>(0)
  const timeRef = useRef<number>(0)
  const lastTimeRef = useRef<number | null>(null)
  const [tick, setTick] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    if (mq.matches) return

    const loop = (ts: number) => {
      if (lastTimeRef.current !== null) {
        timeRef.current += (ts - lastTimeRef.current) / 1000
      }
      lastTimeRef.current = ts
      setTick((t) => t + 1)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  if (!mounted) {
    return (
      <p
        aria-label={PHRASE}
        style={{
          fontFamily: 'var(--font-editorial)',
          fontWeight: 300,
          fontStyle: 'italic',
          fontSize: 'clamp(2rem, 6vw, 5rem)',
          color: 'var(--paper)',
          lineHeight: 1.1,
          textAlign: 'center',
          padding: '0 2rem',
        }}
      >
        {PHRASE}
      </p>
    )
  }

  return (
    <div
      aria-label={PHRASE}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0 0.3em',
        padding: '0 2rem',
        maxWidth: '80vw',
      }}
    >
      {WORD_GROUPS.map((wordChars, wi) => (
        <span
          key={wi}
          style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}
          aria-hidden="true"
        >
          {wordChars.map(({ char, globalIdx: i }) => {
            const phase = (i * 0.4) - (timeRef.current * (2 * Math.PI / ANIMATION_DURATION))
            const yOffset = reduced ? 0 : Math.sin(phase) * HEIGHT_FACTOR * 8
            const colorIdx = Math.abs(Math.floor((i * 0.4 + timeRef.current * 0.5))) % COLORS.length
            const shadowColor = COLORS[(colorIdx + 1) % COLORS.length]

            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-editorial)',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  fontSize: 'clamp(2rem, 6vw, 5rem)',
                  color: reduced ? 'var(--paper)' : COLORS[colorIdx],
                  transform: `translateY(${yOffset}px)`,
                  textShadow: reduced ? 'none' : `0 2px 12px ${shadowColor}60`,
                  lineHeight: 1.1,
                }}
              >
                {char}
              </span>
            )
          })}
        </span>
      ))}
    </div>
  )
}
