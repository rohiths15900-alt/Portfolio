import React, { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaReact, FaHtml5, FaCss3Alt, FaJs } from 'react-icons/fa'
import { SiExpress, SiGreensock, SiMongodb } from 'react-icons/si'


gsap.registerPlugin(ScrollTrigger)

// Lenis has no brand icon in react-icons, so this is a simple custom mark
const LenisIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 4v13a2 2 0 0 0 2 2h8" />
    <circle cx="17" cy="6" r="1.6" fill="currentColor" stroke="none" />
  </svg>
)

const TECH = [
  { name: 'React', Icon: FaReact },
  { name: 'Express', Icon: SiExpress },
  { name: 'MongoDB', Icon: SiMongodb },
  { name: 'HTML', Icon: FaHtml5 },
  { name: 'CSS', Icon: FaCss3Alt },
  { name: 'Lenis', Icon: LenisIcon },
  { name: 'GSAP', Icon: SiGreensock },
  { name: 'JavaScript', Icon: FaJs },
]

// Repeat the list so one group is always wider than the screen
const GROUP = [...TECH, ...TECH]

const Group = ({ hidden }) => (
  <ul className="stack-group" aria-hidden={hidden || undefined}>
    {GROUP.map(({ name, Icon }, i) => (
      <li className="stack-item" key={`${name}-${i}`}>
        <span className="stack-icon">
          {React.createElement(Icon)}
        </span>
        <span className="stack-name">{name}</span>
      </li>
    ))}
  </ul>
)

const Stack = () => {
  const trackRef = useRef(null)

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const ctx = gsap.context(() => {
      // Right to left, forever. The track holds two identical groups,
      // so moving by -50% loops with no jump.
      const loop = gsap.to(trackRef.current, {
        xPercent: -50,
        ease: 'none',
        duration: 40,
        repeat: -1,
      })

      // Scrolling the page makes the strip speed up, then settle back
      ScrollTrigger.create({
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 5)
          gsap.timeline({ overwrite: true })
            .to(loop, { timeScale: boost, duration: 0.2 })
            .to(loop, { timeScale: 1, duration: 1 })
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="stack" aria-labelledby="stack-heading">
      <header className="stack-head" data-reveal="heading">
        <h2 id="stack-heading" className="section-title">Tech used in this portfolio</h2>
        <p className="section-sub">The tools behind this site.</p>
      </header>

      <div className="stack-marquee" data-reveal>
        <div className="stack-track" ref={trackRef}>
          <Group />
          <Group hidden />
        </div>
      </div>
    </section>
  )
}

export default Stack