import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import PolyParticles from './PolyParticles'

gsap.registerPlugin(useGSAP)

const TITLE = [
  { text: 'Building' },
  { text: 'digital', highlight: true, glitch: true },
  { text: 'experiences', highlight: true },
  { text: 'that' },
  { text: 'matter.' },
]

const Hero = () => {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Full animation (users who haven't requested reduced motion)
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

        tl.from('.hero-greeting', { y: 20, opacity: 0, duration: 0.8 })
          // script name "writes" itself in from the left
          .from(
            '.hero-name',
            {
              clipPath: 'inset(-30% 100% -30% -10%)',
              duration: 1.1,
              ease: 'power2.inOut',
            },
            '<0.15'
          )
          // title: each word slides up out of its mask
          .from(
            '.hero-title .word',
            { yPercent: 115, duration: 1.1, stagger: 0.08 },
            '-=0.6'
          )
          .from(
            '.hero-desc',
            { y: 30, opacity: 0, filter: 'blur(6px)', duration: 0.9, clearProps: 'filter' },
            '-=0.7'
          )
          .from('.hero-actions', { y: 24, opacity: 0, duration: 0.8 }, '-=0.6')

        // image comes in from the right edge
        tl.from(
          '.right-image img',
          { x: 90, opacity: 0, scale: 1.06, duration: 1.5, ease: 'power3.out' },
          0.2
        ).from('.poly-canvas', { opacity: 0, duration: 1.6, ease: 'power1.inOut' }, '-=1')
      })

      // Reduced motion: simple fade only
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.from(root.current, { opacity: 0, duration: 0.5 })
      })
    },
    { scope: root }
  )

  return (
    <div className="hero" ref={root}>
      <div className="left-text">
        <h3 className="hero-greeting">
          Hi, I'm <span className="hero-name">Rohith</span> 👋
        </h3>

    
      <h1 className="hero-title" aria-label="Building Digital Experiences">
        {TITLE.map((w, i) => (
          <React.Fragment key={i}>
            <span className="word-mask" aria-hidden="true">
              <span
  className={`word ${w.highlight ? 'hero-highlight' : ''} ${
    w.glitch ? 'glitch' : ''
  }`}
  data-text={w.text}
>
  {w.text}
</span>
            </span>{' '}
          </React.Fragment>
        ))}
      </h1>


        <p className="hero-desc">
          I'm a software developer passionate about building modern web
          applications and intelligent solutions that combine thoughtful
          design with powerful technology.
        </p>

        <div className="hero-actions">
          
          <a href="#contact" className='tell'><button className="hero-btn">Let's Connect</button></a>

          <span className="hero-status">
            <i className="status-dot"></i> OPEN TO OPPORTUNITIES
          </span>
        </div>
      </div>

      <div className="right-image">
        <PolyParticles />
        <img src="/hero.png" alt="R Logo" />
      </div>
    </div>
  )
}

export default Hero