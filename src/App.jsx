import { useEffect, useLayoutEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./Components/Navbar/Navbar.jsx";
import Dashboard from "./Components/Dashboard/Dashboard.jsx";
import Contact from "./Components/Dashboard/Contact.jsx";
import About from "./Components/Dashboard/about.jsx";
import Products from "./Components/Dashboard/Products.jsx";
import ProductDetails from "./Components/Dashboard/ProductDetails.jsx";
import Footer from "./Components/Dashboard/Footer.jsx";
import PublicServices from "./Components/Services/OurServices.jsx";
import Careers from "./Components/Dashboard/Careers.jsx";
import JobDetails from "./Components/Dashboard/JobDetails.jsx";

// Admin Imports
import AdminLayout from "./Components/Admin/AdminLayout.jsx";
import AdminLogin from "./Components/Admin/AdminLogin.jsx";
import RequireAdminAuth from "./Components/Admin/RequireAdminAuth.jsx";
import { AdminApplicationsProvider } from "./Components/Admin/applicationsContext.jsx";
import DashboardHome from "./Components/Admin/DashboardHome.jsx";
import ContactMessages from "./Components/Admin/ContactMessages.jsx";
import AdminJobs from "./Components/Admin/AdminJobs.jsx";
import Applications from "./Components/Admin/Applications.jsx";
import Interviews from "./Components/Admin/Interviews.jsx";
import Pipeline from "./Components/Admin/Pipeline.jsx";
import SelectedCandidates from "./Components/Admin/SelectedCandidates.jsx";

//Sub pages
import WebPage from "./Components/Services/WebPage.jsx";
import MobilePage from "./Components/Services/MobilePage.jsx";
import Microsoft from "./Components/Services/Microsoft.jsx";
import Application from "./Components/Services/Applicationdevelopment.jsx";
import Testing from "./Components/Services/Testing&Automation.jsx";
import Maintainance from "./Components/Services/Maintainance&support.jsx";
import SAP from "./Components/Services/SAP.jsx";
import Oracle from "./Components/Services/Oracle.jsx";
import ProfessionalPage from "./Components/Services/ProfessionalPage.jsx";
import ServiceDetailPage from "./Components/Services/ServiceDetailPage.jsx";

function AppContent() {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith("/admin");

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = prefersReducedMotion ? "auto" : "smooth";

    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior });

      const scrollTargets = new Set([
        document.scrollingElement,
        document.documentElement,
        document.body,
      ]);

      document
        .querySelectorAll(
          "[data-scroll-container], .main-content, .page-shell, .site-content, .app-layout"
        )
        .forEach((element) => scrollTargets.add(element));

      document.querySelectorAll("body *").forEach((element) => {
        const style = window.getComputedStyle(element);
        const isScrollableY =
          (style.overflowY === "auto" || style.overflowY === "scroll") &&
          element.scrollHeight > element.clientHeight;

        if (isScrollableY) {
          scrollTargets.add(element);
        }
      });

      scrollTargets.forEach((element) => {
        if (!element) return;
        try {
          element.scrollTo({ top: 0, left: 0, behavior: "auto" });
        } catch {
          element.scrollTop = 0;
          element.scrollLeft = 0;
        }
      });
    };

    resetScroll();
    const frameId = window.requestAnimationFrame(resetScroll);

    return () => window.cancelAnimationFrame(frameId);
  }, [location.key, location.pathname, location.search]);

  useEffect(() => {
    const selector = [
      ".reveal",
      ".stat-card",
      ".service-box",
      ".card",
      ".tile",
      ".executive-grid > div",
      ".story-card",
      ".career-card",
      ".job-card-modern",
      ".contact-card",
      ".contact-form-card",
      ".job-detail-card",
      ".service-outline-card",
      ".enterprise-service-card",
      ".homepage-why-item",
      ".feature-card",
      ".testimonial-card",
      ".service-card-modern",
      ".service-card-link",
      ".technology-card",
      ".enterprise-careers-panel",
      ".cta-panel",
      ".map-frame",
      ".hero-metric",
    ].join(", ");

    const elements = document.querySelectorAll(selector);

    elements.forEach((element) => element.classList.add("reveal"));

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("active"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active", "visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <div className="app-layout page-wrapper">
      {!hideLayout && <Navbar />}

      <main className={`main-content${hideLayout ? " main-content--flush" : ""}`}>
        <Routes>

          {/* Public */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/services" element={<PublicServices />} />

          {/* Careers */}
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/:id" element={<JobDetails />} />

          {/* Dropdown Service Routes */}
          <Route path="/services/application-development" element={<Application />} />
          <Route path="/services/testing-automation" element={<Testing />} />
          <Route path="/services/maintainance-support" element={<Maintainance />} />
          <Route path="/services/web-development" element={<WebPage />} />
          <Route path="/services/mobile-app-development" element={<MobilePage />} />
          <Route path="/services/sap-solutions" element={<SAP />} />
          <Route path="/services/oracle-solutions" element={<Oracle />} />
          <Route path="/services/microsoft-solutions" element={<Microsoft />} />
          <Route path="/services/cybersecurity" element={<ServiceDetailPage slug="cybersecurity" />} />
          <Route path="/services/ai-mlops" element={<ServiceDetailPage slug="ai-mlops" />} />
          <Route path="/services/data-science" element={<ServiceDetailPage slug="data-science" />} />
          <Route path="/services/professional-services" element={<ProfessionalPage />} />

          {/* Admin Login */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Admin Panel */}
          <Route
            path="/admin"
            element={
              <RequireAdminAuth>
                <AdminApplicationsProvider>
                  <AdminLayout />
                </AdminApplicationsProvider>
              </RequireAdminAuth>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="messages" element={<ContactMessages />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="applications" element={<Applications />} />
            <Route path="pipeline" element={<Pipeline />} />
            <Route path="interviews" element={<Interviews />} />
            <Route path="selected-candidates" element={<SelectedCandidates />} />
          </Route>

        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
