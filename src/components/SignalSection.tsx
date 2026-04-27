'use client'

import { useState, type FormEvent } from 'react'
import { fragments } from '@/data/fragments'

// Deterministic mapping from coordinates to a fragment. Same lat/lng always
// returns the same fragment — that's the trick.
function transmit(lat: number, lng: number): string {
  const hash = Math.abs(Math.floor(lat * 1000 + lng * 1000)) % fragments.length
  return fragments[hash]
}

export default function SignalSection() {
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [btnHover, setBtnHover] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const latNum = parseFloat(lat)
    const lngNum = parseFloat(lng)

    if (Number.isNaN(latNum) || latNum < -90 || latNum > 90) {
      setError('Latitude must be between -90 and 90.')
      return
    }
    if (Number.isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
      setError('Longitude must be between -180 and 180.')
      return
    }
    setError(null)

    // Reset opacity, then on the next tick set the new fragment + fade in.
    setIsVisible(false)
    requestAnimationFrame(() => {
      setResult(transmit(latNum, lngNum))
      requestAnimationFrame(() => setIsVisible(true))
    })
  }

  const inputStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono-sans)',
    fontSize: '0.95rem',
    color: 'var(--ink)',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(26,24,21,0.25)',
    padding: '0.65rem 0.25rem',
    outline: 'none',
    width: '100%',
    textAlign: 'center',
    letterSpacing: '0.05em',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono-sans)',
    fontWeight: 500,
    fontSize: '0.6rem',
    textTransform: 'uppercase',
    letterSpacing: '0.3em',
    color: 'rgba(107,99,88,0.85)',
    marginBottom: '0.6rem',
    display: 'block',
  }

  return (
    <section
      style={{
        background: 'var(--paper)',
        padding: '12.5rem 1.5rem',
      }}
      aria-label="Signal — coordinate transmission"
    >
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono-sans)',
            fontWeight: 500,
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            color: 'rgba(139,111,71,0.9)',
            marginBottom: '2rem',
          }}
        >
          SECTION 04 — SIGNAL
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-editorial)',
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
            color: 'var(--ink)',
            lineHeight: 1.05,
            letterSpacing: '-0.015em',
            marginBottom: '1.75rem',
          }}
        >
          Send a signal.
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-editorial)',
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: '1.15rem',
            lineHeight: 1.7,
            color: 'rgba(58,53,46,0.75)',
            maxWidth: '46ch',
            margin: '0 auto 4rem',
          }}
        >
          Enter coordinates. Receive a fragment from a place that does not exist.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            maxWidth: '420px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
            }}
          >
            <div>
              <label htmlFor="signal-lat" style={labelStyle}>
                LATITUDE
              </label>
              <input
                id="signal-lat"
                type="number"
                inputMode="decimal"
                step="any"
                min="-90"
                max="90"
                placeholder="73.5"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label htmlFor="signal-lng" style={labelStyle}>
                LONGITUDE
              </label>
              <input
                id="signal-lng"
                type="number"
                inputMode="decimal"
                step="any"
                min="-180"
                max="180"
                placeholder="12.4"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              fontFamily: 'var(--font-mono-sans)',
              fontWeight: 500,
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.32em',
              color: btnHover ? '#B44040' : 'var(--accent-sepia)',
              background: 'transparent',
              border: `1px solid ${btnHover ? '#B44040' : 'var(--accent-sepia)'}`,
              padding: '1.1rem 2.5rem',
              cursor: 'pointer',
              transition: 'color 320ms ease, border-color 320ms ease',
              alignSelf: 'center',
              marginTop: '0.5rem',
            }}
          >
            TRANSMIT
          </button>

          {error && (
            <p
              role="alert"
              style={{
                fontFamily: 'var(--font-mono-sans)',
                fontSize: '0.7rem',
                color: '#B44040',
                letterSpacing: '0.1em',
                marginTop: '-1rem',
              }}
            >
              {error}
            </p>
          )}
        </form>

        {/* Result — fades in over 1.5s, holds until next submission */}
        <div
          aria-live="polite"
          style={{
            minHeight: '8rem',
            marginTop: '5rem',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 1500ms ease',
          }}
        >
          {result && (
            <>
              <p
                style={{
                  fontFamily: 'var(--font-mono-sans)',
                  fontWeight: 500,
                  fontSize: '0.55rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.35em',
                  color: 'rgba(139,111,71,0.7)',
                  marginBottom: '1.5rem',
                }}
              >
                FRAGMENT RECEIVED
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-editorial)',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.4rem, 2.4vw, 1.85rem)',
                  lineHeight: 1.45,
                  color: 'var(--ink)',
                  maxWidth: '38ch',
                  margin: '0 auto',
                  letterSpacing: '-0.005em',
                }}
              >
                {result}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
