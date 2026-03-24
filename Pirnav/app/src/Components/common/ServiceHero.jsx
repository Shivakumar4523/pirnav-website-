import { Link } from "react-router-dom";

const ServiceHero = ({
  title,
  description,
  image,
  breadcrumbs = [],
  eyebrow = "Service",
  overlay = "linear-gradient(rgba(15, 23, 42, 0.46), rgba(15, 23, 42, 0.46))",
}) => {
  return (
    <section
      className="hero-section page-banner page-banner-left page-banner-light service-detail-hero"
      style={{
        "--banner-image": `url('${image}')`,
        "--banner-overlay": overlay,
      }}
    >
      <div className="section-shell page-banner-content page-banner-left-content service-detail-hero-content">
        <span className="hero-badge">{eyebrow}</span>
        <h1>{title}</h1>
        <div className="breadcrumb-row service-detail-breadcrumbs">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.label}>
              {index > 0 && <span className="breadcrumb-separator">/</span>}
              {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span>{crumb.label}</span>}
            </span>
          ))}
        </div>
        <p>{description}</p>
      </div>
    </section>
  );
};

export default ServiceHero;
