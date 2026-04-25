export default function Footer() {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '40px 20px 32px',
      borderTop: '1px solid var(--border)',
      marginTop: '40px',
    }}>
      <p style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 'clamp(8px, 2vw, 10px)',
        color: 'var(--text-muted)',
        letterSpacing: '1px',
      }}>
        You're back online.
      </p>
      <p style={{
        fontFamily: 'var(--font-terminal)',
        fontSize: '16px',
        color: 'var(--text-muted)',
        marginTop: '12px',
        opacity: 0.6,
      }}>
        © {new Date().getFullYear()} Mateus Paulino — Built with pixels & caffeine
      </p>
    </footer>
  )
}
