export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      style={{
        position: 'fixed',
        top: '52px',
        right: '20px',
        zIndex: 100,
        fontFamily: 'var(--font-terminal)',
        fontSize: '22px',
        padding: '6px 10px',
        border: '2px solid var(--text)',
        background: 'var(--bg)',
        color: 'var(--text)',
        transition: 'all var(--transition-speed)',
        lineHeight: 1,
      }}
    >
      {theme === 'light' ? '☽' : '☀'}
    </button>
  )
}
