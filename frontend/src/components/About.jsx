import React from 'react'


const SERVICES = [
  {
    title: 'Frontend development',
    text: 'Building responsive, interactive user interfaces using HTML, CSS, JavaScript and React.',
    icon: (
      <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
    ),
  },
  {
    title: 'Full-stack development',
    text: 'Exploring backend development, REST APIs, databases and application architecture with the MERN stack.',
    icon: (
      <>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
      </>
    ),
  },
  {
    title: 'Problem solving',
    text: 'Learning through hands-on projects, trying new technologies and finding practical fixes for real problems.',
    icon: (
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V17h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2Z" />
    ),
  },
]

const About = () => {
  return (
    <section className="about" id="about" aria-labelledby="about-heading">
      <header className="about-head" data-reveal="heading">
        <h2 id="about-heading" className="section-title">About me</h2>
        <p className="section-sub">A bit about who I am and what I like to build.</p>
      </header>

      <div className="about-grid">
        {/* Photo */}
        <div className="about-photo-col">
          <div className="about-photo" data-reveal>
            <img src="/meee.png" alt="Portrait of Rohith" loading="lazy" />
          </div>
        </div>

        {/* Content */}
        <div className="about-content">
          <div data-reveal>
            <h3 className="about-lead">
              Turning ideas into <span className="hero-highlight">digital experiences.</span>
            </h3>
            <p>
              I'm Rohith, a Computer Science student and aspiring software developer passionate
              about building modern, responsive and interactive web experiences.
            </p>
            <p>
              I enjoy turning ideas into working digital products, exploring new technologies and
              solving problems through code. My main focus is frontend development with React,
              while I keep growing my skills in backend and full-stack development.
            </p>
            <p>
              I believe great development is about more than writing code. It's about creating
              experiences that are intuitive, accessible, visually appealing and genuinely useful.
            </p>
          </div>

          <div className="about-block" data-reveal>
            <h3 className="about-subtitle">What I do</h3>
            <div className="about-cards">
              {SERVICES.map((s) => (
                <article className="about-card" key={s.title}>
                  <span className="about-card-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {s.icon}
                    </svg>
                  </span>
                  <h4>{s.title}</h4>
                  <p>{s.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="about-focus" data-reveal>
            <h3 className="about-subtitle">My current focus</h3>
            <p>
              I'm strengthening my development fundamentals, building meaningful projects and
              working toward becoming a developer who can take an idea from concept to
              implementation.
            </p>
            <p>
              I'm always open to learning, collaborating and exploring opportunities where I can
              contribute, grow and build something meaningful.
            </p>
          </div>

          <div className="about-actions" data-reveal>
            <a
              className="about-btn about-btn--primary"
              href="/rohith's_resume.pdf"
              download="Rohith_Resume.pdf"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3v12m0 0-4-4m4 4 4-4M4 21h16" />
              </svg>
              <span>Download resume</span>
            </a>
            <a className="about-btn about-btn--ghost" href="#contact">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <span>Contact me</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About