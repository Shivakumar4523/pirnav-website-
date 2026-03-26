import SectionWrapper from "../../components/common/SectionWrapper";
import ServiceContent from "../../components/common/ServiceContent";
import ServiceHero from "../../components/common/ServiceHero";
import TechnologyGrid from "../../components/common/TechnologyGrid";
import { serviceItems } from "../../data/siteContent";

const ServiceDetailPage = ({ slug }) => {
  const service = serviceItems.find((item) => item.slug === slug);

  if (!service) {
    return null;
  }

  return (
    <div className="page-shell">
      <ServiceHero
        eyebrow="Technology Service"
        title={service.heroTitle || `${service.title} Services`}
        description={service.intro}
        image={service.image}
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Services", to: "/services" },
          { label: service.title },
        ]}
      />

      <SectionWrapper
        className="section-surface-white"
        eyebrow="Service Overview"
        title={`${service.title} built for enterprise delivery.`}
        description={service.overview || service.summary}
      >
        <div className="service-detail-grid">
          <ServiceContent
            title="Key Capabilities"
            description="Capabilities aligned to modern engineering delivery, platform scale, and enterprise execution."
            items={service.capabilities || service.features}
          />
          <ServiceContent
            title="Business Benefits"
            description="Outcomes designed to improve platform resilience, delivery speed, and operational confidence."
            items={service.benefits || service.outcomes}
          />
        </div>
      </SectionWrapper>

      <SectionWrapper
        className="section-surface-muted"
        eyebrow="Related Technologies"
        title="Platforms and technologies we use in delivery."
        description="Technology choices are aligned to business context, integration needs, security requirements, and long-term maintainability."
      >
        <TechnologyGrid items={service.technologies || []} />
      </SectionWrapper>

    </div>
  );
};

export default ServiceDetailPage;
