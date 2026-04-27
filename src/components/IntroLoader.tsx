'use client'

import { useEffect, useState } from 'react'

export default function IntroLoader() {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const fadeTimer = setTimeout(() => {
      setFading(true)
    }, 700)

    const removeTimer = setTimeout(() => {
      setVisible(false)
      document.body.style.overflow = ''
    }, 1400)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
      document.body.style.overflow = ''
    }
  }, [])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'var(--paper)',
        opacity: fading ? 0 : 1,
        transition: 'opacity 700ms var(--ease-soft)',
        pointerEvents: fading ? 'none' : 'auto',
      }}
      aria-hidden="true"
    />
  )
}
