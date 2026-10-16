import React, { useState, useEffect } from "react";
import {
  FiMail,
  FiPhone,
  FiGithub,
  FiArrowUpRight,
  FiUser,
  FiTag,
  FiEdit2,
  FiSend,
  FiZap,
  FiMapPin,
  FiLock,
  FiChevronDown,
  FiEye,
} from "react-icons/fi";
import { FaLinkedin, FaHeart } from "react-icons/fa";

const MAX_CHARS = 500;
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const links = [
  {
    icon: <FiMail />,
    title: "Email",
    sub: "rohith.s1500@gmail.com",
    href: "mailto:rohith.s1500@gmail.com",
  },
  {
    icon: <FiPhone />,
    title: "Phone",
    sub: "+91 98864 25645",
    href: "tel:+919886425645",
  },
  {
    icon: <FaLinkedin />,
    title: "LinkedIn",
    sub: "Connect with me",
    href: "https://www.linkedin.com/in/rohith-s-7a9453283/",
    brand: true,
  },
  {
    icon: <FiGithub />,
    title: "GitHub",
    sub: "Explore my code",
    href: "https://github.com/rohiths15900-alt",
  },
  {
    icon: <span className="glyph glyph-naukri">N</span>,
    title: "Naukri",
    sub: "View my profile",
    href: "https://www.naukri.com/mnjuser/homepage",
  },
  {
    icon: <span className="glyph glyph-wf">W</span>,
    title: "Wellfound",
    sub: "Let's work together",
    href: "https://wellfound.com/profile/edit/overview",
  },
];

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "Job Opportunity",
    message: "",
    website: "", // hidden trap field for bots
  });

  const [status, setStatus] = useState({ type: "idle", text: "" }); // idle | sending | success | error
  const [visitors, setVisitors] = useState(null);

  // Visitor counter: count each browser only once
  useEffect(() => {
    const countVisit = async () => {
      try {
        const firstVisit = !localStorage.getItem("visited");
        const res = await fetch(
          firstVisit ? `${API}/api/visitors/hit` : `${API}/api/visitors`,
          { method: firstVisit ? "POST" : "GET" }
        );
        const data = await res.json();
        setVisitors(data.count);
        if (firstVisit) localStorage.setItem("visited", "1");
      } catch {
        /* backend offline: just hide the number */
      }
    };
    countVisit();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "sending", text: "Sending..." });
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setStatus({ type: "success", text: "Message sent! I'll get back to you soon." });
      setForm({ name: "", email: "", subject: "Job Opportunity", message: "", website: "" });
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    }
  };

  return (
    <section className="contact" id="contact">
      {/* ---------- Header ---------- */}
      <div className="upperbox">
        <span className="pill">Let's connect</span>
        <h1>
          Get in <span className="script">touch</span>
        </h1>
        <p>
          Have a project in mind, a job opportunity, or just want to say hi?
          <br />
          I'm always open to meaningful conversations.
        </p>
      </div>

      <div className="lower-box">
        {/* ---------- Left box ---------- */}
        <div className="b1">
          <span className="b1-line" />
          <h2>
            Let's build
            <br />
            something <span className="grad">meaningful.</span>
          </h2>
          <p className="b1-text">
            I'm always excited to connect with people, explore opportunities,
            and turn good ideas into impactful digital experiences. Whether
            it's a project, collaboration, or just a conversation, my inbox is
            always open.
          </p>

          <div className="link-grid">
            {links.map((l) => (
              <a
                key={l.title}
                className="link-card"
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
              >
                <span className={`link-icon ${l.brand ? "brand" : ""}`}>
                  {l.icon}
                </span>
                <span className="link-info">
                  <strong>{l.title}</strong>
                  <small>{l.sub}</small>
                </span>
                <FiArrowUpRight className="link-arrow" />
              </a>
            ))}
          </div>

          <div className="status-row">
            <div className="status">
              <span className="dot" />
              <div>
                <b>Open to opportunities</b>
                <small>Actively looking for new roles</small>
              </div>
            </div>
            <div className="status">
              <FiZap className="status-icon bolt" />
              <div>
                <b>Typical response time</b>
                <small>Within 24 hours</small>
              </div>
            </div>
            <div className="status">
              <FiMapPin className="status-icon pin" />
              <div>
                <b>Currently in</b>
                <small>India (Open to Remote)</small>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Right box (form) ---------- */}
        <form className="b2" onSubmit={handleSubmit}>
          <div className="b2-head">
            <div>
              <h2>Send me a message</h2>
              <p>Fill out the form below and I'll get back to you as soon as possible.</p>
            </div>
            <span className="plane-badge">
              <FiSend />
            </span>
          </div>

          {/* Hidden trap field: real people never see or fill this */}
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            className="hp"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="row">
            <div className="field">
              <label htmlFor="name">
                Your Name <i>*</i>
              </label>
              <div className="input-wrap">
                <FiUser />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="email">
                Your Email <i>*</i>
              </label>
              <div className="input-wrap">
                <FiMail />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="field">
            <label htmlFor="subject">
              Subject <i>*</i>
            </label>
            <div className="input-wrap">
              <FiTag />
              <select
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
              >
                <option>Job Opportunity</option>
                <option>Project / Freelance</option>
                <option>Collaboration</option>
                <option>Just saying hi</option>
              </select>
              <FiChevronDown className="chevron" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="message">
              Message <i>*</i>
            </label>
            <div className="input-wrap textarea-wrap">
              <FiEdit2 />
              <textarea
                id="message"
                name="message"
                maxLength={MAX_CHARS}
                placeholder="Tell me about your idea, opportunity or just say hi..."
                value={form.message}
                onChange={handleChange}
                required
              />
              <span className="counter">
                {form.message.length}/{MAX_CHARS}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="send-btn"
            disabled={status.type === "sending"}
          >
            {status.type === "sending" ? "Sending..." : "Send Message"} <FiSend />
          </button>

          {status.type !== "idle" && status.type !== "sending" && (
            <p className={`form-status ${status.type}`} role="status">
              {status.text}
            </p>
          )}

          <p className="safe">
            <FiLock /> Your information is safe with me. I'll never share your
            details.
          </p>
        </form>
      </div>

      {/* ---------- Footer ---------- */}
      <footer className="contact-footer">
        <p className="quote">“Good ideas always lead to great conversations”</p>
        <p className="credit">
          Designed &amp; built by <span>Rohith</span> <FaHeart />
          <i className="sep" /> © 2026
          <i className="sep" />
          <FiEye /> {visitors === null ? "—" : visitors.toLocaleString()} visitors
        </p>
      </footer>
    </section>
  );
};

export default Contact;