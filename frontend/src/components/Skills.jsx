import React from "react";
import {
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaNodeJs,
  FaPython,
  FaFigma,
  FaBootstrap,
  FaGitAlt,
  FaBrain,
} from "react-icons/fa";

import {
  SiJavascript,
  SiTailwindcss,
  SiExpress,
  SiMongodb,
  SiNextdotjs,
  SiGreensock,
  SiFlask,
  SiMysql,
  SiPostman,
  SiGithub,
  SiWordpress,
  SiFirebase,
  SiDocker,
} from "react-icons/si";

const skills = [
  { name: "React.js", icon: <FaReact /> },
  { name: "JavaScript", icon: <SiJavascript /> },
  { name: "Next.js", icon: <SiNextdotjs /> },
  { name: "MongoDB", icon: <SiMongodb /> },
  { name: "Express.js", icon: <SiExpress /> },
  { name: "Node.js", icon: <FaNodeJs /> },
  { name: "HTML5", icon: <FaHtml5 /> },
  { name: "CSS3", icon: <FaCss3Alt /> },
  { name: "Figma", icon: <FaFigma /> },
  { name: "Python", icon: <FaPython /> },
  { name: "Git/GitHub", icon: <SiGithub /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss /> },
  { name: "Bootstrap", icon: <FaBootstrap /> },
  { name: "GSAP", icon: <SiGreensock /> },
  { name: "AI/ML", icon: <FaBrain /> },
  { name: "Flask", icon: <SiFlask /> },
  { name: "SQL", icon: <SiMysql /> },
  { name: "Postman", icon: <SiPostman /> },
  { name: "Git", icon: <FaGitAlt /> }
];

const Skills = () => {
  return (
    <section className="skills" id="skills">
      <div className="skills-heading">
        {/* <span className="skills-label">
          WHAT I WORK WITH
        </span> */}

        <h2>Skills</h2>

        <p>
          These are the technologies I've worked with
          and continue to explore.
        </p>
      </div>

      <div className="skills-grid">
        {skills.map((skill) => (
          <div className="skill-card" key={skill.name}>
            <span className="skill-icon" aria-hidden="true">
              {skill.icon}
            </span>

            <span className="skill-name">
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;