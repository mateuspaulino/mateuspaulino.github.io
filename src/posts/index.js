import claudeAgentsCoordinationContext from './claude-agents-coordination-context'
import reactEffectsCloudflareOutage from './react-effects-cloudflare-outage'

/**
 * Blog post registry. New posts: import the module and add it to this array.
 * The list is sorted by `date` descending; equal dates fall back to the order
 * given here (so newer-but-same-day posts can be placed first).
 */
const ALL_POSTS = [
  claudeAgentsCoordinationContext,
  reactEffectsCloudflareOutage,
]

export const posts = [...ALL_POSTS].sort((a, b) => b.date.localeCompare(a.date))

export function getPostBySlug(slug) {
  return posts.find((p) => p.slug === slug) ?? null
}

export function getLatestPosts(count = 3) {
  return posts.slice(0, count)
}

/**
 * Rough reading time in minutes. Counts words across paragraph, heading and
 * list blocks; rounds up to a 1 minute floor so very short posts don't read
 * "0 min".
 */
export function readingMinutes(post) {
  const wordsPerMinute = 220
  let words = 0
  for (const block of post.body) {
    if (block.type === 'p' || block.type === 'h2') {
      words += countWords(block.text)
    } else if (block.type === 'list') {
      for (const item of block.items) {
        if (item.title) words += countWords(item.title)
        words += countWords(item.text)
      }
    }
  }
  return Math.max(1, Math.round(words / wordsPerMinute))
}

function countWords(text) {
  return text.trim().split(/\s+/).length
}

/**
 * Format an ISO date (YYYY-MM-DD) as `APR 24, 2026` \u2014 keeps the pixel
 * monospaced look consistent across cards and the post header.
 */
export function formatDate(iso) {
  const [year, month, day] = iso.split('-').map((n) => parseInt(n, 10))
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  return `${months[month - 1]} ${String(day).padStart(2, '0')}, ${year}`
}
