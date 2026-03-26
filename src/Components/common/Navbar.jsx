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
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="site-header">
      <nav className="navbar">

        {/* LOGO */}
        <Link to="/" className="logo-link">
          <img src="/images/logo.png" alt="Pirnav Logo" className="logo" />
        </Link>

        {/* MENU */}
        <ul className="nav-menu">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `nav-link${isActive ? " active-link" : ""}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* MOBILE TOGGLE */}
        <button
          className="nav-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-nav ${mobileOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <NavLink key={link.to} to={link.to} className="mobile-link">
            {link.label}
          </NavLink>
        ))}
      </div>
    </header>
  );
};

export default Navbar;