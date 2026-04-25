/**
 * Constants describing the official Chrome offline-game T-Rex sprite sheet.
 *
 * The PNG (in /public/dino) is a 2x copy of Chrome's "1x-trex" image,
 * 528x94 with six 88x94 frames laid out horizontally:
 *   0 → idle / jumping
 *   1 → blink (eye closed)
 *   2 → running, left foot forward
 *   3 → running, right foot forward
 *   4 → unused intermediate
 *   5 → crashed (X eye)
 *
 * Kept in a dedicated module (rather than exported alongside the component)
 * so Dino.jsx can stay Fast-Refresh friendly.
 */

export const DINO_SPRITE_SRC = '/dino/trex-2x.png'

export const DINO_NATIVE_W = 44
export const DINO_NATIVE_H = 47

export const DINO_SPRITE_FRAME_W = 88
export const DINO_SPRITE_FRAME_H = 94
export const DINO_SPRITE_FRAME_COUNT = 6

export const DINO_FRAME_INDEX = {
  standing: 0,
  blink: 1,
  leftStep: 2,
  rightStep: 3,
  crashed: 5,
}
