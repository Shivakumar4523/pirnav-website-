import { Cpu } from "lucide-react";

const TechnologyGrid = ({ items }) => {
  return (
    <div className="technology-grid tech-stack">
      {items.map((item) => (
        <article key={item} className="technology-card">
          <div className="technology-icon">
            <Cpu size={18} />
          </div>
          <span>{item}</span>
        </article>
      ))}
    </div>
  );
};

export default TechnologyGrid;
