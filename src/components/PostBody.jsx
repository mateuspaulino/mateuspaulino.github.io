/**
 * Renders the structured body of a blog post (see `src/posts/*.js` for the
 * block schema). Styling matches the rest of the portfolio: VT323 for prose,
 * Press Start 2P for section headings.
 */
export default function PostBody({ blocks }) {
  return (
    <div style={{
      fontFamily: 'var(--font-terminal)',
      fontSize: 'clamp(18px, 2.6vw, 22px)',
      lineHeight: 1.7,
      color: 'var(--text)',
      textAlign: 'left',
    }}>
      {blocks.map((block, i) => {
        if (block.type === 'p') {
          return (
            <p key={i} style={{ marginBottom: '20px' }}>
              {block.text}
            </p>
          )
        }

        if (block.type === 'h2') {
          return (
            <h2
              key={i}
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 'clamp(11px, 2vw, 13px)',
                letterSpacing: '1.5px',
                lineHeight: 1.6,
                margin: '36px 0 16px',
              }}
            >
              {'> '}{block.text}
            </h2>
          )
        }

        if (block.type === 'list') {
          const ListTag = block.ordered ? 'ol' : 'ul'
          return (
            <ListTag
              key={i}
              style={{
                margin: '0 0 24px',
                paddingLeft: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {block.items.map((item, j) => (
                <li key={j} style={{ paddingLeft: '4px' }}>
                  {item.title && (
                    <strong style={{ fontWeight: 700 }}>{item.title}: </strong>
                  )}
                  {item.text}
                </li>
              ))}
            </ListTag>
          )
        }

        return null
      })}
    </div>
  )
}
