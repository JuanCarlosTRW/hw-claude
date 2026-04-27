'use client'

import Image from 'next/image'

interface FragmentCardProps {
  fragment: string
  label: string
  imageSrc: string
  objectPosition?: string
  imageScale?: number
  isMobile?: boolean
}

export default function FragmentCard({
  fragment,
  label,
  imageSrc,
  objectPosition = 'center',
  imageScale = 1,
  isMobile = false,
}: FragmentCardProps) {
  const width = isMobile ? '30vw' : 'clamp(140px, 14vw, 220px)'

  return (
    <div
      className="group"
      style={{
        width,
        aspectRatio: '3/4',
        transformOrigin: 'bottom center',
        border: '1px solid var(--paper-shadow)',
        boxShadow: '0 20px 40px -15px rgba(26,24,21,0.15)',
        background: 'var(--paper-deep)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform 400ms var(--ease-soft), box-shadow 400ms var(--ease-soft)',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.transform = 'translateY(-8px)'
        el.style.boxShadow = '0 40px 60px -20px rgba(26,24,21,0.3)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.transform = ''
        el.style.boxShadow = '0 20px 40px -15px rgba(26,24,21,0.15)'
      }}
    >
      {/* Image — top 75% */}
      <div style={{ height: '75%', position: 'relative', overflow: 'hidden' }}>
        <Image
          src={imageSrc}
          alt={`${fragment} — ${label}`}
          fill
          unoptimized
          style={{
            objectFit: 'cover',
            objectPosition,
            transform: `scale(${imageScale})`,
          }}
          sizes="(max-width: 768px) 30vw, clamp(140px, 14vw, 220px)"
        />
      </div>

      {/* Label — bottom 25% */}
      <div
        style={{
          height: '25%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 0.75rem',
        }}
      >
        <span
          className="card-label"
          style={{
            fontFamily: 'var(--font-mono-sans)',
            fontSize: '0.55rem',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            color: 'var(--ink-faded)',
            opacity: 0.3,
            transition: 'opacity 400ms var(--ease-soft), color 400ms var(--ease-soft)',
            lineHeight: 1.4,
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.opacity = '1'
            el.style.color = 'var(--ink)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.opacity = '0.3'
            el.style.color = 'var(--ink-faded)'
          }}
        >
          {fragment}<br />{label}
        </span>
      </div>
    </div>
  )
}
