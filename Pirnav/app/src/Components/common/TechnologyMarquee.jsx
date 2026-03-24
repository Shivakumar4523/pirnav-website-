import {
  SiAmazonwebservices,
  SiDocker,
  SiGit,
  SiGooglecloud,
  SiKubernetes,
  SiMongodb,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiTypescript,
} from "react-icons/si";

const technologies = [
  { name: "React", icon: SiReact, color: "#61dafb" },
  { name: "Node.js", icon: SiNodedotjs, color: "#3c873a" },
  { name: "AWS", icon: SiAmazonwebservices, color: "#ff9900" },
  { name: "Python", icon: SiPython, color: "#3776ab" },
  { name: "Docker", icon: SiDocker, color: "#2496ed" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178c6" },
  { name: "Kubernetes", icon: SiKubernetes, color: "#326ce5" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#336791" },
  { name: "MongoDB", icon: SiMongodb, color: "#47a248" },
  { name: "Google Cloud", icon: SiGooglecloud, color: "#4285f4" },
  { name: "Git", icon: SiGit, color: "#f05032" },
];

const TechnologyMarquee = () => {
  return (
    <div className="technologies-marquee-shell">
      <div className="technologies-marquee-viewport">
        <div className="technologies-marquee-track">
          {[0, 1].map((copyIndex) => (
            <div
              key={`technology-group-${copyIndex}`}
              className="technologies-marquee-group"
              aria-hidden={copyIndex === 1}
            >
              {technologies.map((technology) => {
                const Icon = technology.icon;

                return (
                  <article
                    key={`${copyIndex}-${technology.name}`}
                    className="technology-marquee-item"
                    style={{ "--logo-color": technology.color }}
                  >
                    <Icon className="technology-marquee-icon" aria-hidden="true" />
                    <span>{technology.name}</span>
                  </article>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnologyMarquee;
