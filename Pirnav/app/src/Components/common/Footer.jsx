import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>PIRNAV</h2>
          <p>Building scalable digital platforms for modern enterprises.</p>
          <div className="footer-socials">
            <a
              href="https://www.linkedin.com"
              className="footer-social-link"
              aria-label="LinkedIn"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19ZM8.34 18V9.75H5.67V18H8.34ZM7 8.58A1.56 1.56 0 1 0 7 5.46A1.56 1.56 0 0 0 7 8.58ZM18.33 18V13.5C18.33 11.17 17.09 9.55 14.94 9.55C13.41 9.55 12.72 10.42 12.33 11.04V9.75H9.75C9.78 10.57 9.75 18 9.75 18H12.33V13.34C12.33 13.09 12.35 12.84 12.42 12.66C12.62 12.16 13.09 11.64 13.89 11.64C14.96 11.64 15.39 12.44 15.39 13.62V18H18.33Z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              className="footer-social-link"
              aria-label="Twitter"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M18.9 3H21L14.6 10.34L22.2 21H16.3L11.7 14.86L6 21H3.9L10.7 13.2L3.4 3H9.4L13.6 8.63L18.9 3ZM18 19H19.1L8.8 5H7.6L18 19Z" />
              </svg>
            </a>
            <a
              href="https://github.com"
              className="footer-social-link"
              aria-label="GitHub"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 2A10 10 0 0 0 2 12C2 16.42 4.87 20.17 8.84 21.5C9.34 21.58 9.5 21.27 9.5 21V19.2C6.73 19.78 6.14 17.86 6.14 17.86C5.68 16.7 5.03 16.39 5.03 16.39C4.12 15.78 5.1 15.79 5.1 15.79C6.11 15.86 6.65 16.83 6.65 16.83C7.54 18.38 8.97 17.93 9.54 17.67C9.63 17.04 9.89 16.61 10.17 16.37C7.95 16.11 5.62 15.25 5.62 11.5C5.62 10.39 6 9.5 6.62 8.8C6.52 8.55 6.18 7.5 6.72 6.12C6.72 6.12 7.54 5.86 9.5 7.2C10.29 6.98 11.14 6.87 12 6.87C12.86 6.87 13.71 6.98 14.5 7.2C16.46 5.86 17.28 6.12 17.28 6.12C17.82 7.5 17.48 8.55 17.38 8.8C18 9.5 18.38 10.39 18.38 11.5C18.38 15.26 16.04 16.1 13.81 16.36C14.17 16.67 14.5 17.28 14.5 18.2V21C14.5 21.27 14.66 21.58 15.16 21.5C19.13 20.17 22 16.42 22 12A10 10 0 0 0 12 2Z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Company</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-links">
          <h4>Services</h4>
          <a href="#">Software Engineering</a>
          <a href="#">Cloud Engineering</a>
          <a href="#">Data & AI</a>
          <a href="#">Enterprise Applications</a>
          <a href="#">Technology Consulting</a>
          <a href="#">Digital Transformation</a>
        </div>

        <div className="footer-contact">
          <h4>Contact</h4>
          <p>Email: info@pirnav.com</p>
          <p>Phone: +91 98765 43210</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Pirnav Software Solutions Pvt Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
