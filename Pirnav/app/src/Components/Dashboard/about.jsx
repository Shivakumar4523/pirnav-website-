import { Link } from "react-router-dom";
import SectionWrapper from "../../components/common/SectionWrapper";
import FeatureCard from "../../components/common/FeatureCard";
import StatsSection from "../../components/common/StatsSection";
import CTASection from "../../components/common/CTASection";
import { aboutPillars, homeStats } from "../../data/siteContent";

const About = () => {
  return (
    <div className="page-shell">
      <section
        className="page-banner page-banner-light"
        style={{
          "--banner-image":
            "url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2400&q=85')",
        }}
      >
        <div className="section-shell page-banner-content">
          <span className="section-eyebrow section-eyebrow-light">About Pirnav</span>
          <h1>Technology consulting and engineering teams built for enterprise delivery.</h1>
          <div className="breadcrumb-row">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>About</span>
          </div>
          <p>
            We help organizations build scalable digital platforms, modernize engineering
            capabilities, and deliver reliable technology outcomes.
          </p>
        </div>
      </section>

      <SectionWrapper
        className="section-surface-white"
        eyebrow="Company Overview"
        title="A technology consulting company focused on modern software platforms and enterprise execution."
        description="Pirnav supports application delivery, cloud modernization, QA, enterprise systems, and staffing programs through practical engineering and consulting partnerships."
      >
        <div className="page-grid-2">
          <div className="content-stack">
            <article className="story-card">
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
            <div className="page-grid-2 company-principles">
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
        className="section-surface-muted"
        eyebrow="How We Work"
        title="Consulting thinking combined with practical engineering execution."
        description="We move from discovery to delivery with clear accountability, cross-functional collaboration, and a focus on long-term platform health."
      >
        <div className="page-grid-2">
          <div className="story-image">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=3840&q=90"
              alt="Enterprise workshop session focused on technology planning"
              loading="lazy"
            />
          </div>
          <div className="content-stack">
            <article className="story-card">
              <h3>Structured delivery for complex environments</h3>
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

      <StatsSection items={homeStats} className="section-surface-white" />

      <SectionWrapper
        className="section-surface-muted"
        eyebrow="Core Strengths"
        title="The principles behind our consulting and engineering model."
        description="These pillars shape how we approach planning, delivery quality, and long-term client partnerships."
        align="center"
      >
        <div className="strength-grid">
          {aboutPillars.map((pillar, index) => (
            <FeatureCard
              key={pillar.title}
              icon={pillar.icon}
              title={pillar.title}
              description={pillar.description}
              delay={index * 80}
            />
          ))}
        </div>
      </SectionWrapper>

      <CTASection
        className="internal-page-cta"
        eyebrow="Work With Us"
        title="Ready to start your next project with us?"
        description="Talk to Pirnav about building scalable technology platforms, improving delivery operations, or extending engineering capacity."
        primaryAction={{ label: "Start a Conversation", to: "/contact" }}
        secondaryAction={{ label: "Explore Services", to: "/services" }}
      />
    </div>
  );
};

export default About;
