import { hashHref } from '../hooks/useHashRoute'
import { posts } from '../posts'
import PostCard from './PostCard'

/**
 * Full chronological index of blog posts. Reached via `#/blog`.
 */
export default function BlogIndexPage() {
  return (
    <section style={{
      maxWidth: '640px',
      margin: '0 auto',
      padding: '60px 20px 40px',
    }}>
      <a
        href={hashHref('/')}
        style={{
          display: 'inline-block',
          marginBottom: '24px',
          fontFamily: 'var(--font-terminal)',
          fontSize: '20px',
          color: 'var(--text-muted)',
        }}
      >
        $ cd .. <span style={{ opacity: 0.6 }}># back home</span>
      </a>

      <h1 style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 'clamp(12px, 3vw, 16px)',
        letterSpacing: '2px',
        marginBottom: '8px',
      }}>
        {'> '}/BLOG
      </h1>
      <p style={{
        fontFamily: 'var(--font-terminal)',
        fontSize: '20px',
        color: 'var(--text-muted)',
        marginBottom: '36px',
      }}>
        {posts.length} {posts.length === 1 ? 'post' : 'posts'} — newest first.
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
