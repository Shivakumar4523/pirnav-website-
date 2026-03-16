import Button from "./Button";
import useRevealOnScroll from "./useRevealOnScroll";

const CTASection = ({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  className = "",
}) => {
  const ref = useRevealOnScroll();

  return (
    <section className={`section-block ${className}`.trim()}>
      <div ref={ref} className="section-shell reveal">
        <div className="cta-panel">
          <div className="cta-copy">
            {eyebrow && <span className="section-eyebrow section-eyebrow-light">{eyebrow}</span>}
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <div className="cta-actions">
            {primaryAction && <Button to={primaryAction.to}>{primaryAction.label}</Button>}
            {secondaryAction && (
              <Button to={secondaryAction.to} variant="secondary">
                {secondaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
