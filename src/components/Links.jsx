const LINKS = [
  {
    label: 'github',
    command: 'clone --projects',
    href: 'https://github.com/mateuspaulino',
  },
  {
    label: 'linkedin',
    command: 'connect --professional',
    href: 'https://www.linkedin.com/in/mateuspaulino/',
  },
  {
    label: 'email',
    command: 'send --message',
    href: 'mailto:mateuspaulino.web@gmail.com',
  },
  {
    label: 'whatsapp',
    command: 'chat --direct',
    href: 'https://wa.me/5582981936146',
  },
]

export default function Links() {
  return (
    <section style={{
      maxWidth: '640px',
      margin: '0 auto',
      padding: '60px 20px',
      textAlign: 'center',
    }}>
      <h2 style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 'clamp(10px, 2.5vw, 14px)',
        marginBottom: '32px',
        letterSpacing: '2px',
      }}>
        {'> '}LINKS
      </h2>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        alignItems: 'center',
      }}>
        {LINKS.map(({ label, command, href }) => (
          <a
            key={label}
            href={href}
            {...(href.startsWith('mailto:')
              ? {}
              : { target: '_blank', rel: 'noopener noreferrer' })}
            style={{
              display: 'block',
              width: '100%',
              maxWidth: '420px',
              padding: '14px 20px',
              border: '2px solid var(--text)',
              fontFamily: 'var(--font-terminal)',
              fontSize: '20px',
              textAlign: 'left',
              transition: 'all 0.15s',
              background: 'var(--bg)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--text)'
              e.currentTarget.style.color = 'var(--bg)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--bg)'
              e.currentTarget.style.color = 'var(--text)'
            }}
          >
            <span style={{ opacity: 0.5 }}>$ </span>
            <span style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '10px',
              verticalAlign: 'middle',
            }}>
              {label}
            </span>
            <span style={{ opacity: 0.4, marginLeft: '8px' }}>
              {command}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
