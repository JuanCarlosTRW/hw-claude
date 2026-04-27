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
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const videoFrameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      if (heroTextRef.current) gsap.set(heroTextRef.current, { opacity: 1, x: 0, y: 0 })
      if (subtitleRef.current) gsap.set(subtitleRef.current, { opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      // Entrance: text rises from slightly below into center position
      gsap.from(heroTextRef.current, {
        x: -40,
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

      // 0–100%: paper overlay fades in (page turns to cream)
      tl.to(paperOverlayRef.current, {
        opacity: 1,
        duration: 1,
        ease: 'none',
      }, 0)

      // 0–100%: hero text transitions from cream (on video) to ink (on paper)
      // Use resolved hex values — GSAP cannot animate CSS custom properties
      tl.to(h1Ref.current, {
        color: '#1A1815', // --ink
        duration: 1,
        ease: 'none',
      }, 0)
      tl.to(subtitleRef.current, {
        color: '#6B6358', // --ink-faded
        duration: 1,
        ease: 'none',
      }, 0)

      // 0–100%: video wrapper shrinks from full-bleed to left-side card
      const sectionW = sectionRef.current?.offsetWidth ?? window.innerWidth
      const sectionH = sectionRef.current?.offsetHeight ?? window.innerHeight
      tl.fromTo(videoWrapRef.current,
        { width: sectionW, height: sectionH, left: 0, top: 0 },
        {
          width: sectionW * 0.33,
          height: sectionH * 0.55,
          left: sectionW * 0.08,
          top: sectionH * 0.22,
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
        end: '+=70%',
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
        style={{ position: 'absolute', inset: 0 }}
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
        {/* Frame — appears as video shrinks to card */}
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

      {/* Sepia overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--paper)',
          opacity: 0.2,
          pointerEvents: 'none',
        }}
      />

      {/* Top gradient — darkens sky to make title readable */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(26,24,21,0.62) 0%, rgba(26,24,21,0.25) 42%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* Bottom vignette — frames the lower portion */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(0deg, rgba(26,24,21,0.55) 0%, transparent 45%)',
          pointerEvents: 'none',
        }}
      />

      {/* Paper overlay — fades in as video shrinks */}
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

      {/* Hero text — centered, upper third, stays visible throughout.
          No CSS transform here — GSAP manages transforms via the entrance animation. */}
      <div
        ref={heroTextRef}
        style={{
          position: 'absolute',
          top: '18vh',
          left: 0,
          right: 0,
          zIndex: 10,
          textAlign: 'center',
          padding: '0 5%',
        }}
      >
        <h1
          ref={h1Ref}
          style={{
            fontFamily: 'var(--font-editorial)',
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: 'clamp(3rem, 7vw, 6.5rem)',
            color: '#F5F0E8', /* --paper hex — GSAP needs resolved value, not CSS var */
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
            fontSize: '0.65rem',
            color: 'rgba(245,240,232,0.7)',
            marginTop: '1.5rem',
          }}
        >
          A cartographic review of places that have never existed.
        </p>
      </div>
    </section>
  )
}
