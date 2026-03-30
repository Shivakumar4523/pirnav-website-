import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Clock,
  MessageSquare,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import { clearAdminToken, getAdminHeaders, getAdminToken } from "./adminAuth";
import {
  applicationStatusLabels,
  normalizeApplicationStatus,
} from "./applicationStatus";
import {
  API_ROUTES,
  getApiErrorMessage,
  parseJsonSafely,
} from "../../lib/api.js";

const DashboardHome = () => {
  const navigate = useNavigate();
  const token = getAdminToken();
  const [stats, setStats] = useState({
    selectedCandidates: 0,
    messages: 0,
    jobs: 0,
    applications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);

  const handleUnauthorized = useCallback(() => {
    clearAdminToken();
    navigate("/admin-login", { replace: true });
  }, [navigate]);

  const getHeaders = useCallback(() => {
    const headers = getAdminHeaders(token);

    if (!headers) {
      handleUnauthorized();
      return null;
    }

    return headers;
  }, [handleUnauthorized, token]);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      const headers = getHeaders();

      if (!headers) {
        return;
      }

      const response = await fetch(`${API_ROUTES.admin}/dashboard-summary`, {
        headers,
      });
      const responseData = await parseJsonSafely(response);

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(responseData, "Failed to fetch dashboard summary.")
        );
      }

      const summary = responseData?.data || {};

      setStats({
        selectedCandidates:
          summary.selectedCandidates ?? summary.selectedApplications ?? 0,
        messages: summary.unreadMessages ?? 0,
        jobs: summary.openPositions ?? 0,
        applications:
          summary.pendingApplications ?? summary.pendingReviews ?? 0,
      });
    } catch (error) {
      console.error("Unable to load dashboard summary.", error);
    } finally {
      setLoading(false);
    }
  }, [getHeaders, handleUnauthorized]);

  const fetchRecentMessages = useCallback(async () => {
    try {
      const headers = getHeaders();

      if (!headers) {
        return;
      }

      const response = await fetch(`${API_ROUTES.admin}/recent-messages`, {
        headers,
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        return;
      }

      const data = await parseJsonSafely(response);
      setRecentMessages(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Unable to load recent messages.", error);
    }
  }, [getHeaders, handleUnauthorized]);

  const fetchRecentApplications = useCallback(async () => {
    try {
      const headers = getHeaders();

      if (!headers) {
        return;
      }

      const response = await fetch(`${API_ROUTES.admin}/recent-applications`, {
        headers,
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        return;
      }

      const data = await parseJsonSafely(response);
      setRecentApplications(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Unable to load recent applications.", error);
    }
  }, [getHeaders, handleUnauthorized]);

  useEffect(() => {
    if (!token) {
      handleUnauthorized();
      return;
    }

    fetchSummary();
    fetchRecentMessages();
    fetchRecentApplications();
  }, [
    fetchRecentApplications,
    fetchRecentMessages,
    fetchSummary,
    handleUnauthorized,
    token,
  ]);

  const formatDate = (date) => {
    if (!date) {
      return "No Date";
    }

    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Summary of your admin panel activity</p>
      </div>

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
          <span className="stat-trend">Finalised hires</span>
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

      <div className="dashboard-bottom">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Messages</h3>
            <button type="button" onClick={() => navigate("/admin/messages")}>
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          {recentMessages.length === 0 && <p>No recent messages</p>}

          {recentMessages.map((message) => (
            <div key={message.id} className="list-item">
              <div className="avatar">{message.name?.charAt(0)}</div>
              <div className="list-content">
                <strong>{message.name}</strong>
                <p>{message.subject}</p>
                <small>{message.message}</small>
              </div>
              <span className="date">
                <Clock size={12} /> {formatDate(message.date)}
              </span>
            </div>
          ))}
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Applications</h3>
            <button type="button" onClick={() => navigate("/admin/pipeline")}>
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          {recentApplications.length === 0 && <p>No recent applications</p>}

          {recentApplications.map((application) => {
            const normalizedStatus = normalizeApplicationStatus(application.status);

            return (
              <div key={application.id} className="list-item">
                <div className="avatar">{application.name?.charAt(0)}</div>
                <div className="list-content">
                  <strong>{application.name}</strong>
                  <p>{application.position}</p>
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
