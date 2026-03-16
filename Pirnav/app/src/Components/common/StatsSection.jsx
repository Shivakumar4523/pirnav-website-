import useRevealOnScroll from "./useRevealOnScroll";

const StatsSection = ({ items, className = "" }) => {
  const ref = useRevealOnScroll();

  return (
    <section className={`section-block stats-section ${className}`.trim()}>
      <div ref={ref} className="section-shell reveal">
        <div className="stats-grid">
          {items.map((item, index) => (
              <article
                key={item.label}
                className="stat-card reveal"
                style={{ transitionDelay: `${index * 70}ms` }}
              >
              <h2>{item.value}</h2>
              <p>{item.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
