import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Careers", to: "/careers" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);

    const syncScrollState = window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    return () => window.cancelAnimationFrame(syncScrollState);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(".navbar");

      if (!navbar) return;

      if (window.scrollY > 40) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Primary navigation">
        <div className="nav-left">
          <Link to="/" className="logo-link" onClick={closeMobileMenu} aria-label="Pirnav home">
            <img src="/images/logo.png" alt="Pirnav Logo" className="logo" />
          </Link>
        </div>

        <ul className="nav-menu nav-links">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => `nav-link${isActive ? " active-link" : ""}`}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="nav-toggle"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <div className={`mobile-nav-panel ${mobileOpen ? "mobile-nav-panel-open" : ""}`}>
        <nav className="nav-mobile-links" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link${isActive ? " active-link" : ""}`}
              onClick={closeMobileMenu}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
