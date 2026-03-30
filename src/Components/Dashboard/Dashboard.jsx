import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../Components/common/Button";
import SectionWrapper from "../../Components/common/SectionWrapper";
import StatsSection from "../../Components/common/StatsSection";
import TechnologyMarquee from "../../Components/common/TechnologyMarquee";
import { productCatalog, serviceItems } from "../../data/siteContent";
import "./Dashboard.css";

const slides = [
  {
    id: "engineering-platforms",
    heading: "Engineering scalable software platforms",
    description: "We help enterprises modernize and scale digital products.",
  },
  {
    id: "cloud-data",
    heading: "Cloud and data solutions for modern businesses",
    description: "Build resilient infrastructure and unlock data-driven decisions.",
  },
  {
    id: "digital-experience",
    heading: "Transform your digital experience",
    description: "Deliver seamless web and mobile applications at scale.",
  },
  {
    id: "consulting-outcomes",
    heading: "Consulting that drives real outcomes",
    description: "Align technology with business goals for measurable impact.",
  },
];

const heroStats = [
  { value: "10+", label: "Service Lines" },
  { value: "100+", label: "Client Engagements" },
  { value: "10+", label: "Locations" },
];

const Dashboard = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const servicesViewportRef = useRef(null);
  const servicesTrackRef = useRef(null);
  const carouselMetricsRef = useRef({ step: 0 });
  const totalSlides = slides.length;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % totalSlides);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [totalSlides]);

  const syncActiveService = useCallback(() => {
    const viewport = servicesViewportRef.current;
    const track = servicesTrackRef.current;
    if (!viewport || !track) return;

    const cards = Array.from(track.querySelectorAll(".services-carousel-card"));
    if (cards.length === 0) return;

    const viewportCenter = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
    let nextActiveIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        nextActiveIndex = index;
      }
    });

    setActiveServiceIndex((currentIndex) =>
      currentIndex === nextActiveIndex ? currentIndex : nextActiveIndex
    );
  }, []);

  const updateCarouselMetrics = useCallback(() => {
    const track = servicesTrackRef.current;
    if (!track) return;

    const card = track.querySelector(".services-carousel-card");
    if (!card) return;

    const styles = window.getComputedStyle(track);
    const gapValue = parseFloat(styles.columnGap || styles.gap || "0");
    const cardWidth = card.getBoundingClientRect().width;

    carouselMetricsRef.current = {
      step: cardWidth + gapValue,
    };

    syncActiveService();
  }, [syncActiveService]);

  const scrollServicesBy = useCallback(
    (direction) => {
      const viewport = servicesViewportRef.current;
      const { step } = carouselMetricsRef.current;
      if (!viewport || !step) return;

      const maxScrollLeft = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
      const nextScrollLeft = Math.min(
        Math.max(viewport.scrollLeft + direction * step, 0),
        maxScrollLeft
      );

      viewport.scrollTo({
        left: nextScrollLeft,
        behavior: "smooth",
      });
    },
    []
  );

  useEffect(() => {
    const viewport = servicesViewportRef.current;
    if (!viewport) return undefined;

    let scrollFrameId = 0;
    let setupFrameId = window.requestAnimationFrame(() => {
      setupFrameId = 0;
      updateCarouselMetrics();
    });

    const handleScroll = () => {
      if (scrollFrameId) {
        window.cancelAnimationFrame(scrollFrameId);
      }

      scrollFrameId = window.requestAnimationFrame(() => {
        scrollFrameId = 0;
        syncActiveService();
      });
    };

    const handleResize = () => {
      updateCarouselMetrics();
    };

    viewport.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      if (setupFrameId) {
        window.cancelAnimationFrame(setupFrameId);
      }

      if (scrollFrameId) {
        window.cancelAnimationFrame(scrollFrameId);
      }

      viewport.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [syncActiveService, updateCarouselMetrics]);

  const handleProductCardPointerEnter = useCallback((event) => {
    event.currentTarget.style.setProperty("--homepage-products-glow-opacity", "1");
  }, []);

  const handleProductCardPointerMove = useCallback((event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.setProperty("--homepage-products-glow-x", `${x}px`);
    card.style.setProperty("--homepage-products-glow-y", `${y}px`);
    card.style.setProperty("--homepage-products-glow-opacity", "1");
  }, []);

  const handleProductCardPointerLeave = useCallback((event) => {
    event.currentTarget.style.setProperty("--homepage-products-glow-opacity", "0");
  }, []);

  return (
    <div className="page-shell">
      <section className="hero-section homepage-hero">
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`slide${index === activeSlide ? " active" : ""}`}
              aria-hidden={index !== activeSlide}
            >
              <div className="hero-content">
                <h1>{slide.heading}</h1>
                <p>{slide.description}</p>
                <div className="hero-actions hero-buttons">
                  <Button to="/services">
                    Explore Services
                    <ArrowRight size={18} />
                  </Button>
                  <Button to="/contact" variant="secondary">
                    Contact Us
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hero-dots" aria-label="Hero slide navigation">
          {slides.map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              className={`dot${index === activeSlide ? " active" : ""}`}
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="executive-section">
        <div className="container">
          <div className="executive-card">
            <div className="executive-card-left">
              <span className="executive-accent" aria-hidden="true" />
              <div>
                <h2>Executive Summary</h2>
                <p className="executive-subtitle">Pirnav Software Solutions</p>
              </div>
            </div>

            <div className="executive-card-right">
              <p>
                Pirnav Software Solutions provides on-demand tech resources to fuel your
                projects, both short-term and long-term. Our team of seasoned professionals
                across various technologies can seamlessly integrate into your existing
                workflow, delivering the expertise you need, when you need it.
              </p>

              <Link to="/about" className="primary-btn executive-cta">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <StatsSection items={heroStats} className="homepage-stats section-surface-muted" />

      <SectionWrapper
        className="section-surface-white homepage-technologies-section"
        // title="Technologies with us"
      >
        <TechnologyMarquee />
      </SectionWrapper>

      <section className="services-carousel-section">
        <div className="container">
          <div className="services-carousel-wrapper">
            <button
              type="button"
              className="carousel-arrow left"
              onClick={() => scrollServicesBy(-1)}
              aria-label="Scroll services left"
            >
              <span aria-hidden="true">&larr;</span>
            </button>

            <div className="services-carousel" ref={servicesViewportRef}>
              <div className="carousel-track" ref={servicesTrackRef}>
                {serviceItems.map((service, index) => (
                  <article
                    className={`services-carousel-card${
                      index === activeServiceIndex ? " is-active" : ""
                    }`}
                    key={service.slug || index}
                  >
                    <div className="services-carousel-card-inner">
                      <div className="services-carousel-icon">
                        {service.icon && <service.icon size={22} />}
                      </div>
                      <h3>{service.title}</h3>
                      <p>{service.summary}</p>
                      {service.highlights && service.highlights.length > 0 && (
                        <div className="services-carousel-tags">
                          {service.highlights.map((highlight) => (
                            <span key={highlight} className="services-carousel-tag">
                              {highlight}
                            </span>
                          ))}
                        </div>
                      )}
                      <Link to={`/services/${service.slug}`} className="carousel-card-button">
                        Learn more
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="carousel-arrow right"
              onClick={() => scrollServicesBy(1)}
              aria-label="Scroll services right"
            >
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      </section>

      <SectionWrapper
        className="section-surface-white homepage-products-section"
        eyebrow="Products"
        title="Scalable software products built for business operations."
        description="Explore a snapshot of our product portfolio, designed to support people operations, accounting workflows, and digital experiences."
        contentClassName="homepage-products-grid"
      >
        {productCatalog.map((product, index) => {
          const productLabel = product.cardLabel || product.title;
          const productHeading = product.cardTitle || product.subtitle || product.title;

          return (
          <article
            key={product.id}
            className="story-card homepage-products-card reveal"
            style={{ transitionDelay: `${index * 80}ms` }}
            onPointerEnter={handleProductCardPointerEnter}
            onPointerMove={handleProductCardPointerMove}
            onPointerLeave={handleProductCardPointerLeave}
          >
            <div className="homepage-products-card-media">
              <img src={product.image} alt={product.alt} loading="lazy" />
            </div>

            <div className="homepage-products-card-body">
              <div className="homepage-products-card-copy">
                <p className="homepage-products-card-label">{productLabel}</p>
                <h3>{productHeading}</h3>
                <p>{product.description}</p>
              </div>
              <div className="homepage-products-card-actions">
                <Link to="/products" className="button button-secondary button-sm homepage-products-card-action">
                  Explore Product
                </Link>
              </div>
            </div>
          </article>
          );
        })}
      </SectionWrapper>

      <SectionWrapper className="section-surface-muted homepage-why-cta">
        <div className="why-cta-panel">
          <div className="why-cta-copy">
            <span className="why-cta-label">Why Choose Us</span>
            <h2>Why customer's work with us.</h2>
            <p>
              We combine consulting discipline, engineering depth, and delivery accountability
              to help organizations modernize technology without unnecessary complexity.
            </p>
          </div>
          <div className="why-cta-actions">
            <Button to="/contact">Talk to Our Team</Button>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="section-surface-muted careers-cta-section">
        <div className="enterprise-careers-panel">
          <div className="careers-cta-copy">
            <span className="careers-cta-label">Careers</span>
            <h2>Join our engineering teams.</h2>
            <p>
              Work on enterprise software, cloud modernization, and consulting-led delivery programs
              with teams that value quality and accountability. Explore open roles across software
              engineering, QA, support, and enterprise technology consulting.
            </p>
          </div>
          <div className="careers-cta-actions">
            <Button to="/careers">View Open Roles</Button>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default Dashboard;
