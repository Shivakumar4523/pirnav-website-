import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import useRevealOnScroll from "./useRevealOnScroll";

const ServiceCard = ({
  title,
  description,
  image,
  to,
  icon: Icon,
  delay = 0,
}) => {
  const ref = useRevealOnScroll();

  return (
    <div
      ref={ref}
      className="flip-card reveal reveal-card"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flip-card-inner">
        <Link
          to={to}
          className="flip-card-front service-card-link service-card-modern service-card"
        >
          <div className="service-card-media">
            <img src={image} alt={title} loading="lazy" />
          </div>
          <div className="service-card-body">
            <div className="service-card-head">
              <div className="service-card-title-row">
                <div className="feature-icon">{Icon && <Icon size={20} />}</div>
                <h3>{title}</h3>
              </div>
              <ArrowRight size={18} className="service-card-arrow" />
            </div>
            <p>{description}</p>
          </div>
        </Link>
        <div className="flip-card-back">
          <h3>Learn More</h3>
          <p>Explore how our solutions help modern enterprises scale technology platforms.</p>
          <Link to={to} className="card-btn">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
