import React, { useLayoutEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Render <ScrollEffects /> ONCE inside <App />  (and remove <SmoothScroll />,
 * this component already contains Lenis).
 *
 * What it does for the whole site
 *  - Lenis smooth scroll, driven by GSAP's ticker (ScrollTrigger stays in sync)
 *  - Top scroll-progress bar
 *  - Section titles "write" themselves in (suits the Allura script font)
 *  - Skill / about / contact cards pop in row by row
 *  - About photo: reveal + parallax
 *  - Contact: left box, form, link cards and footer animate in
 *  - Magnetic buttons + depth parallax in the hero (mouse devices only)
 *  - Anything with data-reveal fades up
 *  - Nav links glide with Lenis ( #home scrolls to the top )
 * Reduced-motion users get native scrolling and no animation.
 */

const FINE_POINTER = '(hover: hover) and (pointer: fine)'
const WRITE_FROM = 'inset(-30% 100% -30% -10%)'
const WRITE_TO = 'inset(-30% -10% -30% -10%)'

// Pop cards in row by row without fighting their CSS hover transitions
const popIn = (targets, { y = 40, scale = 0.96, stagger = 0.07, start = 'top 92%' } = {}) => {
  const items = gsap.utils.toArray(targets)
  if (!items.length) return
  gsap.set(items, { opacity: 0, y, scale })
  ScrollTrigger.batch(items, {
    start,
    once: true,
    onEnter: (batch) => {
      batch.forEach((el) => (el.style.transition = 'none'))
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: 'power3.out',
        stagger,
        overwrite: true,
        onComplete: () => {
          gsap.set(batch, { clearProps: 'transform,opacity' })
          batch.forEach((el) => (el.style.transition = ''))
        },
      })
    },
  })
}

const ScrollEffects = () => {
  const barRef = useRef(null)

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis = null
    let tick = null
    let ctx = null
    let mm = null

    /* ---------------- Lenis ---------------- */
    if (!reduce) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })
      lenis.on('scroll', ScrollTrigger.update)
      tick = (time) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    }

    /* ---------------- Anchor links ---------------- */
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')
      if (!id || id.length < 2) return

      if (id === '#home' || id === '#top') {
        e.preventDefault()
        if (lenis) lenis.scrollTo(0, { duration: 1.4 })
        else window.scrollTo({ top: 0 })
        return
      }

      const target = document.querySelector(id)
      if (!target) return
      e.preventDefault()
      if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 })
      else target.scrollIntoView()
    }
    document.addEventListener('click', onClick)

    if (!reduce) {
      /* ---------------- Scroll-triggered animations ---------------- */
      ctx = gsap.context(() => {
        // 0. Top progress bar
        if (barRef.current) {
          gsap.to(barRef.current, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { start: 0, end: 'max', scrub: 0.2 },
          })
        }

        // 1. Section headings: the title writes itself in, then the subtitle rises
        gsap.utils
          .toArray('.skills-heading, .main-head, .upperbox, [data-reveal="heading"]')
          .forEach((el) => {
            const title = el.querySelector('h1, h2')
            const rest = Array.from(el.children).filter((c) => c !== title)
            const tl = gsap.timeline({
              scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            })
            if (title) {
              tl.fromTo(
                title,
                { clipPath: WRITE_FROM, y: 24 },
                {
                  clipPath: WRITE_TO,
                  y: 0,
                  duration: 1.3,
                  ease: 'power2.inOut',
                  clearProps: 'clipPath,transform',
                }
              )
            }
            if (rest.length) {
              tl.from(
                rest,
                { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 },
                title ? '-=0.7' : 0
              )
            }
          })

        // 2. Skills
        popIn('.skill-card')

        // 3. About: photo reveal + parallax, cards stagger
        const photo = document.querySelector('.about-photo')
        if (photo) {
          gsap.fromTo(
            photo,
            { clipPath: 'inset(100% 0% 0% 0% round 14px)' },
            {
              clipPath: 'inset(0% 0% 0% 0% round 14px)',
              duration: 1.3,
              ease: 'power4.inOut',
              clearProps: 'clipPath',
              scrollTrigger: { trigger: photo, start: 'top 85%', once: true },
            }
          )
          const img = photo.querySelector('img')
          if (img) {
            gsap.fromTo(
              img,
              { scale: 1.2, yPercent: -7 },
              {
                yPercent: 7,
                ease: 'none',
                scrollTrigger: {
                  trigger: photo,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              }
            )
          }
        }
        popIn('.about-card', { y: 30, stagger: 0.12, start: 'top 90%' })

        // 4. Contact
        popIn('.contact .link-card', { y: 30, scale: 0.97, stagger: 0.07, start: 'top 92%' })

        gsap.from('.contact .status', {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '.contact .status-row', start: 'top 94%', once: true },
        })

        const formKids = gsap.utils.toArray('.contact .b2 > *:not(.hp)')
        if (formKids.length) {
          gsap.from(formKids, {
            y: 22,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.08,
            delay: 0.15,
            scrollTrigger: { trigger: '.contact .b2', start: 'top 85%', once: true },
          })
        }

        gsap.from('.contact-footer > *', {
          y: 20,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: '.contact-footer', start: 'top 98%', once: true },
        })

        // 5. Anything else tagged data-reveal (photo handled above)
        gsap.utils
          .toArray('[data-reveal]:not([data-reveal="heading"]):not(.about-photo)')
          .forEach((el) => {
            gsap.from(el, {
              y: 50,
              opacity: 0,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            })
          })
      })

      /* ---------------- Media-dependent effects ---------------- */
      mm = gsap.matchMedia()

      // Contact boxes slide in from the sides on wide screens, rise on small ones
      mm.add('(min-width: 1101px)', () => {
        const trigger = { trigger: '.contact .lower-box', start: 'top 82%', once: true }
        gsap.from('.contact .b1', { x: -70, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: trigger })
        gsap.from('.contact .b2', { x: 70, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: trigger })
      })
      mm.add('(max-width: 1100px)', () => {
        gsap.utils.toArray('.contact .b1, .contact .b2').forEach((el) => {
          gsap.from(el, {
            y: 50,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          })
        })
      })

      // Hero parallax as you scroll away (desktop / tablet)
      mm.add('(min-width: 901px)', () => {
        const hero = document.querySelector('.hero')
        if (!hero) return
        const scrub = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
        gsap.to('.hero .right-image img', { yPercent: 8, ease: 'none', scrollTrigger: scrub })
        gsap.to('.hero .left-text', { y: -50, opacity: 0.25, ease: 'none', scrollTrigger: scrub })
      })

      // Mouse-only: magnetic buttons + hero depth
      mm.add(FINE_POINTER, () => {
        const cleanups = []

        gsap.utils
          .toArray('.hero-btn, .about-btn, .gh-btn, .send-btn, .resume-btn')
          .forEach((el) => {
            el.setAttribute('data-magnet', '')
            const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.5)' })
            const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.5)' })
            const move = (e) => {
              const r = el.getBoundingClientRect()
              xTo((e.clientX - (r.left + r.width / 2)) * 0.3)
              yTo((e.clientY - (r.top + r.height / 2)) * 0.3)
            }
            const leave = () => {
              xTo(0)
              yTo(0)
            }
            el.addEventListener('pointermove', move)
            el.addEventListener('pointerleave', leave)
            cleanups.push(() => {
              el.removeEventListener('pointermove', move)
              el.removeEventListener('pointerleave', leave)
              el.removeAttribute('data-magnet')
              gsap.set(el, { clearProps: 'x,y' })
            })
          })

        // The polygon network drifts against the mouse for a bit of depth
        const hero = document.querySelector('.hero')
        const poly = hero && hero.querySelector('.poly-canvas')
        if (hero && poly) {
          const xTo = gsap.quickTo(poly, 'x', { duration: 1, ease: 'power3' })
          const yTo = gsap.quickTo(poly, 'y', { duration: 1, ease: 'power3' })
          const move = (e) => {
            const r = hero.getBoundingClientRect()
            xTo(-((e.clientX - r.left) / r.width - 0.5) * 36)
            yTo(-((e.clientY - r.top) / r.height - 0.5) * 36)
          }
          hero.addEventListener('pointermove', move)
          cleanups.push(() => {
            hero.removeEventListener('pointermove', move)
            gsap.set(poly, { clearProps: 'x,y' })
          })
        }

        return () => cleanups.forEach((fn) => fn())
      })
    }

    /* ---------------- Keep positions right ---------------- */
    // Section positions change once fonts/images load and after the pinned
    // Projects section adds its spacing.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh)
    const late = gsap.delayedCall(0.6, refresh)

    return () => {
      late.kill()
      window.removeEventListener('load', refresh)
      document.removeEventListener('click', onClick)
      if (mm) mm.revert()
      if (ctx) ctx.revert()
      if (tick) gsap.ticker.remove(tick)
      if (lenis) lenis.destroy()
    }
  }, [])

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={barRef} />
    </div>
  )
}

export default ScrollEffects