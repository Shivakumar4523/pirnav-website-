import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_ROUTES } from "../../lib/api.js";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  qualification: "",
  experience: "",
  currentCompany: "",
  currentCTC: "",
  expectedCTC: "",
  noticePeriod: "",
  location: "",
  linkedin: "",
  resume: null,
};

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`${API_ROUTES.publicJobs}/${id}`);
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "resume") {
      const file = files?.[0];

      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Resume must be less than 5MB.");
        return;
      }

      setErrorMessage("");
      setFormData((current) => ({ ...current, resume: file }));
      return;
    }

    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    const linkedInUrl = formData.linkedin.trim();

    if (!formData.resume) {
      setErrorMessage("Please upload your resume.");
      setLoading(false);
      return;
    }

    if (linkedInUrl) {
      try {
        new URL(linkedInUrl);
      } catch {
        setErrorMessage("Please enter a valid LinkedIn URL.");
        setLoading(false);
        return;
      }
    }

    const form = new FormData();
    form.append("JobId", id);
    form.append("Name", formData.fullName);
    form.append("Email", formData.email);
    form.append("PhoneNumber", formData.phone);
    form.append("DateOfBirth", formData.dob);
    form.append("Gender", formData.gender);
    form.append("HighestQualification", formData.qualification);
    form.append("TotalExperience", formData.experience);
    form.append("CurrentCompany", formData.currentCompany);
    form.append("CurrentCTC", formData.currentCTC);
    form.append("ExpectedCTC", formData.expectedCTC);
    form.append("NoticePeriod", formData.noticePeriod);
    form.append("CurrentLocation", formData.location);
    if (linkedInUrl) {
      form.append("LinkedInUrl", linkedInUrl);
    }
    form.append("Resume", formData.resume);

    try {
      const response = await fetch(API_ROUTES.jobApplications, {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Application submission failed");
      }

      setSuccessMessage("Application submitted successfully.");
      setFormData(initialForm);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!job) {
    return <div className="page-shell section-shell" style={{ paddingTop: "160px" }}>Loading...</div>;
  }

  return (
    <div className="page-shell">
      <section
        className="hero-section page-banner page-banner-light"
        style={{
          "--banner-image":
            "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2400&q=85')",
        }}
      >
        <div className="section-shell page-banner-content">
          <span className="hero-badge">Career Opportunity</span>
          <h1>{job.jobTitle}</h1>
          <div className="breadcrumb-row">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/careers">Careers</Link>
            <span>/</span>
            <span>{job.jobTitle}</span>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-shell job-detail-layout">
          <article className="job-detail-card">
            <div className="job-detail-head">
              <span className="section-eyebrow">Role Overview</span>
              <h1>{job.jobTitle}</h1>
              <div className="tag-row">
                <span className="job-tag">{job.workLocation}</span>
                <span className="job-tag">{job.jobType}</span>
                <span className="job-tag">{job.experience}</span>
                <span className="job-tag">{job.ctc}</span>
              </div>
              <p>
                <strong>Qualification:</strong> {job.highestQualification}
              </p>
            </div>

            <h3>Job description</h3>
            <p>{job.jobDescription}</p>

            <h3>Skills required</h3>
            <p>{job.mandatorySkills}</p>

            {successMessage && (
              <div className="status-message status-success">{successMessage}</div>
            )}
            {errorMessage && (
              <div className="status-message status-error">{errorMessage}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div>
                  <label>Full name *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div>
                  <label>Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label>Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div>
                  <label>Date of birth *</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label>Gender *</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label>Qualification *</label>
                  <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label>Experience *</label>
                  <input type="number" name="experience" value={formData.experience} onChange={handleChange} required />
                </div>
                <div>
                  <label>Current company *</label>
                  <input type="text" name="currentCompany" value={formData.currentCompany} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label>Current CTC *</label>
                  <input type="text" name="currentCTC" value={formData.currentCTC} onChange={handleChange} required />
                </div>
                <div>
                  <label>Expected CTC *</label>
                  <input type="text" name="expectedCTC" value={formData.expectedCTC} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label>Notice period *</label>
                  <input type="text" name="noticePeriod" value={formData.noticePeriod} onChange={handleChange} required />
                </div>
                <div>
                  <label>Location *</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label>LinkedIn (optional)</label>
                  <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} />
                </div>
                <div>
                  <label>Upload resume *</label>
                  <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleChange} required />
                </div>
              </div>

              <button type="submit" className="button button-primary button-md" disabled={loading}>
                {loading ? "Submitting..." : "Submit Application"}
              </button>
              <p className="job-apply-contact-note">
                Send us your resume to{" "}
                <a href="mailto:hr@pirnav.com">hr@pirnav.com</a>
              </p>
            </form>
          </article>

          <aside className="job-detail-side">
            <article className="service-outline-card">
              <h3>Role snapshot</h3>
              <ul>
                <li>Location: {job.workLocation}</li>
                <li>Type: {job.jobType}</li>
                <li>Experience: {job.experience}</li>
                <li>CTC: {job.ctc}</li>
              </ul>
            </article>
            <article className="service-outline-card">
              <h3>Before you apply</h3>
              <p>
                Keep your resume file under 5MB. If you add LinkedIn, use a valid URL.
                The redesigned application form keeps the page clearer and easier to complete.
              </p>
            </article>
          </aside>
        </div>
      </section>

    </div>
  );
};

export default JobDetails;
