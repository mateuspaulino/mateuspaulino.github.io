import { hashHref } from '../hooks/useHashRoute'
import { formatDate, readingMinutes } from '../posts'

/**
 * Compact card used on the home page (latest 3) and the blog index. Mirrors
 * the inverting hover treatment of the `<Links />` rows so the whole site
 * feels like one piece.
 */
export default function PostCard({ post }) {
  const minutes = readingMinutes(post)

  return (
    <a
      href={hashHref(`/blog/${post.slug}`)}
      style={{
        display: 'block',
        width: '100%',
        maxWidth: '560px',
        padding: '18px 20px',
        border: '2px solid var(--text)',
        background: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: 'var(--font-terminal)',
        textAlign: 'left',
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--text)'
        e.currentTarget.style.color = 'var(--bg)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--bg)'
        e.currentTarget.style.color = 'var(--text)'
      }}
    >
      <div style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: '9px',
        letterSpacing: '1px',
        opacity: 0.7,
        marginBottom: '10px',
      }}>
        {formatDate(post.date)} · {minutes} MIN READ
      </div>

      <div style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 'clamp(11px, 1.8vw, 13px)',
        lineHeight: 1.6,
        letterSpacing: '0.5px',
        marginBottom: '12px',
      }}>
        {post.title}
      </div>

      <p style={{
        fontSize: '20px',
        lineHeight: 1.5,
        opacity: 0.85,
      }}>
        {post.excerpt}
      </p>

      <div style={{
        marginTop: '14px',
        fontSize: '18px',
        opacity: 0.65,
      }}>
        $ cat post.md →
      </div>
    </a>
  )
}
