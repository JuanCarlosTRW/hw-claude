'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/lib/gsap'

interface AtlasEntryProps {
  number: '001' | '002' | '003'
  title: string
  body: string
  imageSrc: string
  imageAlt: string
  caption: string
  layout: 'left' | 'right'
  isFirst?: boolean
}

export default function AtlasEntry({
  number,
  title,
  body,
  imageSrc,
  imageAlt,
  caption,
  layout,
  isFirst = false,
}: AtlasEntryProps) {
  const entryRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLSpanElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Entry 001 text starts hidden and is revealed by Hero's scrub
    if (isFirst && textRef.current) {
      gsap.set(textRef.current, {
        x: 30,
        opacity: 0,
      })
    }

    if (prefersReduced) {
      if (isFirst && textRef.current) gsap.set(textRef.current, { x: 0, opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      // Image: fade + scale + lift
      gsap.from(imageRef.current, {
        opacity: 0,
        scale: 0.96,
        y: 40,
        duration: 1.4,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 75%',
        },
      })

      if (!isFirst) {
        // Text stagger for entries 002 and 003
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 75%',
          },
        })
        tl.from(eyebrowRef.current, { opacity: 0, duration: 0.6 })
          .from(titleRef.current, {
            clipPath: 'inset(100% 0 0 0)',
            duration: 1,
            ease: 'power2.inOut',
          }, '+=0.1')
          .from(bodyRef.current, { opacity: 0, y: 20, duration: 0.8 }, '+=0.1')
      }
    }, entryRef)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === imageRef.current || t.vars.trigger === textRef.current) t.kill()
      })
    }
  }, [isFirst])

  const isLeft = layout === 'left'

  return (
    <div
      ref={entryRef}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        columnGap: '3rem',
        rowGap: '2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isFirst ? '3rem 2rem 8rem' : '8rem 2rem',
      }}
    >
      {/* Image side */}
      <div
        ref={imageRef}
        style={{
          gridColumn: isLeft ? '1 / 7' : '7 / 13',
          gridRow: 1,
        }}
      >
        <div style={{ aspectRatio: '3/4', position: 'relative', overflow: 'hidden' }}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            unoptimized
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        </div>
        <p
          style={{
            fontFamily: 'var(--font-mono-sans)',
            fontWeight: 400,
            fontSize: '0.6rem',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            color: 'var(--ink-faded)',
            marginTop: '1rem',
          }}
        >
          {caption}
        </p>
      </div>

      {/* Text side */}
      <div
        ref={textRef}
        data-entry-001-text={isFirst ? '' : undefined}
        style={{
          gridColumn: isLeft ? '8 / 13' : '1 / 6',
          gridRow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '1.5rem',
        }}
      >
        <span
          ref={eyebrowRef}
          style={{
            fontFamily: 'var(--font-mono-sans)',
            fontWeight: 500,
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            color: 'var(--ink-faded)',
          }}
        >
          ATLAS ENTRY {number}
        </span>

        <div style={{ overflow: 'hidden' }}>
          <h2
            ref={titleRef}
            style={{
              fontFamily: 'var(--font-editorial)',
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              color: 'var(--ink)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h2>
        </div>

        <p
          ref={bodyRef}
          style={{
            fontFamily: 'var(--font-editorial)',
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: '1.125rem',
            lineHeight: 1.7,
            maxWidth: '38ch',
            color: 'var(--ink-soft)',
          }}
        >
          {body}
        </p>
      </div>
    </div>
  )
}
