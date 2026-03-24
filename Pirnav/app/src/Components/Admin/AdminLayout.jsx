import { NavLink, useNavigate, Outlet } from "react-router-dom";
import {
  Bookmark,
  CalendarDays,
  CheckCircle2,
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  LogOut,
  Menu,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import "./Admin.css";
import { clearAdminToken } from "./adminAuth";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/messages", label: "Messages", icon: MessageSquare },
  { path: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { path: "/admin/pipeline", label: "Pipeline", icon: Bookmark },
  { path: "/admin/interviews", label: "Interviews", icon: CalendarDays },
  { path: "/admin/selected-candidates", label: "Selected Candidates", icon: CheckCircle2 },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    clearAdminToken();
    setMobileOpen(false);
    navigate("/admin-login", { replace: true });
  };

  const user = {
    name: "Admin",
    email: "admin@pirnav.com",
  };

  return (
    <div className="admin-container">
      {/* Desktop Sidebar */}
      <aside className={`admin-sidebar ${mobileOpen ? "open" : ""}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-icon">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4>Admin Panel</h4>
            <small>Management Console</small>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"} 
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="sidebar-footer">
          <div className="user-box">
            <div className="avatar">
              {user.name.charAt(0)}
            </div>
            <div>
              <p>{user.name}</p>
              <small>{user.email}</small>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Toggle */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu size={18} />
      </button>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
