import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SectionWrapper from "../../components/common/SectionWrapper";
import FeatureCard from "../../components/common/FeatureCard";
import CTASection from "../../components/common/CTASection";
import { whyJoinUs } from "../../data/siteContent";

const BASE_URL = "https://farrandly-interalar-talon.ngrok-free.dev/api";

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${BASE_URL}/Jobs/public`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        const data = await response.json();

        if (Array.isArray(data)) {
          setJobs(data);
        } else if (data.$values) {
          setJobs(data.$values);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="page-shell">
      <section
        className="page-banner page-banner-light"
        style={{
          "--banner-image":
            "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2400&q=85')",
        }}
      >
        <div className="section-shell page-banner-content">
          <span className="section-eyebrow section-eyebrow-light">Careers</span>
          <h1>Build your career with us.</h1>
          <div className="breadcrumb-row">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Careers</span>
          </div>
          <p>
            Work with talented engineers and contribute to impactful technology solutions
            across enterprise platforms, applications, and modernization programs.
          </p>
        </div>
      </section>

      <SectionWrapper
        className="section-surface-white"
        eyebrow="Why Join Us"
        title="A recruiting experience that reflects modern engineering teams."
        description="We create opportunities for engineers and technology professionals to work on meaningful delivery programs with collaborative teams and long-term growth."
      >
        <div className="career-layout careers-overview-layout">
          <article className="career-card career-intro">
            <h3>Work on modern platforms with experienced teams</h3>
            <p>
              Join an environment focused on real delivery ownership, practical learning,
              and technology work that supports measurable client outcomes.
            </p>
            <div className="careers-benefits-list">
              <span className="mini-tag">Flexible work environment</span>
              <span className="mini-tag">Learning and development</span>
              <span className="mini-tag">Modern technologies</span>
              <span className="mini-tag">Collaborative engineering culture</span>
            </div>
          </article>
          <div className="feature-grid careers-benefits-grid">
            {whyJoinUs.map((item, index) => (
              <FeatureCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                description={item.description}
                delay={index * 80}
              />
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper
        className="section-surface-muted"
        eyebrow="Open Roles"
        title="Current opportunities"
        description="Browse active positions across engineering and enterprise technology delivery."
      >
        <div className="jobs-stack">
          {loading && <article className="career-card">Loading jobs...</article>}

          {!loading && jobs.length === 0 && (
            <article className="career-card">No openings available right now.</article>
          )}

          {jobs.map((job) => (
            <article key={job.id} className="job-card-modern">
              <div className="job-card-head">
                <div>
                  <h3>{job.jobTitle}</h3>
                  <div className="job-card-meta">
                    <span className="job-tag">{job.workLocation}</span>
                    <span className="job-tag">{job.jobType}</span>
                    <span className="job-tag">{job.experience}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="expand-toggle"
                  onClick={() => setOpenId(openId === job.id ? null : job.id)}
                  aria-label="Toggle job details"
                >
                  {openId === job.id ? "-" : "+"}
                </button>
              </div>

              {openId === job.id && (
                <div className="job-expand-panel">
                  <p>
                    <strong>Location:</strong> {job.workLocation}
                  </p>
                  <p>
                    <strong>Experience:</strong> {job.experience}
                  </p>
                  <p>
                    <strong>CTC:</strong> {job.ctc}
                  </p>
                  <p>
                    <strong>Qualification:</strong> {job.highestQualification}
                  </p>
                  <p>
                    <strong>Description:</strong> {job.jobDescription}
                  </p>
                  <p>
                    <strong>Skills:</strong> {job.mandatorySkills}
                  </p>
                  <button
                    type="button"
                    className="button button-primary button-sm"
                    onClick={() => navigate(`/careers/${job.id}`)}
                  >
                    Apply Now
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </SectionWrapper>

      <CTASection
        className="internal-page-cta"
        eyebrow="Careers"
        title="Ready to start your next project with us?"
        description="Connect with our team to learn more about opportunities, projects, and the kind of technology work we deliver."
        primaryAction={{ label: "Start a Conversation", to: "/contact" }}
        secondaryAction={{ label: "Explore Services", to: "/services" }}
      />
    </div>
  );
};

export default Careers;
