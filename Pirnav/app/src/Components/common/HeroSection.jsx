import { ArrowRight } from "lucide-react";
import Button from "./Button";
import useRevealOnScroll from "./useRevealOnScroll";

const HeroSection = ({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  metrics = [],
  image,
  imageAlt,
  className = "",
  imageClassName = "",
  children,
}) => {
  const ref = useRevealOnScroll();

  return (
    <section className={`hero-section ${className}`.trim()}>
      <div className="hero-noise" />
      <div ref={ref} className="section-shell hero-grid reveal">
        <div className="hero-copy">
          {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
          <h1>{title}</h1>
          <p>{description}</p>

          <div className="hero-actions">
            {primaryAction && (
              <Button to={primaryAction.to} href={primaryAction.href}>
                {primaryAction.label}
                <ArrowRight size={18} />
              </Button>
            )}
            {secondaryAction && (
              <Button
                to={secondaryAction.to}
                href={secondaryAction.href}
                variant="secondary"
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>

          {metrics.length > 0 && (
            <div className="hero-metrics">
              {metrics.map((metric) => (
                <div key={metric.label} className="hero-metric">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`hero-visual ${imageClassName}`.trim()}>
          {image && (
            <img
              src={image}
              alt={imageAlt}
              loading="lazy"
              decoding="async"
            />
          )}
          {children}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
