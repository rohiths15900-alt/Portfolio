import React, { useState, useEffect } from "react";

// ids of the sections the nav links point to (used for the active-link highlight)
const SECTION_IDS = ["about", "skills", "exp", "contact"];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false); // slides away while scrolling down
  const [scrolled, setScrolled] = useState(false); // glass background after scrolling
  const [active, setActive] = useState("");

  // Close the mobile menu when the screen becomes desktop-sized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close the menu when Escape is pressed
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Hide on scroll down, show on scroll up, glass background once scrolled
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y < 120) setHidden(false);
      else if (y > last + 4) setHidden(true);
      else if (y < last - 4) setHidden(false);
      if (y < 200) setActive("");
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the link of the section that is in the middle of the screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const linkClass = (id) => (active === id ? "is-active" : undefined);

  return (
    <nav
      className={`nav ${scrolled ? "nav--scrolled" : ""} ${
        hidden && !menuOpen ? "nav--hidden" : ""
      }`}
    >
      {/* Logo */}
      <div className="left">
        <a href="#home" onClick={closeMenu} aria-label="Go to top of the page">
          <img src="/RLogo.png" alt="R Logo" />
        </a>
      </div>

      {/* Hamburger Button */}
      <button
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls="navbar-menu"
        type="button"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Navigation Links */}
      <div id="navbar-menu" className={`right ${menuOpen ? "menu-open" : ""}`}>
        <a href="#about" className={linkClass("about")} onClick={closeMenu}>
          ABOUT
        </a>
        <a href="#skills" className={linkClass("skills")} onClick={closeMenu}>
          SKILLS
        </a>
        <a href="#exp" className={linkClass("exp")} onClick={closeMenu}>
          PROJECTS
        </a>
        <a href="#experience" onClick={closeMenu}>
          EXPERIENCE
        </a>
        <a href="#contact" className={linkClass("contact")} onClick={closeMenu}>
          CONTACT
        </a>
        <a
          href="/rohith.pdf"
          className="resume-btn"
          download
          onClick={closeMenu}
        >
          RESUME <span>↗</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;