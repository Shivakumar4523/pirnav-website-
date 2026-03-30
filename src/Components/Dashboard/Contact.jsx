import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Mail, MapPin, Phone } from "lucide-react";
import SectionWrapper from "../../Components/common/SectionWrapper";
import { API_ROUTES, JSON_HEADERS } from "../../lib/api.js";

const locationGroups = [
  {
    country: "India",
    cities: ["Hyderabad", "Bangalore", "Mumbai", "Delhi", "Chennai"],
  },
  {
    country: "USA",
    cities: ["New York", "San Francisco", "Dallas"],
  },
  {
    country: "UK",
    cities: ["London", "Manchester"],
  },
];

const contactMethods = [
  {
    label: "Locations",
    groups: locationGroups,
    href: null,
    icon: MapPin,
  },
  {
    label: "Phone",
    value: "040-35339312",
    href: "tel:04035339312",
    icon: Phone,
  },
  {
    label: "Email",
    value: "contact@pirnav.com",
    href: "mailto:contact@pirnav.com",
    icon: Mail,
  },
];

const contactInfoImage =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2400&q=90";

const purposeOptions = [
  "Business Inquiry",
  "Career Opportunities",
  "Customer Support",
  "Partner Alliance",
  "Sell to Pirnav",
  "Others",
];

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    purposeOfContact: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");

    setLoading(true);
    const selectedPurpose = formData.purposeOfContact;

    try {
      const response = await fetch(API_ROUTES.contact, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify({
          ...formData,
          name: formData.name.trim(),
          purposeOfContact: selectedPurpose,
          subject: selectedPurpose,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      await response.json();
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        purposeOfContact: "",
        message: "",
      });
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <section
        className="hero-section page-banner page-banner-left page-banner-light"
        style={{
          "--banner-image":
            "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=85')",
        }}
      >
        <div className="section-shell page-banner-content page-banner-left-content">
          <span className="hero-badge">Contact</span>
          <h1>Start a conversation with Pirnav.</h1>
          <p>
            Use the contact form for project discussions, staffing requirements,
            or partnership inquiries.
          </p>
        </div>
      </section>

      <SectionWrapper className="section-surface-white contact-split-section">
        <div className="contact-layout contact-split-layout">
          <article className="contact-form-card contact-panel contact-form-panel">
            <div className="contact-panel-head">
              <span className="section-eyebrow">Get In Touch</span>
              <h2>Get in Touch</h2>
              <p>
                Share a quick note about your project, hiring needs, or support goals
                and the right Pirnav team will follow up.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Work email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <div className="contact-select-shell">
                <select
                  name="purposeOfContact"
                  value={formData.purposeOfContact}
                  onChange={handleChange}
                  className="contact-purpose-select"
                  required
                >
                  <option value="" disabled>
                    Purpose of Contact
                  </option>
                  {purposeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span className="contact-select-icon" aria-hidden="true">
                  <ChevronDown size={18} />
                </span>
              </div>
              <textarea
                name="message"
                placeholder="Tell us about your project, team needs, or support requirement."
                value={formData.message}
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                className="button button-primary button-md contact-submit"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
              {status === "success" && (
                <div className="status-message status-success">
                  Message sent successfully.
                </div>
              )}
              {status === "error" && (
                <div className="status-message status-error">
                  Something went wrong. Try again.
                </div>
              )}
            </form>
          </article>

          <aside className="contact-panel contact-map-panel">
            <div className="contact-info-hero">
              <img
                src={contactInfoImage}
                alt="Pirnav collaboration workspace"
                loading="lazy"
              />
              <div className="contact-info-hero-copy">
                <span className="section-eyebrow">Contact Information</span>
                <h2>Contact Information</h2>
                <p>
                  Reach Pirnav for delivery planning, platform modernization, or
                  long-term engineering support.
                </p>
              </div>
            </div>

            <div className="contact-panel-section">
              <div className="contact-info-list">
                {contactMethods.map((method) => {
                  const Icon = method.icon;
                  const content = (
                    <>
                      <span className="contact-info-icon">
                        <Icon size={18} />
                      </span>
                      <div className="contact-info-copy">
                        <strong className="contact-info-label">{method.label}</strong>
                        {method.groups ? (
                          <div className="contact-location-groups">
                            {method.groups.map((group) => (
                              <div key={group.country} className="contact-location-line">
                                <span className="contact-location-country">
                                  {group.country}:
                                </span>
                                <span className="contact-location-inline">
                                  {group.cities.map((city) => (
                                    <span key={city} className="contact-location-city">
                                      {city}
                                    </span>
                                  ))}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="contact-info-value">{method.value}</span>
                        )}
                      </div>
                    </>
                  );

                  return method.href ? (
                    <a
                      key={method.label}
                      href={method.href}
                      className={`contact-info-item${
                        method.groups
                          ? " contact-info-item-locations"
                          : " contact-info-item-compact"
                      }`}
                    >
                      {content}
                    </a>
                  ) : (
                    <div
                      key={method.label}
                      className={`contact-info-item${
                        method.groups
                          ? " contact-info-item-locations"
                          : " contact-info-item-compact"
                      }`}
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="contact-panel-cta-shell">
              <Link
                to="/services"
                className="button button-primary button-md contact-panel-cta"
              >
                View Services
              </Link>
            </div>
          </aside>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default ContactUs;
