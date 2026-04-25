import { useState, useEffect, useRef, useCallback } from 'react'
import Dino from './Dino'

export default function Hero() {
  const [frame, setFrame] = useState('standing')
  const introDoneRef = useRef(false)

  const scrollToAboutOnce = useCallback(() => {
    if (introDoneRef.current) return
    introDoneRef.current = true
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // First Space / ArrowUp: jump to About (capture phase so DinoGame does not also handle it).
  useEffect(() => {
    const onKey = (e) => {
      if (introDoneRef.current) return
      if (e.code !== 'Space' && e.code !== 'ArrowUp') return
      e.preventDefault()
      e.stopPropagation()
      scrollToAboutOnce()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [scrollToAboutOnce])

  useEffect(() => {
    let step = 0
    const interval = setInterval(() => {
      step = (step + 1) % 2
      setFrame(step === 0 ? 'leftStep' : 'rightStep')
    }, 180)
    return () => clearInterval(interval)
  }, [])

  return (
    <section style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      padding: '60px 20px 40px',
      textAlign: 'center',
      gap: '24px',
    }}>
      {/* Animated pixel dino */}
      <div style={{ marginBottom: '8px' }}>
        <Dino frame={frame} scale={1.2} />
      </div>

      <h1 style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 'clamp(18px, 4vw, 28px)',
        letterSpacing: '2px',
        lineHeight: 1.6,
      }}>
        Mateus Paulino
      </h1>

      <p style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 'clamp(8px, 2vw, 11px)',
        color: 'var(--text-muted)',
        letterSpacing: '1px',
      }}>
        Senior Software Engineer / Front-End Specialist
      </p>

      <p style={{
        fontFamily: 'var(--font-terminal)',
        fontSize: 'clamp(18px, 3vw, 26px)',
        color: 'var(--text)',
        maxWidth: '600px',
        lineHeight: 1.5,
        marginTop: '8px',
      }}>
        Building software since 2012 —{' '}
        <span style={{ color: 'var(--text-muted)' }}>
          from the surface down to the systems that hold it up.
        </span>
      </p>

      {/* Blinking prompt — first tap/click also scrolls to About (same as Space). */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Go to about section"
        onClick={() => scrollToAboutOnce()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            scrollToAboutOnce()
          }
        }}
        style={{
          fontFamily: 'var(--font-terminal)',
          fontSize: '20px',
          color: 'var(--text-muted)',
          marginTop: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          cursor: 'pointer',
        }}
      >
        <span>Press</span>
        <span style={{
          border: '2px solid var(--text-muted)',
          padding: '2px 12px',
          fontSize: '14px',
          fontFamily: 'var(--font-pixel)',
        }}>
          SPACE
        </span>
        <span>to start</span>
        <span className="cursor-blink" style={{ marginLeft: '2px' }}>▌</span>
      </div>
    </section>
  )
}
