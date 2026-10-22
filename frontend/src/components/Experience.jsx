import React, { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// import './Experience.css' // styles now live in App.css + theme.css

gsap.registerPlugin(ScrollTrigger)

// Placeholder content: replace titles, descriptions, images and links
const DESC =
  'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Atque, corrupti magnam! Mollitia ratione laborum neque atque. Quo deleniti ipsum et hic quasi culpa numquam tenetur quas.'

const PROJECTS = [
  {
    title: 'Therapy website',
    tags: ['Next.js', 'Frontend', 'UI design'],
    description:
      'A modern therapy website built with Next.js, focused entirely on the frontend. It has an elegant UI with therapist information, mental health specialities, therapeutic methods, FAQs and contact navigation. A calming colour palette, refined typography and nature-inspired visuals make it feel welcoming and professional.',
    image: '/therapy.png',
    link: 'https://github.com/rohiths15900-alt/Therapy-website-clone',
  },
  {
    title: 'Text-to-image generator web app',
    tags: ['Flask', 'Python', 'Hugging Face API'],
    description:
      'A user-friendly Flask web app that turns text prompts into images using the Hugging Face Inference API. Users type their idea, the app sends it to the API and shows the returned image on the page. Generated images are saved with timestamps.',
    image: '/imagegen.png',
    link: 'https://github.com/rohiths15900-alt/Text-to-Image-Generator-using-Hugging-face-API',
  },
  {
    title: 'Online voting system using MERN stack',
    tags: ['MongoDB', 'Express', 'React', 'Node.js'],
    description:
      'SmartVote is a web application that lets voters access election-related features through a website, while administrators use a separate dashboard.',
    image: '/vote.png',
    link: 'https://github.com/rohiths15900-alt/Online-Voting-System',
  },
  {
    title: 'BookKaro – Online Discovery Platform',
    tags: ['Frontend', 'Search UI', 'UX'],
    description:
      'A frontend-only web app for exploring restaurants, hotels, destinations, healthcare and automotive services. It has a search bar, location-based search fields, category-wise listings and simple navigation, with a focus on visual aesthetics and user experience.',
    image: '/book.png',
    link: 'https://github.com/rohiths15900-alt/Book-Karo',
  },
  {
    title: 'Diabetes detection using AI breath analyzer',
    tags: ['Raspberry Pi', 'Gas sensors', 'Machine learning'],
    description:
      'An AI-powered, non-invasive diabetes screening system built with a breath analyzer, Raspberry Pi, gas sensors and machine learning. It analyzes acetone levels in exhaled breath to classify people as normal, pre-diabetic or diabetic, giving a portable, low-cost way to do preliminary screening.',
    image: '/device.png',
    link: 'https://drive.google.com/drive/folders/1-O39Ke4BRZKDFSlEOg_7aPwszggOGMI0?usp=sharing',
    linkType: 'drive',
  },
  {
    title: 'Portfolio',
    tags: ['UI design', 'React.js', 'MongoDB', 'Full Stack', 'Node.js','Deployment'],
    description: "Developed a modern, responsive personal portfolio website using the MERN stack, featuring React.js for the frontend and Node.js with Express.js for backend functionality. The website showcases my technical skills, projects, professional profile, and contact information through a clean, interactive, and visually appealing user interface.",
    image: '/heroo.png',
    link: 'https://github.com/rohiths15900-alt/Portfolio',
  },
  {
    title: 'Taskly – To-do app',
    tags: ['React Native', 'Firebase Auth', 'MongoDB', 'Node.js'],
    description:
      'A cross-platform to-do app built with React Native. Users sign in with Firebase Authentication, and tasks are stored in MongoDB through a Node.js backend. It has onboarding, task tracking with completed and pending stats, and a clean, easy-to-use interface.',
    image: '/app.png',
    link: 'https://github.com/rohiths15900-alt/Taskly',
    apkLink: 'https://drive.google.com/file/d/1Z1lsgtaEHIf1PWyejzFPNR0Y5_wiiS17/view?usp=sharing',
  },
  {
    // closing "coming soon" card
    title: 'To be continued…',
    comingSoon: true,
    description: 'More projects are on the way. Check back soon.',
  },
]

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
  </svg>
)

const DriveIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
  </svg>
)

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3v12" />
    <path d="m7 10 5 5 5-5" />
    <path d="M5 21h14" />
  </svg>
)

const Experience = () => {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const progressRef = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const track = trackRef.current
      const getDistance = () => track.scrollWidth - window.innerWidth

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => '+=' + getDistance(),
          pin: true,
          scrub: true, // Lenis already smooths the scroll
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`
            }
          },
        },
      })

      // Each card eases in as it slides into view (tied to the horizontal scroll)
      gsap.utils.toArray('.cardd', track).forEach((card) => {
        const scrollTrigger = {
          trigger: card,
          containerAnimation: tween,
          start: 'left 92%',
          end: 'left 55%',
          scrub: true,
        }
        gsap.fromTo(card, { opacity: 0.3, scale: 0.94 }, { opacity: 1, scale: 1, ease: 'none', scrollTrigger })
        const img = card.querySelector('.frame-shot img')
        if (img) gsap.fromTo(img, { scale: 1.14 }, { scale: 1, ease: 'none', scrollTrigger })
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="exp" ref={sectionRef} aria-labelledby="projects-heading">
      <header className="main-head">
        <h1 id="projects-heading">Projects</h1>
        <p>Things I have built. Keep scrolling to move through them.</p>
      </header>

      <div className="track-wrap">
        <div className="track" ref={trackRef}>
          {PROJECTS.map((p) =>
            p.comingSoon ? (
              <article className="cardd cardd--soon" key={p.title}>
                <div className="soon-dots" aria-hidden="true">
                  <i /><i /><i />
                </div>
                <h2>{p.title}</h2>
                <p>{p.description}</p>
              </article>
            ) : (
              <article className="cardd" key={p.title}>
                <div className="cardd-body">
                  <h2>{p.title}</h2>
                  {p.tags.length > 0 && (
                    <ul className="tags">
                      {p.tags.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  )}
                  <p>{p.description}</p>
                  <div className="cardd-links" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    <a
                      className="gh-btn"
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${p.title} ${p.linkType === 'drive' ? 'project files on Google Drive' : 'on GitHub'}`}
                    >
                      {p.linkType === 'drive' ? <DriveIcon /> : <GithubIcon />}
                      <span>{p.linkType === 'drive' ? 'View project files' : 'View on GitHub'}</span>
                    </a>
                    {p.apkLink && (
                      <a
                        className="gh-btn"
                        href={p.apkLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${p.title} live APK download`}
                      >
                        <DownloadIcon />
                        <span>Download APK</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="cardd-media">
                  <div className="frame">
                    <div className="frame-bar" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </div>
                    <div className="frame-shot">
                      <img src={p.image} alt={`${p.title} preview`} loading="lazy" />
                    </div>
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      </div>

      <div className="progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>
    </section>
  )
}

export default Experience