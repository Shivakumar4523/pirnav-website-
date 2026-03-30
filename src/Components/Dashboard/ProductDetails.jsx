import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../../Components/common/Button";
import SectionWrapper from "../../Components/common/SectionWrapper";
import ServiceContent from "../../Components/common/ServiceContent";
import ServiceHero from "../../Components/common/ServiceHero";
import { getProductById } from "../../data/productsData";
import "./Products.css";

const PRODUCT_HERO_OVERLAY =
  "linear-gradient(90deg, rgba(2, 6, 23, 0.84) 0%, rgba(15, 23, 42, 0.68) 46%, rgba(15, 23, 42, 0.28) 100%)";

const PRODUCT_NOT_FOUND_IMAGE =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1800&q=85";

const ProductDetails = ({ id: providedId }) => {
  const { id: routeId } = useParams();
  const resolvedId = providedId || routeId;
  const product = getProductById(resolvedId);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [resolvedId]);

  if (!product) {
    return (
      <div className="page-shell product-details-page">
        <ServiceHero
          eyebrow="Product"
          title="Product not found"
          description="The product you are looking for is unavailable or the link is incorrect."
          image={PRODUCT_NOT_FOUND_IMAGE}
          overlay={PRODUCT_HERO_OVERLAY}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Products", to: "/products" },
            { label: "Not Found" },
          ]}
        />

        <SectionWrapper
          className="section-surface-white product-details-overview-section"
          eyebrow="Explore More"
          title="Browse the available product portfolio."
          description="Return to the products page to review the current solutions available across operations, finance, and digital delivery."
        >
          <div className="product-details-toolbar">
            <Button to="/products" variant="secondary" size="sm">
              Back to Products
            </Button>
          </div>
        </SectionWrapper>
      </div>
    );
  }

  const productDisplayName = product.heroTitle || product.cardTitle || product.subtitle || product.title;

  return (
    <div className="page-shell product-details-page">
      <ServiceHero
        eyebrow="Product Spotlight"
        title={productDisplayName}
        description={product.tagline}
        image={product.image}
        overlay={PRODUCT_HERO_OVERLAY}
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Products", to: "/products" },
          { label: productDisplayName },
        ]}
      />

      <SectionWrapper
        className="section-surface-white product-details-overview-section"
        eyebrow="Overview"
        title={`${productDisplayName} backed by delivery experience and implementation depth.`}
        description={product.overview}
      >
        <div className="product-details-toolbar reveal">
          <div className="product-details-highlights">
            {product.proofPoints.map((point) => (
              <span key={point} className="product-highlight-chip">
                {point}
              </span>
            ))}
          </div>

          <div className="product-details-toolbar-actions">
            <Button to="/contact" size="sm" className="product-details-demo-button">
              Contact Us
            </Button>
            <Button to="/products" variant="secondary" size="sm">
              Back to Products
            </Button>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper
        className="section-surface-muted product-details-delivery-section"
        eyebrow="Delivery Strength"
        title="The expertise and deliverables clients rely on when building business-critical solutions."
        description="We combine implementation experience, technical depth, and business-context awareness to deliver platforms that work in real operating environments."
      >
        <div className="service-detail-grid product-details-grid">
          <ServiceContent
            title="Our Expertise"
            description="Our team specializes in designing and delivering secure, scalable business systems shaped around practical workflow needs."
            items={product.expertise}
          />
          <ServiceContent
            title="What We Deliver"
            description="We focus on implementation-ready outcomes that clients can adopt, extend, and depend on as operations evolve."
            items={product.deliverables}
          />
        </div>
      </SectionWrapper>

      <SectionWrapper
        className="section-surface-white product-details-results-section"
        eyebrow="Client Outcomes"
        title="Business impact shaped by successful real-world delivery."
        description="Our implementation approach is centered on measurable improvements in efficiency, visibility, control, and long-term scalability."
      >
        <div className="service-detail-grid product-details-grid">
          <ServiceContent
            title="Business Impact"
            description="These are the kinds of operational improvements clients look for when they invest in purpose-built business platforms."
            items={product.impact}
          />
          <ServiceContent
            title="Client Use Cases"
            description="We have successfully delivered similar solutions across practical business scenarios where reliability and workflow fit matter most."
            items={product.useCases}
          />
        </div>

        <div className="product-trust-grid">
          {product.whyChooseUs.map((reason, index) => (
            <article
              key={reason.title}
              className="content-panel product-trust-card reveal"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <span className="product-module-kicker">Why Choose Us</span>
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
            </article>
          ))}
        </div>

        <div className="content-panel product-details-cta-panel reveal">
          <div className="product-details-cta-copy">
            <span className="product-module-kicker">Next Step</span>
            <h3>Looking for a team that can deliver {productDisplayName} with confidence?</h3>
            <p>
              We can walk through similar delivery experience, discuss your workflow requirements,
              and map out the right architecture and implementation path for your business.
            </p>
          </div>

          <div className="product-details-cta-actions">
            <Button to="/contact" size="sm">
              Talk to Our Team
            </Button>
            <Button to="/products" variant="secondary" size="sm">
              View All Products
            </Button>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default ProductDetails;
