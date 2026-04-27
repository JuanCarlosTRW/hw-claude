'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import FragmentCard from './FragmentCard'

interface CardData {
  fragment: string
  label: string
  imageSrc: string
  objectPosition?: string
  imageScale?: number
}

interface FanProps {
  cards: CardData[]
  direction: 'left' | 'center' | 'right'
}

const ROTATIONS = {
  left: [-25, -12, 0],
  center: [-15, 0, 15],
  right: [0, 12, 25],
}
const X_OFFSETS = {
  left: [-30, -12, 0],
  center: [-20, 0, 20],
  right: [0, 12, 30],
}

export default function Fan({ cards, direction }: FanProps) {
  const fanRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      // Show fully opened state immediately
      const rotations = ROTATIONS[direction]
      const offsets = X_OFFSETS[direction]
      cardRefs.current.forEach((ref, i) => {
        if (ref) gsap.set(ref, { rotation: rotations[i], x: offsets[i] })
      })
      return
    }

    const effectiveDir = isMobile ? 'center' : direction
    const rotations = ROTATIONS[effectiveDir]
    const offsets = X_OFFSETS[effectiveDir]

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: fanRef.current,
          start: 'top 70%',
          end: isMobile ? '+=80%' : 'top 10%',
          scrub: 1,
        },
      })

      cardRefs.current.forEach((ref, i) => {
        tl.to(ref, {
          rotation: rotations[i],
          x: offsets[i],
          duration: 1,
          ease: 'none',
        }, 0)
      })
    }, fanRef)

    return () => ctx.revert()
  }, [direction, isMobile])

  return (
    <div
      ref={fanRef}
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: 'clamp(350px, 40vw, 500px)',
        width: isMobile ? '100%' : 'auto',
      }}
    >
      {cards.map((card, i) => (
        <div
          key={i}
          ref={(el) => { cardRefs.current[i] = el }}
          style={{
            position: 'absolute',
            bottom: 0,
            transformOrigin: 'bottom center',
          }}
        >
          <FragmentCard {...card} isMobile={isMobile} />
        </div>
      ))}
    </div>
  )
}
