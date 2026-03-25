import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BriefcaseBusiness, GraduationCap, Search } from "lucide-react";
import SectionWrapper from "../../components/common/SectionWrapper";
import FeatureCard from "../../components/common/FeatureCard";
import { whyJoinUs } from "../../data/siteContent";
import "./Careers.css";

const BASE_URL = "https://farrandly-interalar-talon.ngrok-free.dev/api";
const JOB_PREVIEW_FALLBACK =
  "Join a collaborative team building reliable software, modern platforms, and high-impact solutions for growing businesses.";

const extendedWhyJoinUs = [
  ...whyJoinUs,
  {
    title: "Learning & development",
    description:
      "Continuous learning through mentorship, training programs, and exposure to modern technologies.",
    icon: GraduationCap,
  },
  {
    title: "Flexible work culture",
    description:
      "A supportive environment that promotes work-life balance, flexibility, and employee well-being.",
    icon: BriefcaseBusiness,
  },
];

const getJobPreview = (description) => {
  const normalizedDescription = description?.replace(/\s+/g, " ").trim();

  return normalizedDescription || JOB_PREVIEW_FALLBACK;
};

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredJobs = jobs.filter((job) => {
    if (!normalizedSearch) return true;

    const searchableText = [
      job.jobTitle,
      job.workLocation,
      job.mandatorySkills,
      job.jobDescription,
      job.jobType,
      job.experience,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearch);
  });
  const resultsSummary = loading
    ? "Loading roles..."
    : jobs.length === 0
      ? "No openings right now"
      : `${filteredJobs.length} ${filteredJobs.length === 1 ? "role" : "roles"} available`;

  return (
    <div id="careers" className="page-shell careers-page">
      <section
        className="hero-section page-banner page-banner-left page-banner-light careers-hero"
        style={{
          "--banner-image":
            "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2400&q=85')",
          "--banner-overlay":
            "linear-gradient(100deg, rgba(15, 23, 42, 0.82) 4%, rgba(15, 23, 42, 0.58) 48%, rgba(15, 23, 42, 0.18) 100%)",
        }}
      >
        <div className="section-shell page-banner-content page-banner-left-content">
          <span className="hero-badge">Careers</span>
          <h1>Build your career with us.</h1>
          <p>
            Work with talented engineers and contribute to impactful technology solutions
            across enterprise platforms, applications, and modernization programs.
          </p>
        </div>
      </section>

      <SectionWrapper
        className="section-surface-white careers-why-join-section"
        eyebrow="Why Pirnav"
        title="A recruiting experience that reflects modern engineering teams."
        description="We create opportunities for engineers and technology professionals to work on meaningful delivery programs with collaborative teams and long-term growth."
      >
        <div className="feature-grid careers-benefits-grid">
          {extendedWhyJoinUs.map((item, index) => (
            <FeatureCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={item.description}
              delay={index * 80}
              className="careers-benefit-card"
            />
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper
        className="section-surface-muted careers-open-roles-section"
        contentClassName="careers-open-roles-content"
      >
        <div className="careers-open-roles-header">
          <div className="careers-open-roles-heading">
            <span className="section-eyebrow">Join Our Team</span>
            <h2>Build the future with us</h2>
            <p>
              Explore open roles across engineering, QA, delivery, and enterprise
              technology teams.
            </p>
          </div>

          <div className="careers-open-roles-toolbar">
            <label className="careers-role-search" aria-label="Search roles">
              <Search size={18} aria-hidden="true" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Search roles"
                placeholder="Search roles (e.g. Developer, QA, Location...)"
              />
            </label>

            <span className="careers-results-count">{resultsSummary}</span>
          </div>
        </div>

        <div className="jobs-stack careers-jobs-stack">
          {loading && <article className="job-card-modern careers-job-card">Loading jobs...</article>}

          {!loading && jobs.length === 0 && (
            <article className="job-card-modern careers-job-card careers-jobs-empty">
              No openings available right now.
            </article>
          )}

          {!loading && jobs.length > 0 && filteredJobs.length === 0 && (
            <article className="job-card-modern careers-job-card careers-jobs-empty">
              No roles match "{searchTerm}".
            </article>
          )}

          {filteredJobs.map((job) => (
            <article key={job.id} className="job-card-modern careers-job-card">
              <div className="careers-job-card-body">
                <div className="careers-job-summary">
                  <h3>{job.jobTitle}</h3>
                  <div className="job-card-meta">
                    {[job.workLocation, job.jobType, job.experience]
                      .filter(Boolean)
                      .map((tag) => (
                        <span key={`${job.id}-${tag}`} className="job-tag">
                          {tag}
                        </span>
                      ))}
                  </div>

                  <p className="careers-job-description">{getJobPreview(job.jobDescription)}</p>
                </div>

                <div className="careers-job-actions">
                  <button
                    type="button"
                    className="button button-primary button-sm careers-apply-button"
                    onClick={() => navigate(`/careers/${job.id}`)}
                  >
                    Apply Now
                  </button>

                  <button
                    type="button"
                    className="careers-view-details"
                    onClick={() => navigate(`/careers/${job.id}`)}
                  >
                    View Details
                  </button>
                </div>

                <p className="careers-apply-contact-note">
                  Or email your resume to{" "}
                  <a href="mailto:hr@pirnav.com">hr@pirnav.com</a>
                </p>
              </div>
            </article>
          ))}
        </div>
      </SectionWrapper>

    </div>
  );
};

export default Careers;
