import { hashHref } from '../hooks/useHashRoute'
import { formatDate, getPostBySlug, readingMinutes } from '../posts'
import PostBody from './PostBody'

/**
 * Single blog post page. Reached via `#/blog/:slug`. Falls back to a small
 * "not found" view if the slug is unknown so deep links never crash.
 */
export default function BlogPostPage({ slug }) {
  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <section style={{
        maxWidth: '640px',
        margin: '0 auto',
        padding: '80px 20px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 'clamp(14px, 3vw, 18px)',
          letterSpacing: '2px',
          marginBottom: '16px',
        }}>
          404 — POST NOT FOUND
        </h1>
        <p style={{
          fontFamily: 'var(--font-terminal)',
          fontSize: '20px',
          color: 'var(--text-muted)',
          marginBottom: '24px',
        }}>
          No post matches <code>{slug}</code>.
        </p>
        <a
          href={hashHref('/blog')}
          style={{
            fontFamily: 'var(--font-terminal)',
            fontSize: '20px',
            color: 'var(--text-muted)',
          }}
        >
          $ ls /blog <span style={{ opacity: 0.6 }}># browse all posts →</span>
        </a>
      </section>
    )
  }

  const minutes = readingMinutes(post)

  return (
    <article style={{
      maxWidth: '720px',
      margin: '0 auto',
      padding: '60px 20px 40px',
    }}>
      <a
        href={hashHref('/blog')}
        style={{
          display: 'inline-block',
          marginBottom: '24px',
          fontFamily: 'var(--font-terminal)',
          fontSize: '20px',
          color: 'var(--text-muted)',
        }}
      >
        $ cd .. <span style={{ opacity: 0.6 }}># back to /blog</span>
      </a>

      <header style={{ marginBottom: '32px' }}>
        <div style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: '10px',
          letterSpacing: '1.5px',
          color: 'var(--text-muted)',
          marginBottom: '14px',
        }}>
          {formatDate(post.date)} · {minutes} MIN READ
        </div>

        <h1 style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 'clamp(14px, 2.6vw, 20px)',
          lineHeight: 1.5,
          letterSpacing: '1px',
        }}>
          {post.title}
        </h1>
      </header>

      <PostBody blocks={post.body} />

      <footer style={{
        marginTop: '48px',
        paddingTop: '24px',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <a
          href={hashHref('/blog')}
          style={{
            fontFamily: 'var(--font-terminal)',
            fontSize: '20px',
            color: 'var(--text-muted)',
          }}
        >
          $ ls /blog <span style={{ opacity: 0.6 }}># more posts →</span>
        </a>
      </footer>
    </article>
  )
}
