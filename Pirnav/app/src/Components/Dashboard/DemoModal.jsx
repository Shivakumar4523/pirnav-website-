import { useEffect, useState } from "react";
import { X } from "lucide-react";

const getInitialFormState = () => ({
  fullName: "",
  email: "",
  phone: "",
  message: "",
});

const DemoModal = ({ productName, productType = "Product", onClose }) => {
  const [formValues, setFormValues] = useState(getInitialFormState());
  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({
    type: "",
    message: "",
  });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    if (submitStatus.type !== "success") return undefined;

    const timeoutId = window.setTimeout(() => {
      onClose();
    }, 1200);

    return () => window.clearTimeout(timeoutId);
  }, [onClose, submitStatus.type]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setFormErrors((currentErrors) => {
      if (!currentErrors[name]) return currentErrors;

      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handleDemoSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!formValues.fullName.trim()) {
      nextErrors.fullName = "Name is required.";
    }

    if (!formValues.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      setSubmitStatus({ type: "", message: "" });
      return;
    }

    const payload = {
      ...formValues,
      product: productName,
      productType,
    };

    console.log("[DemoModal] Demo request submitted:", payload);
    setSubmitStatus({
      type: "success",
      message: "Demo request submitted.",
    });
  };

  return (
    <div
      className="products-demo-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="products-demo-modal products-demo-modal-compact"
        role="dialog"
        aria-modal="true"
        aria-labelledby="products-demo-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="products-demo-modal-header">
          <div>
            <span className="products-demo-modal-eyebrow">Book Demo</span>
            <h2 id="products-demo-modal-title">See {productName} in action</h2>
          </div>
          <button
            type="button"
            className="products-demo-modal-close"
            onClick={onClose}
            aria-label="Close demo request modal"
          >
            <X size={16} />
          </button>
        </div>

        <p className="products-demo-modal-intro">
          Share a few details and we will schedule a quick walkthrough.
        </p>

        <form className="products-demo-form products-demo-form-compact" onSubmit={handleDemoSubmit}>
          <label className="products-demo-field">
            <span>Name</span>
            <input
              type="text"
              name="fullName"
              value={formValues.fullName}
              onChange={handleInputChange}
              placeholder="Enter your name"
              required
            />
            {formErrors.fullName && (
              <span className="products-demo-field-error">{formErrors.fullName}</span>
            )}
          </label>

          <label className="products-demo-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
            {formErrors.email && (
              <span className="products-demo-field-error">{formErrors.email}</span>
            )}
          </label>

          <label className="products-demo-field">
            <span>Phone</span>
            <input
              type="tel"
              name="phone"
              value={formValues.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
            />
          </label>

          <label className="products-demo-field">
            <span>Message</span>
            <textarea
              name="message"
              value={formValues.message}
              onChange={handleInputChange}
              placeholder="Share any requirements or questions"
              rows="3"
            />
          </label>

          {submitStatus.message && (
            <div className={`products-demo-status products-demo-status-${submitStatus.type}`}>
              {submitStatus.message}
            </div>
          )}

          <div className="products-demo-actions products-demo-actions-compact">
            <button type="submit" className="button button-primary button-sm products-demo-submit">
              Request Demo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DemoModal;
