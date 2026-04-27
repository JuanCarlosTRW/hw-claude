'use client'

import Image from 'next/image'

interface FragmentCardProps {
  fragment: string
  label: string
  imageSrc: string
  objectPosition?: string
  imageScale?: number
  isMobile?: boolean
  isActive?: boolean
  isInactive?: boolean
}

export default function FragmentCard({
  fragment,
  label,
  imageSrc,
  objectPosition = 'center',
  imageScale = 1,
  isMobile = false,
  isActive = false,
  isInactive = false,
}: FragmentCardProps) {
  const width = isMobile ? '30vw' : 'clamp(140px, 14vw, 220px)'

  return (
    <div
      style={{
        width,
        aspectRatio: '3/4',
        transformOrigin: 'bottom center',
        border: isActive
          ? '1px solid var(--accent-sepia)'
          : '1px solid var(--paper-shadow)',
        boxShadow: isActive
          ? '0 50px 80px -20px rgba(26,24,21,0.45)'
          : '0 20px 40px -15px rgba(26,24,21,0.15)',
        background: 'var(--paper-deep)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'border-color 400ms var(--ease-soft), box-shadow 400ms var(--ease-soft)',
        cursor: 'pointer',
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
            transition: 'transform 600ms var(--ease-soft)',
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
          style={{
            fontFamily: 'var(--font-mono-sans)',
            fontSize: '0.55rem',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            color: isActive ? 'var(--ink)' : 'var(--ink-faded)',
            opacity: isActive ? 1 : isInactive ? 0.3 : 0.3,
            transition: 'opacity 400ms var(--ease-soft), color 400ms var(--ease-soft)',
            lineHeight: 1.4,
          }}
        >
          {fragment}<br />{label}
        </span>
      </div>
    </div>
  )
}
