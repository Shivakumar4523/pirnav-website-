import useRevealOnScroll from "./useRevealOnScroll";

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  const ref = useRevealOnScroll();

  return (
    <article
      ref={ref}
      className="feature-card reveal"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="feature-icon">{Icon && <Icon size={22} />}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
};

export default FeatureCard;
