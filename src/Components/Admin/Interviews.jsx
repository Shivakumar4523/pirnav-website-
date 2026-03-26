import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import { clearAdminToken, getAdminHeaders, getAdminToken } from "./adminAuth";
import {
  getApplicationSelectedDate,
  normalizeApplicationStatus,
} from "./applicationStatus";
import { useAdminApplications } from "./applicationsContext";
import { DEFAULT_INTERVIEW_MANAGER_ID, INTERVIEW_API_BASE } from "./interviewApi";

const interviewStatusConfig = {
  scheduled: { label: "Scheduled", tone: "scheduled" },
  completed: { label: "Completed", tone: "completed" },
  cancelled: { label: "Cancelled", tone: "cancelled" },
};

const interviewStatusOptions = Object.keys(interviewStatusConfig);

const createEmptyScheduleForm = () => ({
  interviewDate: "",
  interviewTime: "",
  mode: "Online",
  meetingLink: "",
  notes: "",
});

const getScheduleFormFromCandidate = (candidate) => ({
  interviewDate: candidate?.interviewDate || "",
  interviewTime: candidate?.interviewTime || "",
  mode: normalizeInterviewMode(candidate?.mode),
  meetingLink: candidate?.meetingLink || "",
  notes: candidate?.notes || "",
});

const normalizeInterviewStatus = (status) => {
  const normalized = String(status || "").toLowerCase();
  return interviewStatusOptions.includes(normalized) ? normalized : "scheduled";
};

const formatInterviewStatusForApi = (status) => {
  const normalized = normalizeInterviewStatus(status);
  return interviewStatusConfig[normalized].label;
};

const normalizeInterviewMode = (mode) =>
  String(mode || "").toLowerCase() === "offline" ? "Offline" : "Online";

const formatDateForInput = (value) => {
  if (!value) return "";

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
};

const formatTimeForInput = (value) => {
  if (!value) return "";

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime()) && /[t\s]/i.test(String(value))) {
    return `${String(parsed.getHours()).padStart(2, "0")}:${String(parsed.getMinutes()).padStart(2, "0")}`;
  }

  const [hours = "00", minutes = "00"] = String(value).split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};

const formatDateForApi = (value) => {
  if (!value) return "";

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  return String(value);
};

const formatDateTime = (date, time) => {
  if (!date && !time) return "Not scheduled";

  const composed = date && time ? new Date(`${date}T${time}`) : new Date(date);
  if (Number.isNaN(composed.getTime())) {
    return [date, time].filter(Boolean).join(" ");
  }

  return composed.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: time ? "short" : undefined,
  });
};

const getInterviewDateTimeParts = (interview) => {
  const scheduledAt =
    interview.scheduledAt || interview.scheduledFor || interview.scheduledDateTime || "";

  return {
    date:
      interview.interviewDate ||
      interview.date ||
      interview.scheduledDate ||
      scheduledAt,
    time:
      interview.interviewTime ||
      interview.time ||
      interview.scheduledTime ||
      scheduledAt,
  };
};

const getInterviewerName = (interview) => {
  const interviewer = interview.interviewer || interview.manager || interview.owner || null;

  if (typeof interviewer === "string") {
    return interviewer;
  }

  return (
    interview.managerName ||
    interview.interviewerName ||
    interview.ownerName ||
    interviewer?.name ||
    interviewer?.fullName ||
    ""
  );
};

const getInterviewerId = (interview) => {
  const interviewer = interview.interviewer || interview.manager || interview.owner || null;

  return (
    interview.managerId ||
    interview.interviewerId ||
    interview.ownerId ||
    interviewer?.id ||
    DEFAULT_INTERVIEW_MANAGER_ID
  );
};

const normalizeInterview = (interview) => {
  const application =
    interview.application ||
    interview.jobApplication ||
    interview.candidateApplication ||
    {};
  const candidate = interview.candidate || interview.applicant || {};
  const scheduled = getInterviewDateTimeParts(interview);

  return {
    id: interview.id || interview.interviewId,
    applicationId: interview.applicationId || application.id || interview.jobApplicationId || null,
    candidateName:
      interview.candidateName ||
      interview.name ||
      application.name ||
      candidate.name ||
      "Unknown candidate",
    email:
      interview.email ||
      application.email ||
      candidate.email ||
      interview.candidateEmail ||
      "",
    jobTitle:
      interview.jobTitle ||
      application.jobTitle ||
      interview.position ||
      interview.role ||
      "",
    interviewDate: formatDateForInput(scheduled.date),
    interviewTime: formatTimeForInput(scheduled.time),
    mode: normalizeInterviewMode(interview.mode || interview.interviewMode),
    status: normalizeInterviewStatus(interview.status),
    managerId: getInterviewerId(interview),
    managerName: getInterviewerName(interview),
    meetingLink: interview.meetingLink || interview.interviewLink || "",
    notes: interview.notes || interview.interviewNotes || "",
    applicationStatus: normalizeApplicationStatus(
      application.status || interview.applicationStatus || interview.candidateStatus
    ),
    selectedDate: getApplicationSelectedDate({ ...application, ...interview }),
    isScheduled: true,
  };
};

const createShortlistedCandidateRow = (application) => ({
  id: `application-${application.id}`,
  applicationId: application.id,
  candidateName: application.name || "Unknown candidate",
  email: application.email || "",
  jobTitle: application.jobTitle || "Not assigned",
  interviewDate: "",
  interviewTime: "",
  mode: "Online",
  status: "scheduled",
  managerId: DEFAULT_INTERVIEW_MANAGER_ID,
  managerName: "",
  meetingLink: "",
  notes: "",
  applicationStatus: normalizeApplicationStatus(application.status),
  selectedDate: getApplicationSelectedDate(application),
  isScheduled: false,
});

const getApiErrorMessage = (responseData, fallbackMessage) => {
  const validationErrors = Object.values(responseData?.errors || {})
    .flat()
    .filter(Boolean);

  if (validationErrors.length > 0) {
    return validationErrors.join(" ");
  }

  return (
    responseData?.message ||
    responseData?.error ||
    responseData?.title ||
    fallbackMessage
  );
};

const Interviews = () => {
  const navigate = useNavigate();
  const token = getAdminToken();
  const {
    applications,
    loading: applicationsLoading,
    scheduleInterview,
    updateApplicationStatus,
  } = useAdminApplications();
  const [interviews, setInterviews] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [selectionUpdatingId, setSelectionUpdatingId] = useState(null);
  const [rejectUpdatingId, setRejectUpdatingId] = useState(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleCandidate, setScheduleCandidate] = useState(null);
  const [scheduleForm, setScheduleForm] = useState(createEmptyScheduleForm());
  const [scheduleErrors, setScheduleErrors] = useState({});
  const [scheduleSubmitting, setScheduleSubmitting] = useState(false);

  const handleUnauthorized = useCallback(() => {
    clearAdminToken();
    navigate("/admin-login", { replace: true });
  }, [navigate]);

  const getHeaders = useCallback(() => {
    const headers = getAdminHeaders(token);

    if (!headers) {
      navigate("/admin-login", { replace: true });
      return null;
    }

    return headers;
  }, [navigate, token]);

  const fetchInterviews = useCallback(async () => {
    try {
      setLoading(true);
      const headers = getHeaders();
      if (!headers) return;

      const response = await fetch(INTERVIEW_API_BASE, { headers });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          responseData?.message ||
            responseData?.error ||
            responseData?.title ||
            "Unable to load interviews."
        );
      }

      const list = Array.isArray(responseData)
        ? responseData
        : responseData?.interviews || responseData?.data || [];

      setInterviews(list.map(normalizeInterview));
    } catch (error) {
      console.error("[Interviews] Fetch error:", error.response?.data || error.message || error);
      setFeedback({
        type: "error",
        text: error.message || "Unable to load interviews.",
      });
    } finally {
      setLoading(false);
    }
  }, [getHeaders, handleUnauthorized]);

  useEffect(() => {
    if (!token) {
      navigate("/admin-login", { replace: true });
      return;
    }

    fetchInterviews();
  }, [fetchInterviews, navigate, token]);

  const applicationById = useMemo(
    () => new Map(applications.map((application) => [String(application.id), application])),
    [applications]
  );

  const mergedInterviews = useMemo(
    () =>
      interviews.map((interview) => {
        const application = applicationById.get(String(interview.applicationId));

        if (!application) {
          return interview;
        }

        return {
          ...interview,
          candidateName: application.name || interview.candidateName,
          email: application.email || interview.email,
          jobTitle: application.jobTitle || interview.jobTitle,
          applicationStatus: normalizeApplicationStatus(application.status),
          selectedDate: application.selectedDate || interview.selectedDate,
        };
      }),
    [applicationById, interviews]
  );

  const scheduledApplicationIds = useMemo(
    () =>
      new Set(
        mergedInterviews
          .map((interview) => String(interview.applicationId || ""))
          .filter(Boolean)
      ),
    [mergedInterviews]
  );

  const shortlistedCandidates = useMemo(
    () =>
      applications.filter(
        (application) => normalizeApplicationStatus(application.status) === "shortlisted"
      ),
    [applications]
  );

  const interviewRows = useMemo(() => {
    const unscheduledCandidates = shortlistedCandidates
      .filter((application) => !scheduledApplicationIds.has(String(application.id)))
      .map(createShortlistedCandidateRow);

    return [...unscheduledCandidates, ...mergedInterviews].filter(
      (interview) => interview.applicationStatus !== "rejected"
    );
  }, [mergedInterviews, scheduledApplicationIds, shortlistedCandidates]);

  const filteredInterviews = useMemo(() => {
    const query = search.trim().toLowerCase();

    return interviewRows.filter((interview) => {
      const matchesSearch =
        !query ||
        interview.candidateName.toLowerCase().includes(query) ||
        interview.email.toLowerCase().includes(query) ||
        interview.jobTitle.toLowerCase().includes(query) ||
        interview.managerName.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all" || (interview.isScheduled && interview.status === filter);

      return matchesSearch && matchesFilter;
    });
  }, [filter, interviewRows, search]);

  const handleMarkSelected = async (interview) => {
    if (!interview?.applicationId) {
      setFeedback({
        type: "error",
        text: "This interview is not linked to an application record.",
      });
      return;
    }

    if (!interview.isScheduled) {
      setFeedback({
        type: "error",
        text: "Schedule the interview before moving the candidate to Selected.",
      });
      return;
    }

    try {
      setSelectionUpdatingId(interview.id);
      setFeedback({ type: "", text: "" });

      const result = await updateApplicationStatus(interview.applicationId, "selected");

      if (!result.ok) {
        throw new Error(result.message || "Unable to mark candidate as selected.");
      }

      setFeedback({
        type: "success",
        text: "Candidate moved to Selected Candidates successfully.",
      });
    } catch (error) {
      console.error("[Interviews] Candidate selection error:", error.response?.data || error.message || error);
      setFeedback({
        type: "error",
        text: error.message || "Unable to mark candidate as selected.",
      });
    } finally {
      setSelectionUpdatingId(null);
    }
  };

  const handleRejectCandidate = async (interview) => {
    if (!interview?.applicationId) {
      setFeedback({
        type: "error",
        text: "This interview is not linked to an application record.",
      });
      return;
    }

    try {
      setRejectUpdatingId(interview.applicationId);
      setFeedback({ type: "", text: "" });

      const result = await updateApplicationStatus(interview.applicationId, "rejected");

      if (!result.ok) {
        throw new Error(result.message || "Unable to reject candidate.");
      }

      setFeedback({
        type: "success",
        text: `${interview.candidateName} rejected successfully.`,
      });
    } catch (error) {
      console.error("[Interviews] Candidate rejection error:", error.response?.data || error.message || error);
      setFeedback({
        type: "error",
        text: error.message || "Unable to reject candidate.",
      });
    } finally {
      setRejectUpdatingId(null);
    }
  };

  const openScheduleModal = (candidate) => {
    setScheduleCandidate(candidate);
    setScheduleForm(getScheduleFormFromCandidate(candidate));
    setScheduleErrors({});
    setFeedback({ type: "", text: "" });
    setScheduleOpen(true);
  };

  const closeScheduleModal = () => {
    setScheduleOpen(false);
    setScheduleCandidate(null);
    setScheduleForm(createEmptyScheduleForm());
    setScheduleErrors({});
  };

  const handleScheduleFieldChange = (field, value) => {
    setScheduleForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "mode" && value === "Offline") {
        next.meetingLink = "";
      }

      return next;
    });

    setScheduleErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateScheduleForm = () => {
    const nextErrors = {};

    if (!scheduleForm.interviewDate) {
      nextErrors.interviewDate = "Interview date is required.";
    }

    if (!scheduleForm.interviewTime) {
      nextErrors.interviewTime = "Interview time is required.";
    }

    if (scheduleForm.mode === "Online" && !scheduleForm.meetingLink.trim()) {
      nextErrors.meetingLink = "Meeting link is required for online interviews.";
    }

    setScheduleErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleScheduleSubmit = async (event) => {
    event.preventDefault();

    if (!scheduleCandidate?.applicationId || !validateScheduleForm()) {
      return;
    }

    try {
      setScheduleSubmitting(true);
      setFeedback({ type: "", text: "" });

      if (scheduleCandidate.isScheduled && scheduleCandidate.id) {
        const headers = getHeaders();
        if (!headers) return;

        const payload = {
          interviewDate: formatDateForApi(scheduleForm.interviewDate),
          interviewTime: `${scheduleForm.interviewTime}:00`,
          mode: scheduleForm.mode,
          meetingLink:
            scheduleForm.mode === "Online" ? scheduleForm.meetingLink.trim() : "",
          notes: scheduleForm.notes.trim(),
          managerId: DEFAULT_INTERVIEW_MANAGER_ID,
          status: formatInterviewStatusForApi(scheduleCandidate.status || "scheduled"),
        };

        const response = await fetch(`${INTERVIEW_API_BASE}/${scheduleCandidate.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });
        const responseData = await response.json().catch(() => null);

        if (response.status === 401) {
          handleUnauthorized();
          return;
        }

        if (!response.ok) {
          throw new Error(getApiErrorMessage(responseData, "Unable to schedule interview."));
        }
      } else {
        const result = await scheduleInterview({
          applicationId: scheduleCandidate.applicationId,
          interviewForm: {
            date: scheduleForm.interviewDate,
            time: scheduleForm.interviewTime,
            mode: scheduleForm.mode,
            meetingLink: scheduleForm.meetingLink,
            notes: scheduleForm.notes,
          },
        });

        if (!result.ok) {
          throw new Error(result.message || "Unable to schedule interview.");
        }
      }

      await fetchInterviews();
      setFeedback({
        type: "success",
        text: `${scheduleCandidate.candidateName} scheduled successfully.`,
      });
      closeScheduleModal();
    } catch (error) {
      console.error("[Interviews] Schedule error:", error.response?.data || error.message || error);
      setFeedback({
        type: "error",
        text: error.message || "Unable to schedule interview.",
      });
    } finally {
      setScheduleSubmitting(false);
    }
  };

  const isPageLoading = loading || applicationsLoading;

  return (
    <div className="interviews-wrapper">
      <div className="interviews-header">
        <div>
          <h1>Interviews</h1>
          <p>Schedule shortlisted candidates here and manage interview outcomes in one place.</p>
        </div>
      </div>

      <div className="interviews-toolbar">
        <div className="search-box interviews-search">
          <Search size={14} />
          <input
            placeholder="Search by candidate, email, job title, or manager..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          className="interviews-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">All Statuses</option>
          {interviewStatusOptions.map((status) => (
            <option key={status} value={status}>
              {interviewStatusConfig[status].label}
            </option>
          ))}
        </select>
      </div>

      {feedback.text && (
        <div className={`interviews-feedback ${feedback.type === "error" ? "is-error" : "is-success"}`}>
          {feedback.text}
        </div>
      )}

      <div className="interviews-table-shell">
        <table className="interviews-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Job Title</th>
              <th>Interview</th>
              <th>Mode</th>
              <th>Status</th>
              <th>Manager</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {isPageLoading ? (
              <tr>
                <td colSpan={7} className="interviews-empty">
                  Loading interviews...
                </td>
              </tr>
            ) : filteredInterviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="interviews-empty">
                  No shortlisted candidates or interviews found.
                </td>
              </tr>
            ) : (
              filteredInterviews.map((interview) => (
                <tr key={interview.id}>
                  <td>
                    <div className="interview-candidate">
                      <strong>{interview.candidateName}</strong>
                      <small>{interview.email}</small>
                      {interview.applicationStatus === "selected" && (
                        <span className="interview-selected-pill">Selected Candidate</span>
                      )}
                    </div>
                  </td>
                  <td>{interview.jobTitle || "Not assigned"}</td>
                  <td>
                    <div className="interview-datetime">
                      <CalendarDays size={14} />
                      <span>
                        {interview.isScheduled
                          ? formatDateTime(interview.interviewDate, interview.interviewTime)
                          : "Not scheduled yet"}
                      </span>
                    </div>
                  </td>
                  <td>
                    {interview.isScheduled ? (
                      <span className={`interview-mode-badge ${interview.mode.toLowerCase()}`}>
                        {interview.mode}
                      </span>
                    ) : (
                      <span className="interviews-empty-inline">--</span>
                    )}
                  </td>
                  <td>
                    {interview.isScheduled ? (
                      <span
                        className={`interview-status-badge ${interviewStatusConfig[interview.status].tone}`}
                      >
                        {interviewStatusConfig[interview.status].label}
                      </span>
                    ) : (
                      <span className="interview-status-badge awaiting">Awaiting Schedule</span>
                    )}
                  </td>
                  <td>{interview.managerName || "Not assigned"}</td>
                  <td>
                    <div className="interview-actions">
                      <button
                        type="button"
                        className="interview-row-btn btn-primary"
                        onClick={() => openScheduleModal(interview)}
                        disabled={
                          scheduleSubmitting &&
                          scheduleCandidate?.applicationId === interview.applicationId
                        }
                      >
                        {scheduleSubmitting &&
                        scheduleCandidate?.applicationId === interview.applicationId
                          ? "Scheduling..."
                          : "Schedule"}
                      </button>

                      <button
                        type="button"
                        className="interview-row-btn interview-row-btn-success"
                        onClick={() => handleMarkSelected(interview)}
                        disabled={
                          !interview.applicationId ||
                          !interview.isScheduled ||
                          selectionUpdatingId === interview.id ||
                          interview.applicationStatus === "selected"
                        }
                      >
                        {interview.applicationStatus === "selected"
                          ? "Selected"
                          : selectionUpdatingId === interview.id
                            ? "Saving..."
                            : "Mark Selected"}
                      </button>

                      <button
                        type="button"
                        className="interview-row-btn interview-row-btn-danger"
                        onClick={() => handleRejectCandidate(interview)}
                        disabled={
                          !interview.applicationId ||
                          rejectUpdatingId === interview.applicationId ||
                          interview.applicationStatus === "selected" ||
                          interview.applicationStatus === "rejected"
                        }
                      >
                        {rejectUpdatingId === interview.applicationId ? "Saving..." : "Reject"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {scheduleOpen && scheduleCandidate && (
        <div className="modal-overlay interviews-modal-overlay">
          <div className="modal large interviews-modal">
            <h3>Schedule Interview</h3>
            <p className="interviews-modal-subtitle">
              {scheduleCandidate.candidateName} | {scheduleCandidate.jobTitle || "Interview"}
            </p>

            <form onSubmit={handleScheduleSubmit} className="interviews-form-grid">
              <div className="interviews-field">
                <label htmlFor="schedule-date">Interview Date</label>
                <input
                  id="schedule-date"
                  type="date"
                  value={scheduleForm.interviewDate}
                  onChange={(event) =>
                    handleScheduleFieldChange("interviewDate", event.target.value)
                  }
                />
                {scheduleErrors.interviewDate && (
                  <small className="interviews-field-error">{scheduleErrors.interviewDate}</small>
                )}
              </div>

              <div className="interviews-field">
                <label htmlFor="schedule-time">Interview Time</label>
                <input
                  id="schedule-time"
                  type="time"
                  value={scheduleForm.interviewTime}
                  onChange={(event) =>
                    handleScheduleFieldChange("interviewTime", event.target.value)
                  }
                />
                {scheduleErrors.interviewTime && (
                  <small className="interviews-field-error">{scheduleErrors.interviewTime}</small>
                )}
              </div>

              <div className="interviews-field">
                <label htmlFor="schedule-mode">Mode</label>
                <select
                  id="schedule-mode"
                  value={scheduleForm.mode}
                  onChange={(event) => handleScheduleFieldChange("mode", event.target.value)}
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

              <div className="interviews-field">
                <label htmlFor="schedule-manager">Manager</label>
                <input
                  id="schedule-manager"
                  type="text"
                  value={`Manager #${DEFAULT_INTERVIEW_MANAGER_ID}`}
                  disabled
                />
              </div>

              <div className="interviews-field interviews-field-full">
                <label htmlFor="schedule-link">Meeting Link</label>
                <input
                  id="schedule-link"
                  type="url"
                  value={scheduleForm.meetingLink}
                  onChange={(event) =>
                    handleScheduleFieldChange("meetingLink", event.target.value)
                  }
                  placeholder={
                    scheduleForm.mode === "Online"
                      ? "https://meet.example.com/..."
                      : "Optional for offline interviews"
                  }
                />
                {scheduleErrors.meetingLink && (
                  <small className="interviews-field-error">{scheduleErrors.meetingLink}</small>
                )}
              </div>

              <div className="interviews-field interviews-field-full">
                <label htmlFor="schedule-notes">Notes</label>
                <textarea
                  id="schedule-notes"
                  rows="4"
                  value={scheduleForm.notes}
                  onChange={(event) => handleScheduleFieldChange("notes", event.target.value)}
                  placeholder="Optional instructions for the candidate or panel"
                />
              </div>

              <div className="modal-actions interviews-modal-actions">
                <button type="button" onClick={closeScheduleModal}>
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={scheduleSubmitting}>
                  {scheduleSubmitting ? "Scheduling..." : "Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interviews;
