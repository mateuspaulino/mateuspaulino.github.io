export default function About() {
  return (
    <section id="about" style={{
      maxWidth: '640px',
      margin: '0 auto',
      padding: '60px 20px',
      textAlign: 'center',
    }}>
      <h2 style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 'clamp(10px, 2.5vw, 14px)',
        marginBottom: '28px',
        letterSpacing: '2px',
      }}>
        {'> '}ABOUT
      </h2>

      <div style={{
        fontFamily: 'var(--font-terminal)',
        fontSize: 'clamp(18px, 3vw, 24px)',
        lineHeight: 1.8,
        color: 'var(--text)',
        textAlign: 'left',
      }}>
        <p style={{ marginBottom: '20px' }}>
          Senior Software Engineer with 12+ years shipping products on the web.
          I focus on writing resilient code and on the day-to-day decisions that keep it that way.
        </p>
        <p style={{ marginBottom: '20px' }}>
          I care about the boring stuff that makes software good —
          performance budgets, accessibility, observability, and keeping codebases
          small enough that new contributors can read them in an afternoon.
        </p>
        <p style={{ marginBottom: '20px' }}>
          Along the way I've collaborated closely with design and product to ship
          features that actually get used, mentored engineers, and occasionally
          written the kind of documentation people read on purpose.
        </p>
        <p style={{ color: 'var(--text-muted)' }}>
          Currently: integrating AI into day-to-day workflows and making
          front-end systems scale without getting heavier.
        </p>
      </div>
    </section>
  )
}
