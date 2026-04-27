'use client'

import { useEffect, useRef, useState } from 'react'

const PHRASE = 'Some places are not found. They are imagined.'
const COLORS = [
  '#8B6F47', '#6B5538', '#5C4A2E', '#4A3D26',
  '#3A2F1E', '#2A2218', '#1A1815', '#3A352E',
  '#5C5A3E', '#8B6F47',
]
const HEIGHT_FACTOR = 0.8
const ANIMATION_DURATION = 4 // seconds

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

  const chars = PHRASE.split('')

  // Render static text on server and before mount to avoid hydration mismatch
  if (!mounted) {
    return (
      <p
        aria-label={PHRASE}
        style={{
          fontFamily: 'var(--font-editorial)',
          fontWeight: 300,
          fontStyle: 'italic',
          fontSize: 'clamp(2rem, 6vw, 5rem)',
          color: '#8B6F47',
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
        gap: '0 0.02em',
        padding: '0 2rem',
        maxWidth: '80vw',
      }}
    >
      {chars.map((char, i) => {
        if (char === ' ') {
          return (
            <span key={i} style={{ width: '0.3em', display: 'inline-block' }} aria-hidden="true" />
          )
        }

        const phase = (i * 0.4) - (timeRef.current * (2 * Math.PI / ANIMATION_DURATION))
        const yOffset = reduced ? 0 : Math.sin(phase) * HEIGHT_FACTOR * 8
        const colorIdx = Math.abs(Math.floor((i * 0.4 + timeRef.current * 0.5))) % COLORS.length
        const shadowColor = COLORS[(colorIdx + 1) % COLORS.length]

        return (
          <span
            key={i}
            aria-hidden="true"
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-editorial)',
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 'clamp(2rem, 6vw, 5rem)',
              color: reduced ? '#8B6F47' : COLORS[colorIdx],
              transform: `translateY(${yOffset}px)`,
              textShadow: reduced ? 'none' : `1px 2px 4px ${shadowColor}40`,
              transition: reduced ? 'none' : undefined,
              lineHeight: 1.1,
            }}
          >
            {char}
          </span>
        )
      })}
    </div>
  )
}
