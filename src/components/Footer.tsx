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
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--ink)',
        overflow: 'hidden',
        padding: '10vh 2rem',
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
          top: '8vh',
          fontFamily: 'var(--font-mono-sans)',
          fontWeight: 400,
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.4em',
          color: 'rgba(237,230,216,0.8)',
          zIndex: 1,
        }}
      >
        CLOSING RECORD
      </p>

      {/* Wave text — generous vertical breathing room */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '6vh 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <WaveText />
      </div>

      {/* Colophon — fictional cartographic edition */}
      <div
        style={{
          position: 'absolute',
          bottom: '4rem',
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
            fontSize: '0.6rem',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            color: 'rgba(245,240,232,0.45)',
          }}
        >
          EDITION 001 · MMXXVI
        </p>
        <p
          style={{
            fontFamily: 'var(--font-mono-sans)',
            fontWeight: 400,
            fontSize: '0.6rem',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            color: 'rgba(245,240,232,0.45)',
          }}
        >
          CARTOGRAPHER UNKNOWN
        </p>
        <p
          style={{
            fontFamily: 'var(--font-mono-sans)',
            fontWeight: 400,
            fontSize: '0.55rem',
            letterSpacing: '0.15em',
            color: 'rgba(245,240,232,0.25)',
            marginTop: '0.4rem',
          }}
        >
          A field exercise by Juan Bedoya · Laval
        </p>
      </div>
    </footer>
  )
}
