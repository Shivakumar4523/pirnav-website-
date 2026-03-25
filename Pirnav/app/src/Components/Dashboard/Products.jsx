import { Link } from "react-router-dom";
import SectionWrapper from "../../components/common/SectionWrapper";
import { productCatalog } from "../../data/siteContent";
import "./Products.css";

const Products = () => {
  const handleCardPointerEnter = (event) => {
    event.currentTarget.style.setProperty("--products-glow-opacity", "1");
  };

  const handleCardPointerMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.setProperty("--products-glow-x", `${x}px`);
    card.style.setProperty("--products-glow-y", `${y}px`);
    card.style.setProperty("--products-glow-opacity", "1");
  };

  const handleCardPointerLeave = (event) => {
    event.currentTarget.style.setProperty("--products-glow-opacity", "0");
  };

  return (
    <div id="products" className="page-shell products-page">
      <section
        className="hero-section page-banner page-banner-left page-banner-light"
        style={{
          "--banner-image":
            "url('https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=2400&q=85')",
          "--banner-overlay":
            "linear-gradient(90deg, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.55) 50%, rgba(15, 23, 42, 0.15) 100%)",
        }}
      >
        <div className="section-shell page-banner-content page-banner-left-content">
          <span className="hero-badge">OUR PRODUCTS</span>
          <h1>Scalable solutions built for modern businesses</h1>
          <p>
            Explore our enterprise-grade applications designed to streamline
            operations and drive efficiency.
          </p>
        </div>
      </section>

      <SectionWrapper
        className="section-surface-white products-catalog-section"
        eyebrow="Product Portfolio"
        title="Purpose-built applications for operations, finance, and digital growth."
        description="Our product suite combines practical workflows, clean user experiences, and scalable engineering to help teams move faster with confidence."
        contentClassName="products-grid"
      >
        {productCatalog.map((product, index) => {
          const productLabel = product.cardLabel || product.title;
          const productHeading = product.cardTitle || product.subtitle || product.title;

          return (
          <article
            key={product.id}
            className="story-card products-card reveal"
            style={{ transitionDelay: `${index * 80}ms` }}
            onPointerEnter={handleCardPointerEnter}
            onPointerMove={handleCardPointerMove}
            onPointerLeave={handleCardPointerLeave}
          >
            <div className="products-card-media">
              <img src={product.image} alt={product.alt} loading="lazy" />
            </div>

            <div className="products-card-body">
              <div className="products-card-copy">
                <p className="products-card-label">{productLabel}</p>
                <h3>{productHeading}</h3>
                <p>{product.description}</p>
              </div>

              <div className="products-card-actions">
                <Link
                  to="/contact"
                  className="button button-primary button-sm products-card-action"
                >
                  Contact Us
                </Link>

                <Link
                  to={`/products/${product.id}`}
                  className="button button-secondary button-sm products-card-action"
                >
                  Explore
                </Link>
              </div>
            </div>
          </article>
          );
        })}
      </SectionWrapper>
    </div>
  );
};

export default Products;
