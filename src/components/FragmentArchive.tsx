'use client'

import dynamic from 'next/dynamic'

const ThreeFragmentArchive = dynamic(() => import('./ThreeFragmentArchive'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '88vh',
        background: '#1A1815',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono-sans)',
          fontSize: '0.6rem',
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          color: 'rgba(245,240,232,0.2)',
        }}
      >
        LOADING ARCHIVE
      </span>
    </div>
  ),
})

export default function FragmentArchive() {
  return (
    <section style={{ background: '#1A1815' }}>
      {/* Section header */}
      <div
        style={{
          textAlign: 'center',
          padding: '8rem 2rem 5rem',
          maxWidth: '700px',
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono-sans)',
            fontWeight: 500,
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            color: 'rgba(139,111,71,0.8)',
            marginBottom: '2rem',
          }}
        >
          THE FRAGMENT ARCHIVE
        </p>
        <p
          style={{
            fontFamily: 'var(--font-editorial)',
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: '1.2rem',
            lineHeight: 1.75,
            maxWidth: '52ch',
            margin: '0 auto',
            color: 'rgba(237,230,216,0.55)',
          }}
        >
          Nine visual records recovered from territories without names.
          Hover to observe. Click to read. Drag to orient.
        </p>
      </div>

      {/* Three.js scene */}
      <ThreeFragmentArchive />
    </section>
  )
}
