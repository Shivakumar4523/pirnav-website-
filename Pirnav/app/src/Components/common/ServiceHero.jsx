import { Link } from "react-router-dom";

const ServiceHero = ({ title, description, image, breadcrumbs = [], eyebrow = "Service" }) => {
  return (
    <section
      className="page-banner page-banner-light service-detail-hero"
      style={{ "--banner-image": `url('${image}')` }}
    >
      <div className="section-shell page-banner-content">
        <span className="section-eyebrow section-eyebrow-light">{eyebrow}</span>
        <h1>{title}</h1>
        <div className="breadcrumb-row">
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
