import About from './About'
import DinoGame from './DinoGame'
import Hero from './Hero'
import LatestPosts from './LatestPosts'
import Links from './Links'

/**
 * The original single-page experience. Lives in its own component now so the
 * router in `App.jsx` can swap it out for `/blog` and `/blog/:slug` without
 * leaking dino-game keybindings or the intro animation onto post pages.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="ground-line" />
      <About />
      <div className="ground-line" />
      <LatestPosts />
      <div className="ground-line" />
      <Links />
      <div className="ground-line" />
      <DinoGame />
    </>
  )
}
