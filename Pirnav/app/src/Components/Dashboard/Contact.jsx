import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import SectionWrapper from "../../components/common/SectionWrapper";
import CTASection from "../../components/common/CTASection";
import { company } from "../../data/siteContent";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
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
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch(
        "https://farrandly-interalar-talon.ngrok-free.dev/api/Contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      await response.json();
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Phone",
      value: company.phone,
      link: `tel:${company.phone}`,
      icon: Phone,
    },
    {
      title: "Email",
      value: company.email,
      link: `mailto:${company.email}`,
      icon: Mail,
    },
    {
      title: "Location",
      value: company.location,
      link: null,
      icon: MapPin,
    },
  ];

  return (
    <div className="page-shell">
      <section
        className="page-banner page-banner-light"
        style={{
          "--banner-image":
            "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=85')",
        }}
      >
        <div className="section-shell page-banner-content">
          <span className="section-eyebrow section-eyebrow-light">Contact</span>
          <h1>Start a conversation with Pirnav.</h1>
          <div className="breadcrumb-row">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Contact</span>
          </div>
          <p>
            Use the contact form for project discussions, staffing requirements,
            or partnership inquiries.
          </p>
        </div>
      </section>

      <SectionWrapper
        eyebrow="Contact Details"
        title="Direct information, cleaner layout, and a stronger first-contact experience."
        description="The contact page now uses consistent cards, clear hierarchy, and a SaaS-style split layout for the form and map."
      >
        <div className="contact-info-grid">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <article key={card.title} className="contact-card">
                <div className="feature-icon">
                  <Icon size={22} />
                </div>
                <h3>{card.title}</h3>
                {card.link ? <a href={card.link}>{card.value}</a> : <p>{card.value}</p>}
              </article>
            );
          })}
        </div>
      </SectionWrapper>

      <SectionWrapper
        eyebrow="Get In Touch"
        title="Tell us what you’re building or where you need support."
      >
        <div className="contact-layout">
          <article className="contact-form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
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
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="Tell us about your project, hiring need, or support requirement."
                value={formData.message}
                onChange={handleChange}
                required
              />
              <button type="submit" className="button button-primary button-md" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>
              {status === "success" && (
                <div className="status-message status-success">Message sent successfully.</div>
              )}
              {status === "error" && (
                <div className="status-message status-error">Something went wrong. Try again.</div>
              )}
            </form>
          </article>

          <iframe
            title="Pirnav location map"
            className="map-frame"
            src="https://www.google.com/maps?q=Madhapur,Hyderabad&output=embed"
            loading="lazy"
            allowFullScreen=""
          />
        </div>
      </SectionWrapper>

      <CTASection
        className="internal-page-cta"
        eyebrow="Next Step"
        title="Need a faster path to engineering capacity or enterprise software delivery?"
        description="Contact the team and we can discuss software services, QA automation, support, or staffing requirements."
        primaryAction={{ label: "View Services", to: "/services" }}
        secondaryAction={{ label: "Careers", to: "/careers" }}
      />
    </div>
  );
};

export default ContactUs;
