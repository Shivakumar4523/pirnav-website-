import SectionWrapper from "../../Components/common/SectionWrapper";
import ServiceCard from "../../Components/common/ServiceCard";
import { serviceItems } from "../../data/siteContent";

const PublicServices = () => {
  return (
    <div className="page-shell">
      <section
        className="hero-section page-banner page-banner-left page-banner-light"
        style={{
          "--banner-image":
            "url('/images/Service.jpg')",
          "--banner-overlay":
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))",
        }}
      >
        <div className="section-shell page-banner-content page-banner-left-content">
          <span className="hero-badge">Services</span>
          <h1>Our Technology Services</h1>
          <p>
            We help enterprises design, build, and scale reliable technology platforms
            across engineering, cloud, data, and business-critical systems.
          </p>
        </div>
      </section>

      <SectionWrapper
        className="section-surface-white services-catalog-section"
        eyebrow="Service Catalog"
        title="Join Pirnav and make experiences better with technology."
        description="Create with purpose, innovate for impact, and fast track your tech career."
      >
        <div className="service-grid">
          {serviceItems.map((service, index) => (
            <ServiceCard
              key={service.slug}
              title={service.title}
              description={service.summary}
              image={service.image}
              icon={service.icon}
              to={`/services/${service.slug}`}
              delay={index * 70}
            />
          ))}
        </div>
      </SectionWrapper>

    </div>
  );
};

export default PublicServices;
