'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const VIDEO_SRC = 'https://video.wixstatic.com/video/62f926_3907ae8ad50b4fc2b364d21fe1f6524c/720p/mp4/file.mp4'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoWrapRef = useRef<HTMLDivElement>(null)
  const paperOverlayRef = useRef<HTMLDivElement>(null)
  const heroTextRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const videoFrameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      // Immediately show final states
      if (heroTextRef.current) gsap.set(heroTextRef.current, { opacity: 1, x: 0, y: 0 })
      if (subtitleRef.current) gsap.set(subtitleRef.current, { opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      // Entrance: hero text slides in from lower-left after 2s
      gsap.from(heroTextRef.current, {
        x: -60,
        y: 30,
        opacity: 0,
        duration: 1.8,
        ease: 'power2.inOut',
        delay: 2,
      })
      gsap.from(subtitleRef.current, {
        opacity: 0,
        duration: 1,
        delay: 3.2,
      })

      // Scroll-driven pin + shrink transition
      const tl = gsap.timeline({ paused: true })

      // 0–30%: hero text exits up
      tl.to(heroTextRef.current, {
        y: -40,
        opacity: 0,
        duration: 0.3,
        ease: 'none',
      }, 0)

      // 0–100%: paper overlay fades in (page turns to cream)
      tl.to(paperOverlayRef.current, {
        opacity: 1,
        duration: 1,
        ease: 'none',
      }, 0)

      // 0–100%: video wrapper shrinks from full-bleed to left-side card
      // Use percentage-based sizing to avoid 100vw/100vh issues in preview
      const sectionW = sectionRef.current?.offsetWidth ?? window.innerWidth
      const sectionH = sectionRef.current?.offsetHeight ?? window.innerHeight
      tl.fromTo(videoWrapRef.current,
        { width: sectionW, height: sectionH, left: 0, top: 0 },
        {
          width: sectionW * 0.33,
          height: sectionH * 0.55,
          left: sectionW * 0.08,
          top: sectionH * 0.18,
          ease: 'none',
          duration: 1,
        }, 0
      )

      // 50–100%: frame appears on the video card
      tl.to(videoFrameRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: 'none',
      }, 0.5)

      // 80–100%: Entry 001 text slides in from right
      // Note: selector is intentionally outside sectionRef scope — query from document
      const entry001Text = document.querySelector('[data-entry-001-text]')
      if (entry001Text) {
        tl.to(entry001Text, {
          x: 0,
          opacity: 1,
          duration: 0.2,
          ease: 'none',
        }, 0.8)
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        pin: true,
        start: 'top top',
        end: '+=120%',
        scrub: 1.2,
        animation: tl,
        onLeave: () => {
          if (videoRef.current) videoRef.current.pause()
        },
        onEnterBack: () => {
          if (videoRef.current) videoRef.current.play()
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100vh' }}
      aria-label="Hero — imaginary atlas introduction"
    >
      {/* Video wrapper — starts full-bleed, shrinks to left card on scroll */}
      <div
        ref={videoWrapRef}
        style={{
          position: 'absolute',
          inset: 0,
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Atmospheric landscape video"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          src={VIDEO_SRC}
        />
        {/* Frame overlay — appears as video shrinks */}
        <div
          ref={videoFrameRef}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            border: '1px solid var(--ink-faded)',
            boxShadow: '0 30px 80px -20px rgba(26,24,21,0.3)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Sepia overlay to pull video into manuscript palette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--paper)',
          opacity: 0.2,
          pointerEvents: 'none',
        }}
      />

      {/* Vignette — heavier at bottom to frame text */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 80%, transparent 30%, rgba(26,24,21,0.75) 100%)',
          opacity: 0.55,
          pointerEvents: 'none',
        }}
      />

      {/* Paper overlay for scroll transition — fades to cream as hero shrinks */}
      <div
        ref={paperOverlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--paper)',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* Hero text */}
      <div
        ref={heroTextRef}
        style={{
          position: 'absolute',
          left: '8vw',
          bottom: '22vh',
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-editorial)',
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            color: 'var(--paper)',
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
          }}
        >
          Where does this come from?
        </h1>
        <p
          ref={subtitleRef}
          style={{
            fontFamily: 'var(--font-mono-sans)',
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            fontSize: '0.7rem',
            color: 'rgba(245,240,232,0.7)',
            marginTop: '1.25rem',
          }}
        >
          A cartographic review of places that have never existed.
        </p>
      </div>
    </section>
  )
}
