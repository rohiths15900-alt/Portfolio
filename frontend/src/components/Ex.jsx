import React from 'react'
import { FiCalendar, FiMapPin, FiCheckCircle, FiSettings } from 'react-icons/fi'
import { FaReact, FaNodeJs, FaGithub } from 'react-icons/fa'
import { SiMongodb, SiExpress } from 'react-icons/si'
// import './Ex.css' // or paste Ex.css at the bottom of App.css

/* ------------------------------------------------------------------
   EDIT YOUR EXPERIENCE HERE (add more objects for more jobs)
   `logo`: put an image in /public and use e.g. "/pentagon.png".
           Leave it null to use the built-in skyline artwork.
------------------------------------------------------------------- */
const EXPERIENCE = [
  {
    period: '2026 Feb – 2026 July',
    type: 'Internship',
    company: 'Pentagon Space Pvt. Ltd.',
    role: 'MERN Stack Developer Intern',
    location: 'India',
    logo: null,
    points: [
      'Developed responsive web applications using MongoDB, Express.js, React.js, and Node.js.',
      'Implemented RESTful APIs and connected frontend components with backend services.',
      'Collaborated with team members using Git and GitHub for version control and code reviews.',
      'Improved application performance and user experience through efficient UI design.',
    ],
    tech: [
      { name: 'MongoDB', Icon: SiMongodb, color: '#47a248' },
      { name: 'Express.js', Icon: SiExpress, color: '#ffffff' },
      { name: 'React.js', Icon: FaReact, color: '#61dafb' },
      { name: 'Node.js', Icon: FaNodeJs, color: '#6cc24a' },
      { name: 'REST APIs', Icon: FiSettings, color: '#ffffff' },
      { name: 'Git & GitHub', Icon: FaGithub, color: '#ffffff' },
    ],
  },
]

/* ---------- built-in company artwork (skyline + orbit) ---------- */
const SkylineLogo = () => (
  <svg viewBox="0 0 120 120" className="exxx-logo-svg" aria-hidden="true">
    <defs>
      <linearGradient id="exxxBuild" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#67e8f9" />
        <stop offset="1" stopColor="#67e8f9" stopOpacity="0.15" />
      </linearGradient>
    </defs>
    <g fill="none" stroke="url(#exxxBuild)" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M52 100V34l10-12 10 12v66" />
      <path d="M62 22v78M52 52h20M52 70h20" opacity=".6" />
      <path d="M34 100V66h14v34" />
      <path d="M74 100V62h16v38" />
      <path d="M28 100h68" />
    </g>
    <path
      d="M14 92C42 104 88 78 98 38"
      fill="none"
      stroke="#fff"
      strokeOpacity=".9"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="98" cy="38" r="3.2" fill="#fff" />
    <circle cx="68" cy="68" r="4.6" fill="#fff" />
  </svg>
)

/* ---------- faint polygon mesh in the card's top-right corner ---------- */
const Mesh = () => (
  <svg className="exxx-mesh" viewBox="0 0 280 210" aria-hidden="true">
    <g stroke="#fff" strokeWidth="1" fill="none" opacity=".35">
      <path d="M20 30l80 40 70-16 60 54" />
      <path d="M100 70l40 80 70-16" />
      <path d="M170 54l-30 96" />
      <path d="M210 134l50 40" />
    </g>
    <g fill="#fff">
      <circle cx="20" cy="30" r="2" opacity=".6" />
      <circle cx="170" cy="54" r="3.2" />
      <circle cx="100" cy="70" r="2" opacity=".7" />
      <circle cx="260" cy="108" r="2" opacity=".6" />
    </g>
    <circle cx="210" cy="134" r="3.4" className="exxx-mesh-glow" />
  </svg>
)

const Ex = () => {
  return (
    <section className="exxx" id="experience" aria-labelledby="experience-heading">
      <header className="exxx-head" data-reveal="heading">
        <h2 id="experience-heading" className="section-title">
          Experience
        </h2>
        <p className="section-sub">Where I've learned, built, and grown.</p>
      </header>

      <div className="exxx-list">
        {EXPERIENCE.map((job) => (
          <div className="exxx-item" key={`${job.company}-${job.period}`}>
            {/* ---------- timeline ---------- */}
            <div className="exxx-timeline" aria-hidden="true">
              <div className="exxx-date">
                <strong>{job.period}</strong>
                <span>{job.type}</span>
              </div>
              <div className="exxx-rail">
                <span className="exxx-node" />
                <span className="exxx-line" />
                <span className="exxx-end" />
              </div>
            </div>

            {/* ---------- card ---------- */}
            <article className="exxx-card" data-reveal>
              <Mesh />

              <div className="exxx-top">
                <div className="exxx-logo">
                  {job.logo ? (
                    <img src={job.logo} alt={`${job.company} logo`} />
                  ) : (
                    <SkylineLogo />
                  )}
                </div>

                <div className="exxx-info">
                  <span className="exxx-badge">{job.type}</span>
                  <h3 className="exxx-company">{job.company}</h3>
                  <p className="exxx-role">{job.role}</p>
                  <p className="exxx-meta">
                    <span>
                      <FiCalendar aria-hidden="true" /> {job.type}
                    </span>
                    <i className="exxx-sep" aria-hidden="true" />
                    <span>
                      <FiMapPin aria-hidden="true" /> {job.location}
                    </span>
                  </p>
                </div>
              </div>

              <ul className="exxx-points">
                {job.points.map((point) => (
                  <li key={point}>
                    <FiCheckCircle aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <ul className="exxx-tech" aria-label="Technologies used">
                {job.tech.map(({ name, Icon, color }) => (
                  <li className="exxx-chip" key={name}>
                    {React.createElement(Icon, { style: { color }, 'aria-hidden': true })}
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Ex