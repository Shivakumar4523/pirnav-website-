import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  BriefcaseBusiness,
  Boxes,
  ChevronDown,
  House,
  Info,
  Mail,
  Menu,
  Settings2,
  X,
} from "lucide-react";
import { serviceItems } from "../../data/siteContent";

const navLinks = [
  { label: "Home", to: "/", icon: House },
  { label: "About", to: "/about", icon: Info },
  { label: "Services", to: "/services", icon: Settings2, hasDropdown: true },
  { label: "Our Products", to: "/products", icon: Boxes },
  { label: "Careers", to: "/careers", icon: BriefcaseBusiness },
  { label: "Contact", to: "/contact", icon: Mail },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const syncScrollState = window.requestAnimationFrame(() => {
      setMobileOpen(false);
      setServicesMenuOpen(false);
      setMobileServicesOpen(false);
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

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
  };

  const handleServicesBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setServicesMenuOpen(false);
    }
  };

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Primary navigation">
        <div className="navbar-inner nav-container">
          <Link to="/" className="logo-link" onClick={closeMobileMenu} aria-label="Pirnav home">
            <img src="/images/logo.png" alt="Pirnav Logo" className="navbar-logo" />
          </Link>

          <ul className="nav-links">
            {navLinks.map((link) => {
              const Icon = link.icon;

              if (link.hasDropdown) {
                return (
                  <li
                    key={link.to}
                    className={`nav-item-services${servicesMenuOpen ? " nav-item-services-open" : ""}`}
                    onMouseEnter={() => setServicesMenuOpen(true)}
                    onMouseLeave={() => setServicesMenuOpen(false)}
                    onFocus={() => setServicesMenuOpen(true)}
                    onBlur={handleServicesBlur}
                  >
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `nav-link nav-services-trigger${isActive ? " active-link" : ""}`
                      }
                      aria-haspopup="true"
                      aria-expanded={servicesMenuOpen}
                    >
                      <span className="nav-link-icon" aria-hidden="true">
                        <Icon size={16} strokeWidth={1.8} />
                      </span>
                      {link.label}
                      <span className="nav-services-chevron" aria-hidden="true">
                        <ChevronDown size={14} strokeWidth={1.9} />
                      </span>
                    </NavLink>

                    <div
                      className={`nav-services-dropdown${servicesMenuOpen ? " nav-services-dropdown-open" : ""}`}
                      role="menu"
                      aria-label="Services menu"
                    >
                      <div className="nav-services-grid">
                        {serviceItems.map((service) => {
                          const ServiceIcon = service.icon;
                          const servicePath = `/services/${service.slug}`;
                          const isCurrent = location.pathname === servicePath;

                          return (
                            <Link
                              key={service.slug}
                              to={servicePath}
                              className={`nav-services-item${isCurrent ? " is-current" : ""}`}
                              role="menuitem"
                              onClick={() => setServicesMenuOpen(false)}
                            >
                              <span className="nav-services-item-icon" aria-hidden="true">
                                <ServiceIcon size={16} strokeWidth={1.8} />
                              </span>
                              <span className="nav-services-item-label">{service.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </li>
                );
              }

              return (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) => `nav-link${isActive ? " active-link" : ""}`}
                  >
                    <span className="nav-link-icon" aria-hidden="true">
                      <Icon size={16} strokeWidth={1.8} />
                    </span>
                    {link.label}
                  </NavLink>
                </li>
              );
            })}
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
        </div>
      </nav>

      <div className={`mobile-nav-panel ${mobileOpen ? "mobile-nav-panel-open" : ""}`}>
        <nav className="nav-mobile-links" aria-label="Mobile navigation">
          {navLinks.map((link) => {
            const Icon = link.icon;

            if (link.hasDropdown) {
              return (
                <div
                  key={link.to}
                  className={`nav-mobile-services${mobileServicesOpen ? " nav-mobile-services-open" : ""}`}
                >
                  <div className="nav-mobile-services-header">
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `nav-link nav-mobile-services-link${isActive ? " active-link" : ""}`
                      }
                      onClick={closeMobileMenu}
                    >
                      <span className="nav-link-icon" aria-hidden="true">
                        <Icon size={16} strokeWidth={1.8} />
                      </span>
                      {link.label}
                    </NavLink>

                    <button
                      type="button"
                      className="nav-mobile-services-toggle"
                      onClick={() => setMobileServicesOpen((open) => !open)}
                      aria-expanded={mobileServicesOpen}
                      aria-controls="nav-mobile-services-menu"
                      aria-label="Toggle services menu"
                    >
                      <ChevronDown className="nav-mobile-services-chevron" size={16} strokeWidth={1.9} />
                    </button>
                  </div>

                  <div
                    className={`nav-mobile-services-menu${mobileServicesOpen ? " nav-mobile-services-menu-open" : ""}`}
                    id="nav-mobile-services-menu"
                  >
                    {serviceItems.map((service) => {
                      const ServiceIcon = service.icon;
                      const servicePath = `/services/${service.slug}`;
                      const isCurrent = location.pathname === servicePath;

                      return (
                        <Link
                          key={service.slug}
                          to={servicePath}
                          className={`nav-mobile-service-item${isCurrent ? " is-current" : ""}`}
                          onClick={closeMobileMenu}
                        >
                          <span className="nav-mobile-service-icon" aria-hidden="true">
                            <ServiceIcon size={16} strokeWidth={1.8} />
                          </span>
                          {service.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) => `nav-link${isActive ? " active-link" : ""}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-link-icon" aria-hidden="true">
                  <Icon size={16} strokeWidth={1.8} />
                </span>
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
