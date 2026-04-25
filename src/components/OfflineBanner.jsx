import { useState } from 'react'

export default function OfflineBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      fontFamily: 'var(--font-terminal)',
      fontSize: '18px',
      color: 'var(--text-muted)',
      position: 'relative',
      transition: 'background var(--transition-speed)',
    }}>
      <span style={{ fontSize: '14px' }}>⚠</span>
      <span>No internet — Check your connection</span>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        style={{
          position: 'absolute',
          right: '12px',
          fontSize: '16px',
          fontFamily: 'var(--font-terminal)',
          color: 'var(--text-muted)',
          padding: '4px 8px',
        }}
      >
        ✕
      </button>
    </div>
  )
}
