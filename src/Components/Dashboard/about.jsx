import SectionWrapper from "../../components/common/SectionWrapper";
import FeatureCard from "../../components/common/FeatureCard";
import StatsSection from "../../components/common/StatsSection";
import { aboutPillars, homeStats } from "../../data/siteContent";

const About = () => {
  return (
    <div className="page-shell">
      <section
        className="hero-section page-banner page-banner-left page-banner-light"
        style={{
          "--banner-image":
            "url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2400&q=85')",
        }}
      >
        <div className="section-shell page-banner-content page-banner-left-content">
          <span className="hero-badge">About Pirnav</span>
          <h1>Technology consulting and engineering teams built for enterprise delivery.</h1>
          <p>
            We help organizations build scalable digital platforms, modernize engineering
            capabilities, and deliver reliable technology outcomes.
          </p>
        </div>
      </section>

      <SectionWrapper
        className="section-surface-white about-company-overview"
        eyebrow="Company Overview"
        title="A technology consulting company focused on modern software platforms and enterprise execution."
        description="Pirnav supports application delivery, cloud modernization, QA, enterprise systems, and staffing programs through practical engineering and consulting partnerships."
      >
        <div className="page-grid-2 about-company-overview-grid">
          <div className="content-stack">
            <article className="story-card about-company-overview-story">
              <h3>Built around long-term delivery partnerships</h3>
              <p>
                We work with organizations that need dependable execution across digital
                products, enterprise platforms, support operations, and engineering
                transformation initiatives.
              </p>
              <p>
                Our approach combines consulting clarity, engineering capability, and
                measurable delivery discipline so technology investments create lasting value.
              </p>
            </article>
            <div className="page-grid-2 company-principles about-company-overview-principles">
              <article className="story-card">
                <h3>Mission</h3>
                <p>Deliver reliable technology platforms and scalable engineering support for modern enterprises.</p>
              </article>
              <article className="story-card">
                <h3>Vision</h3>
                <p>Help organizations innovate faster through modern engineering, structured delivery, and better technology decisions.</p>
              </article>
            </div>
          </div>
          <div className="story-image">
            <img
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=3840&q=90"
              alt="Leadership team collaborating in a modern office"
              loading="lazy"
            />
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper
        className="section-surface-muted about-how-we-work"
        eyebrow="How We Work"
        title="Consulting thinking combined with practical engineering execution."
        description="We move from discovery to delivery with clear accountability, cross-functional collaboration, and a focus on long-term platform health."
      >
        <div className="page-grid-2 about-how-we-work-grid">
          <div className="story-image about-how-we-work-image">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=3840&q=90"
              alt="Software consulting team collaborating around laptops in a modern workspace"
              loading="lazy"
            />
          </div>
          <div className="content-stack about-how-we-work-content">
            <article className="story-card about-how-we-work-story">
              <h2>Structured delivery for complex environments</h2>
              <p>
                Our teams support planning, implementation, modernization, and operational
                improvement across customer-facing software, internal business systems, and
                enterprise support programs.
              </p>
              <p>
                We prioritize maintainable solutions, clearer communication, and delivery
                models that can scale with business and platform complexity.
              </p>
            </article>
          </div>
        </div>
      </SectionWrapper>

      <StatsSection items={homeStats} className="section-surface-white about-stats-section" />

      <SectionWrapper
        className="section-surface-muted about-core-strengths"
        eyebrow="Core Strengths"
        title="The principles behind our consulting and engineering model."
        description="These pillars shape how we approach planning, delivery quality, and long-term client partnerships."
      >
        <div className="strength-grid about-pillars-grid">
          {aboutPillars.slice(0, 3).map((pillar, index) => (
            <FeatureCard
              key={pillar.title}
              icon={pillar.icon}
              title={pillar.title}
              description={pillar.description}
              delay={index * 80}
              layout="horizontal"
              className="about-pillar-card"
            />
          ))}
        </div>
      </SectionWrapper>

    </div>
  );
};

export default About;
