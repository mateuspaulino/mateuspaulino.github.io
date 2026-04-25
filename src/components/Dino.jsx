import {
  DINO_SPRITE_SRC,
  DINO_NATIVE_W,
  DINO_NATIVE_H,
  DINO_SPRITE_FRAME_COUNT,
  DINO_FRAME_INDEX,
} from './dinoSprite'

/**
 * Chrome-style T-Rex rendered from the official Chrome offline-game sprite sheet.
 *
 * Unlike a masked silhouette, we render the raw sprite so the internal details
 * (eye, teeth, tongue highlight) survive. Light mode matches the native
 * `#535353` gray of the sprite; dark mode inverts the image via CSS so it reads
 * against `--bg: #1a1a1a` without losing any pixel detail.
 */
export default function Dino({ frame = 'standing', scale = 1, style = {} }) {
  const index = DINO_FRAME_INDEX[frame] ?? DINO_FRAME_INDEX.standing
  const width = DINO_NATIVE_W * scale
  const height = DINO_NATIVE_H * scale

  return (
    <div
      className="dino-sprite"
      aria-hidden="true"
      style={{
        width,
        height,
        backgroundImage: `url(${DINO_SPRITE_SRC})`,
        backgroundSize: `${width * DINO_SPRITE_FRAME_COUNT}px ${height}px`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `${-index * width}px 0`,
        imageRendering: 'pixelated',
        transition: 'filter var(--transition-speed)',
        ...style,
      }}
    />
  )
}
