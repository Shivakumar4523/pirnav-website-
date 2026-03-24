import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import { clearAdminToken, getAdminHeaders, getAdminToken } from "./adminAuth";
import {
  JOB_APPLICATIONS_API_BASE,
  applicationStatusLabels,
  applicationStatusOptions,
  normalizeApplicationStatus,
} from "./applicationStatus";
import { useAdminApplications } from "./applicationsContext";

const formatInterviewSummary = (details) => {
  if (!details?.date || !details?.time) {
    return "Interview scheduled";
  }

  const date = new Date(`${details.date}T${details.time}`);
  const formattedDate = Number.isNaN(date.getTime())
    ? `${details.date} ${details.time}`
    : date.toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      });

  return `${formattedDate} | ${details.mode}`;
};

const CandidateDetailsModal = ({ candidateId, onClose, title = "Application Details" }) => {
  const navigate = useNavigate();
  const token = getAdminToken();
  const {
    getApplicationById,
    updateApplicationStatus,
    isApplicationStatusUpdating,
  } = useAdminApplications();
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const candidate = getApplicationById(candidateId);

  useEffect(() => {
    setFeedback({ type: "", text: "" });
  }, [candidateId]);

  if (!candidate) {
    return null;
  }

  const selectedStatus = normalizeApplicationStatus(candidate.status);
  const selectedStatusLabel = applicationStatusLabels[selectedStatus];
  const isUpdatingSelected = isApplicationStatusUpdating(candidate.id);
  const interviewSummary = candidate.interviewDetails
    ? formatInterviewSummary(candidate.interviewDetails)
    : "";

  const handleUnauthorized = () => {
    clearAdminToken();
    navigate("/admin-login", { replace: true });
  };

  const updateStatus = async (newStatus) => {
    const normalizedStatus = normalizeApplicationStatus(newStatus);

    if (!applicationStatusOptions.includes(normalizedStatus)) {
      setFeedback({
        type: "error",
        text: "Please choose a valid application status.",
      });
      return;
    }

    setFeedback({ type: "", text: "" });
    const result = await updateApplicationStatus(candidate.id, normalizedStatus);

    if (!result.ok) {
      if (result.message !== "Unauthorized") {
        setFeedback({
          type: "error",
          text: result.message || "Unable to update application status.",
        });
      }
      return;
    }
  };

  const downloadResume = async () => {
    try {
      const headers = getAdminHeaders(token);
      if (!headers) {
        navigate("/admin-login", { replace: true });
        return;
      }

      const response = await fetch(`${JOB_APPLICATIONS_API_BASE}/download/${candidate.id}`, {
        method: "GET",
        headers,
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = "resume.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "[CandidateDetailsModal] Resume download error:",
        error.response?.data || error.message || error
      );
      setFeedback({
        type: "error",
        text: error.message || "Unable to download resume.",
      });
    }
  };

  return (
    <div className="applications-wrapper candidate-modal-shell">
      <div className="modal-overlay application-modal-overlay">
        <div className="modal large application-detail-modal">
          <h3>{title}</h3>

          <div className="candidate-info">
            <h4>{candidate.name}</h4>
            <p>{candidate.email}</p>

            <div className="application-meta-badges">
              <span
                className={`status ${selectedStatus}${
                  selectedStatus === "selected" ? " badge-selected" : ""
                }`}
              >
                {selectedStatusLabel}
              </span>
              {candidate.interviewScheduled && (
                <span className="application-interview-badge">Interview Scheduled</span>
              )}
            </div>
          </div>

          <div className="details-box">
            <p>
              <strong>Position:</strong> {candidate.jobTitle}
            </p>
            <p>
              <strong>Applied:</strong> {new Date(candidate.appliedDate).toLocaleDateString()}
            </p>
          </div>

          {candidate.interviewScheduled && interviewSummary && (
            <div className="application-interview-summary">
              <strong>Interview:</strong> {interviewSummary}
            </div>
          )}

          <div className="application-modal-toolbar">
            <div className="application-action-group">
              <button type="button" className="resume-btn" onClick={downloadResume}>
                Download Resume
              </button>
            </div>

            <div className="application-status-field">
              <label htmlFor="application-status-select">Application Status</label>
              <select
                id="application-status-select"
                className="application-status-select"
                value={selectedStatus}
                onChange={(event) => updateStatus(event.target.value)}
              >
                {applicationStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {applicationStatusLabels[status]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {feedback.text && (
            <p className={`application-status-feedback${feedback.type === "error" ? " is-error" : " is-success"}`}>
              {feedback.text}
            </p>
          )}

          {!feedback.text && (
            <p className="application-status-feedback">
              {isUpdatingSelected ? "Saving status..." : "Status changes save automatically."}
            </p>
          )}

          <div className="modal-actions application-modal-actions">
            <button type="button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailsModal;
