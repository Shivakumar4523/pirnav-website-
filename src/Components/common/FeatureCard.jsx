import useRevealOnScroll from "./useRevealOnScroll";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay = 0,
  layout = "vertical",
  className = "",
}) => {
  const ref = useRevealOnScroll();
  const classes = [
    "feature-card",
    "reveal",
    layout === "horizontal" ? "feature-card-horizontal" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      ref={ref}
      className={classes}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="feature-icon">{Icon && <Icon size={22} />}</div>
      <div className="feature-card-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
};

export default FeatureCard;
