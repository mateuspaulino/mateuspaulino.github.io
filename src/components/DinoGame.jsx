import { useState, useEffect, useRef, useCallback } from 'react'
import {
  DINO_SPRITE_SRC,
  DINO_FRAME_INDEX,
  DINO_SPRITE_FRAME_W,
  DINO_SPRITE_FRAME_H,
  DINO_NATIVE_W,
  DINO_NATIVE_H,
} from './dinoSprite'

/**
 * Lightweight homage to the Chrome offline T-Rex game, now wired up to the
 * actual Chrome offline sprite sheet so the trex, cacti, horizon and cloud
 * look authentic. Every sprite is tinted to `--text` at load (and re-tinted
 * whenever the theme switches), so the scene always reads correctly in both
 * light and dark mode.
 *
 * Sprite sources live in /public/dino and are all 2x PNGs. Source offsets use
 * 2x coordinates; destination drawing uses 1x coordinates (the canvas scales).
 */

const GAME_WIDTH = 600
const GAME_HEIGHT = 160
const GROUND_Y = 130

const GRAVITY = 0.7
const JUMP_FORCE = -12
const CACTUS_SPEED_BASE = 6

const DINO_W = DINO_NATIVE_W
const DINO_H = DINO_NATIVE_H

// --- Large cactus (obstacle-large-2x.png, 300x100 == 150x50 @1x) ---
// Three obstacle groups laid side-by-side: 1, 2, and 3 cacti.
const LARGE_CACTUS = {
  src: '/dino/obstacle-large-2x.png',
  h: 50,
  groups: [
    { sx: 0,  sw: 25 }, // 1 large cactus
    { sx: 25, sw: 50 }, // 2 large cacti
    { sx: 75, sw: 75 }, // 3 large cacti
  ],
}

// --- Small cactus (obstacle-small-2x.png, 204x70 == 102x35 @1x) ---
const SMALL_CACTUS = {
  src: '/dino/obstacle-small-2x.png',
  h: 35,
  groups: [
    { sx: 0,  sw: 17 }, // 1 small cactus
    { sx: 17, sw: 34 }, // 2 small cacti
    { sx: 51, sw: 51 }, // 3 small cacti
  ],
}

// --- Horizon / ground (horizon-2x.png, 2400x24 == 1200x12 @1x) ---
// Chrome packs two ground textures side-by-side; we just scroll through the
// first (flat) half for simplicity and wrap around when we reach the end.
const HORIZON = {
  src: '/dino/horizon-2x.png',
  w: 600, // 1x width of the flat segment we scroll through
  h: 12,
}

// --- Cloud (cloud-2x.png, 92x28 == 46x14 @1x) ---
const CLOUD = {
  src: '/dino/cloud-2x.png',
  w: 46,
  h: 14,
  speed: 0.3, // drifts slower than the ground
}

/**
 * Produce an RGB-inverted copy of `img` (alpha preserved). Used in dark mode
 * so the Chrome sprites — which ship as fixed #535353 gray — remain legible
 * against a dark background without losing any per-pixel detail (eye, teeth,
 * shading). Generated once per sprite and cached on the images ref.
 */
function invertImage(img) {
  const off = document.createElement('canvas')
  off.width = img.naturalWidth
  off.height = img.naturalHeight
  const c = off.getContext('2d')
  c.imageSmoothingEnabled = false
  c.drawImage(img, 0, 0)
  const data = c.getImageData(0, 0, off.width, off.height)
  const px = data.data
  for (let i = 0; i < px.length; i += 4) {
    px[i]     = 255 - px[i]
    px[i + 1] = 255 - px[i + 1]
    px[i + 2] = 255 - px[i + 2]
    // Leave alpha untouched so transparent pixels stay transparent.
  }
  c.putImageData(data, 0, 0)
  return off
}

export default function DinoGame() {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    playing: false,
    gameOver: false,
    dino: { x: 50, y: GROUND_Y - DINO_H, vy: 0, onGround: true },
    cacti: [],
    clouds: [],
    score: 0,
    frameCount: 0,
    speed: CACTUS_SPEED_BASE,
    groundOffset: 0,
    blinkTimer: 0,
    blinking: false,
  })
  const imagesRef = useRef({
    loaded: false,
    raw: {},       // native sprite sheets (used in light mode)
    inverted: {},  // RGB-inverted copies (used in dark mode)
  })
  const rafRef = useRef(null)
  // Indirection so the `useCallback` for `gameLoop` can schedule itself for
  // the next frame without referencing its own identifier (which would trip
  // react-hooks/immutability and also risk stale closures across re-renders).
  const loopRef = useRef(null)
  const [displayState, setDisplayState] = useState({ playing: false, gameOver: false, score: 0 })

  const spawnCactus = useCallback(() => {
    const isLarge = Math.random() < 0.55
    const def = isLarge ? LARGE_CACTUS : SMALL_CACTUS
    const group = def.groups[Math.floor(Math.random() * def.groups.length)]
    return {
      kind: isLarge ? 'large' : 'small',
      sx: group.sx,
      sw: group.sw,
      w: group.sw,
      h: def.h,
      x: GAME_WIDTH + 20,
      y: GROUND_Y - def.h,
    }
  }, [])

  const spawnCloud = useCallback(() => ({
    x: GAME_WIDTH + 20,
    y: 20 + Math.random() * 40,
  }), [])

  const reset = useCallback(() => {
    const s = stateRef.current
    s.dino = { x: 50, y: GROUND_Y - DINO_H, vy: 0, onGround: true }
    s.cacti = []
    s.clouds = []
    s.score = 0
    s.frameCount = 0
    s.speed = CACTUS_SPEED_BASE
    s.groundOffset = 0
    s.blinkTimer = 0
    s.blinking = false
    s.gameOver = false
    s.playing = true
    setDisplayState({ playing: true, gameOver: false, score: 0 })
  }, [])

  const jump = useCallback(() => {
    const s = stateRef.current
    if (!s.playing || s.gameOver) {
      reset()
      return
    }
    if (s.dino.onGround) {
      s.dino.vy = JUMP_FORCE
      s.dino.onGround = false
    }
  }, [reset])

  // Preload all sprite sheets once.
  useEffect(() => {
    const sources = {
      trex: DINO_SPRITE_SRC,
      cactusLarge: LARGE_CACTUS.src,
      cactusSmall: SMALL_CACTUS.src,
      horizon: HORIZON.src,
      cloud: CLOUD.src,
    }
    const entries = Object.entries(sources)
    let remaining = entries.length
    const raw = {}
    entries.forEach(([key, src]) => {
      const img = new Image()
      img.onload = () => {
        raw[key] = img
        remaining -= 1
        if (remaining === 0) {
          const inverted = {}
          for (const [k, v] of Object.entries(raw)) {
            inverted[k] = invertImage(v)
          }
          imagesRef.current.raw = raw
          imagesRef.current.inverted = inverted
          imagesRef.current.loaded = true
        }
      }
      img.src = src
    })
  }, [])

  const gameLoop = useCallback(() => {
    const s = stateRef.current
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false

    const color = getComputedStyle(document.documentElement)
      .getPropertyValue('--text').trim() || '#535353'

    // Pick raw sprites in light mode, pre-inverted copies in dark mode, so
    // every sprite detail (eye, teeth, shading) survives the theme switch.
    const images = imagesRef.current
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    const sheets = isDark ? images.inverted : images.raw

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

    // ---- Clouds (drift slowly across the sky while playing) ----
    if (sheets.cloud && s.playing) {
      if (s.clouds.length < 3 && Math.random() < 0.004) {
        s.clouds.push(spawnCloud())
      }
      s.clouds.forEach(c => { c.x -= CLOUD.speed })
      s.clouds = s.clouds.filter(c => c.x + CLOUD.w > -10)
    }
    if (sheets.cloud) {
      for (const c of s.clouds) {
        ctx.drawImage(
          sheets.cloud,
          0, 0, CLOUD.w * 2, CLOUD.h * 2,
          Math.round(c.x), Math.round(c.y), CLOUD.w, CLOUD.h,
        )
      }
    }

    // ---- Ground ----
    if (sheets.horizon) {
      // Scroll with wrap-around across the HORIZON.w-wide flat section.
      let remaining = GAME_WIDTH
      let dx = 0
      let sx = s.groundOffset
      while (remaining > 0) {
        const chunk = Math.min(remaining, HORIZON.w - sx)
        ctx.drawImage(
          sheets.horizon,
          sx * 2, 0, chunk * 2, HORIZON.h * 2,
          dx, GROUND_Y, chunk, HORIZON.h,
        )
        remaining -= chunk
        dx += chunk
        sx = 0
      }
    } else {
      ctx.fillStyle = color
      ctx.fillRect(0, GROUND_Y, GAME_WIDTH, 1)
    }

    // ---- Pick current dino frame ----
    let frameKey = 'standing'
    if (s.gameOver) {
      frameKey = 'crashed'
    } else if (s.playing) {
      if (s.dino.onGround) {
        const phase = Math.floor(s.frameCount / 6) % 2
        frameKey = phase === 0 ? 'leftStep' : 'rightStep'
      } else {
        frameKey = 'standing' // airborne
      }
    } else {
      // Idle: slow blink every ~1.5s.
      s.blinkTimer = (s.blinkTimer + 1) % 90
      frameKey = s.blinkTimer < 6 ? 'blink' : 'standing'
    }

    const drawDino = (x, y) => {
      const sprite = sheets.trex
      if (sprite) {
        const index = DINO_FRAME_INDEX[frameKey] ?? DINO_FRAME_INDEX.standing
        ctx.drawImage(
          sprite,
          index * DINO_SPRITE_FRAME_W, 0,
          DINO_SPRITE_FRAME_W, DINO_SPRITE_FRAME_H,
          Math.round(x), Math.round(y), DINO_W, DINO_H,
        )
      } else {
        ctx.fillStyle = color
        ctx.fillRect(Math.round(x), Math.round(y), DINO_W, DINO_H)
      }
    }

    // ---- Paused / game over overlay ----
    if (!s.playing) {
      ctx.font = '12px "Press Start 2P", monospace'
      ctx.fillStyle = color
      ctx.textAlign = 'center'
      ctx.fillText(s.gameOver ? 'G A M E   O V E R' : 'PRESS SPACE', GAME_WIDTH / 2, 60)
      if (s.gameOver) {
        ctx.font = '10px "Press Start 2P", monospace'
        ctx.fillText(`Score: ${String(s.score).padStart(5, '0')}`, GAME_WIDTH / 2, 85)
      }
      drawDino(s.dino.x, GROUND_Y - DINO_H)
      rafRef.current = requestAnimationFrame(loopRef.current)
      return
    }

    s.frameCount++
    s.speed = CACTUS_SPEED_BASE + Math.floor(s.score / 100) * 0.5
    s.groundOffset = (s.groundOffset + s.speed) % HORIZON.w

    // Dino physics
    s.dino.vy += GRAVITY
    s.dino.y += s.dino.vy
    if (s.dino.y >= GROUND_Y - DINO_H) {
      s.dino.y = GROUND_Y - DINO_H
      s.dino.vy = 0
      s.dino.onGround = true
    }

    // Spawn cacti
    const lastCactus = s.cacti[s.cacti.length - 1]
    const minGap = 220 + Math.random() * 160
    if (!lastCactus || lastCactus.x < GAME_WIDTH - minGap) {
      if (s.frameCount > 60 && Math.random() < 0.02) {
        s.cacti.push(spawnCactus())
      }
    }

    // Move cacti
    s.cacti.forEach(c => { c.x -= s.speed })
    s.cacti = s.cacti.filter(c => c.x + c.w > -20)

    // Collision (hitbox slightly tighter than the sprite for forgiveness).
    const d = s.dino
    const padX = 8
    const padTop = 6
    const padBottom = 2
    for (const c of s.cacti) {
      const cPadX = 2
      if (
        d.x + padX < c.x + c.w - cPadX &&
        d.x + DINO_W - padX > c.x + cPadX &&
        d.y + padTop < c.y + c.h &&
        d.y + DINO_H - padBottom > c.y
      ) {
        s.playing = false
        s.gameOver = true
        setDisplayState({ playing: false, gameOver: true, score: s.score })
        break
      }
    }

    // Score
    if (s.playing && s.frameCount % 6 === 0) {
      s.score++
      if (s.score % 50 === 0) {
        setDisplayState({ playing: true, gameOver: false, score: s.score })
      }
    }

    // Draw cacti
    s.cacti.forEach(c => {
      const sprite = c.kind === 'large'
        ? sheets.cactusLarge
        : sheets.cactusSmall
      const def = c.kind === 'large' ? LARGE_CACTUS : SMALL_CACTUS
      if (sprite) {
        ctx.drawImage(
          sprite,
          c.sx * 2, 0, c.sw * 2, def.h * 2,
          Math.round(c.x), Math.round(c.y), c.w, c.h,
        )
      } else {
        ctx.fillStyle = color
        ctx.fillRect(Math.round(c.x), Math.round(c.y), c.w, c.h)
      }
    })

    drawDino(d.x, d.y)

    // Score display (top right)
    ctx.font = '10px "Press Start 2P", monospace'
    ctx.fillStyle = color
    ctx.textAlign = 'right'
    ctx.fillText(String(s.score).padStart(5, '0'), GAME_WIDTH - 10, 20)

    rafRef.current = requestAnimationFrame(loopRef.current)
  }, [spawnCactus, spawnCloud])

  useEffect(() => {
    loopRef.current = gameLoop
  }, [gameLoop])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(() => loopRef.current?.())
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        jump()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [jump])

  return (
    <section style={{
      padding: '60px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
    }}>
      <h2 style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 'clamp(10px, 2.5vw, 14px)',
        letterSpacing: '2px',
        marginBottom: '8px',
      }}>
        {'> '}PLAY
      </h2>

      <div
        onClick={jump}
        style={{
          border: '2px solid var(--text)',
          padding: '2px',
          cursor: 'pointer',
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          style={{
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
            imageRendering: 'pixelated',
          }}
        />
      </div>

      <p style={{
        fontFamily: 'var(--font-terminal)',
        fontSize: '18px',
        color: 'var(--text-muted)',
      }}>
        {displayState.gameOver
          ? 'Tap or press SPACE to retry'
          : displayState.playing
            ? `Score: ${String(displayState.score).padStart(5, '0')}`
            : 'Tap or press SPACE to run'
        }
      </p>
    </section>
  )
}
