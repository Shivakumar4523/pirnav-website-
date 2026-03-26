import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  MessageSquare,
  Briefcase,
  Users,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import {
  applicationStatusLabels,
  normalizeApplicationStatus,
} from "./applicationStatus";
 
const BASE_URL =
  "/api/Admin";
 
const DashboardHome = () => {
  const navigate = useNavigate();
 
  // Dashboard statistics state
  const [stats, setStats] = useState({
    selectedCandidates: 0,
    messages: 0,
    jobs: 0,
    applications: 0,
  });
 
  // Loading state
  const [loading, setLoading] = useState(true);
 
  // Recent data
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
 
  // ---------------------------
  // AUTH HEADERS
  // ---------------------------
  const getHeaders = useCallback(() => {
    const token = localStorage.getItem("adminToken");
 
    if (!token) {
      navigate("/admin-login");
      return {};
    }
 
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    };
  }, [navigate]);
 
  // ---------------------------
  // LOAD DASHBOARD DATA
  // ---------------------------
  // ---------------------------
  // DASHBOARD SUMMARY (FIXED)
  // ---------------------------
  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
 
      const res = await fetch(`${BASE_URL}/dashboard-summary`, {
        headers: getHeaders(),
      });
 
      if (res.status === 401) {
        navigate("/admin-login");
        return;
      }
 
      if (!res.ok) {
        throw new Error("Failed to fetch dashboard summary");
      }
 
      const response = await res.json();
      console.log("Dashboard summary:", response);
 
      // ✅ FIX: Correct mapping from response.data
      const summary = response?.data || {};
 
      setStats({
        selectedCandidates: summary.selectedCandidates ?? summary.selectedApplications ?? 0,
        messages: summary.unreadMessages ?? 0,
        jobs: summary.openPositions ?? 0,
        applications: summary.pendingApplications ?? summary.pendingReviews ?? 0,
      });
    } catch (err) {
      console.error("Dashboard summary error:", err);
    } finally {
      setLoading(false);
    }
  }, [getHeaders, navigate]);
 
  // ---------------------------
  // RECENT MESSAGES
  // ---------------------------
  const fetchRecentMessages = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/recent-messages`, {
        headers: getHeaders(),
      });
 
      if (!res.ok) return;
 
      const data = await res.json();
      console.log("Recent messages:", data);
 
      setRecentMessages(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error("Recent messages error:", err);
    }
  }, [getHeaders]);
 
  // ---------------------------
  // RECENT APPLICATIONS
  // ---------------------------
  const fetchRecentApplications = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/recent-applications`, {
        headers: getHeaders(),
      });
 
      if (res.status === 401) {
        navigate("/admin-login");
        return;
      }
 
      if (!res.ok) return;
 
      const data = await res.json();
      console.log("Recent applications:", data);
 
      setRecentApplications(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error("Recent applications error:", err);
    }
  }, [getHeaders, navigate]);

  useEffect(() => {
    fetchSummary();
    fetchRecentMessages();
    fetchRecentApplications();
  }, [fetchRecentApplications, fetchRecentMessages, fetchSummary]);
 
  // ---------------------------
  // DATE FORMATTER
  // ---------------------------
  const formatDate = (date) => {
    if (!date) return "No Date";
    return new Date(date).toLocaleDateString();
  };
 
  // ---------------------------
  // UI
  // ---------------------------
  return (
<div className="dashboard-wrapper">
      {/* Header */}
<div className="dashboard-header">
<h1>Dashboard</h1>
<p>Summary of your admin panel activity</p>
</div>
 
      {/* Top Cards */}
<div className="stats-grid">
<div
          className="stat-card selected-candidates-card"
          onClick={() => navigate("/admin/selected-candidates")}
>
<div className="stat-top">
<p>Selected Candidates</p>
<CheckCircle2 size={18} />
</div>
 
          <h2>{loading ? "Loading..." : stats.selectedCandidates}</h2>
 
          <span className="stat-trend">
Finalised hires
</span>
</div>
 
        <div
          className="stat-card messages-card"
          onClick={() => navigate("/admin/messages")}
>
<div className="stat-top">
<p>Unread Messages</p>
<MessageSquare size={18} />
</div>
 
          <h2>{loading ? "Loading..." : stats.messages}</h2>
 
          <span className="stat-trend">New enquiries</span>
</div>
 
        <div
          className="stat-card jobs-card"
          onClick={() => navigate("/admin/jobs")}
>
<div className="stat-top">
<p>Open Positions</p>
<Briefcase size={18} />
</div>
 
          <h2>{loading ? "Loading..." : stats.jobs}</h2>
 
          <span className="stat-trend">Active jobs</span>
</div>
 
        <div
          className="stat-card applications-card"
          onClick={() => navigate("/admin/pipeline")}
>
<div className="stat-top">
<p>Pipeline Candidates</p>
<Users size={18} />
</div>
 
          <h2>{loading ? "Loading..." : stats.applications}</h2>
 
          <span className="stat-trend">Move candidates forward</span>
</div>
</div>
 
      {/* Bottom Section */}
<div className="dashboard-bottom">
        {/* Recent Messages */}
<div className="dashboard-card">
<div className="card-header">
<h3>Recent Messages</h3>
<button onClick={() => navigate("/admin/messages")}>
              View All <ArrowUpRight size={14} />
</button>
</div>
 
          {recentMessages.length === 0 && <p>No recent messages</p>}
 
          {recentMessages.map((msg, index) => (
<div key={index} className="list-item">
<div className="avatar">{msg.name?.charAt(0)}</div>
 
              <div className="list-content">
<strong>{msg.name}</strong>
<p>{msg.subject}</p>
<small>{msg.message}</small>
</div>
 
              <span className="date">
<Clock size={12} /> {formatDate(msg.date)}
</span>
</div>
          ))}
</div>
 
        {/* Recent Applications */}
<div className="dashboard-card">
<div className="card-header">
<h3>Recent Applications</h3>
<button onClick={() => navigate("/admin/pipeline")}>
              View All <ArrowUpRight size={14} />
</button>
</div>
 
          {recentApplications.length === 0 && (
<p>No recent applications</p>
          )}
 
          {recentApplications.map((app, index) => {
            const normalizedStatus = normalizeApplicationStatus(app.status);

            return (
<div key={index} className="list-item">
<div className="avatar">{app.name?.charAt(0)}</div>
 
              <div className="list-content">
<strong>{app.name}</strong>
<p>{app.position}</p>
</div>
 
              <span className={`status ${normalizedStatus}`}>
                {applicationStatusLabels[normalizedStatus]}
              </span>
</div>
            );
          })}
</div>
</div>
</div>
  );
};
 
export default DashboardHome;
