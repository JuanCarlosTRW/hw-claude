'use client'

import { useEffect, useRef } from 'react'
import WaveText from './WaveText'

const VIDEO_SRC = 'https://video.wixstatic.com/video/62f926_3907ae8ad50b4fc2b364d21fe1f6524c/720p/mp4/file.mp4'

export default function Footer() {
  const bgVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (bgVideoRef.current) {
      bgVideoRef.current.playbackRate = 0.4
    }
  }, [])

  return (
    <footer
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--ink)',
        overflow: 'hidden',
      }}
    >
      {/* Atmospheric blurred video background */}
      <video
        ref={bgVideoRef}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.08,
          filter: 'blur(40px)',
        }}
        src={VIDEO_SRC}
      />

      {/* Closing record eyebrow */}
      <p
        style={{
          position: 'absolute',
          top: '12vh',
          fontFamily: 'var(--font-mono-sans)',
          fontWeight: 400,
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.4em',
          color: 'rgba(237,230,216,0.6)',
          zIndex: 1,
        }}
      >
        CLOSING RECORD
      </p>

      {/* Wave text */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <WaveText />
      </div>

      {/* Credits */}
      <div
        style={{
          position: 'absolute',
          bottom: '3rem',
          textAlign: 'center',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono-sans)',
            fontWeight: 400,
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'rgba(245,240,232,0.5)',
          }}
        >
          MADE BY CLIENTGROWTH
        </p>
        <a
          href="https://clientgrowth.ca"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-mono-sans)',
            fontWeight: 400,
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'rgba(245,240,232,0.5)',
            textDecoration: 'none',
            transition: 'opacity 400ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'rgba(245,240,232,1)' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = ''; e.currentTarget.style.color = 'rgba(245,240,232,0.5)' }}
          onFocus={(e) => { e.currentTarget.style.outline = '1px solid var(--accent-sepia)' }}
          onBlur={(e) => { e.currentTarget.style.outline = '' }}
        >
          clientgrowth.ca
        </a>
      </div>
    </footer>
  )
}
