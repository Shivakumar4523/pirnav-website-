/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { clearAdminToken, getAdminHeaders, getAdminToken } from "./adminAuth";
import {
  getApiErrorMessage,
  parseJsonSafely,
} from "../../lib/api.js";
import {
  JOB_APPLICATIONS_API_BASE,
  applicationStatusOptions,
  getApplicationSelectedDate,
  normalizeApplicationStatus,
  requestApplicationStatusUpdate,
} from "./applicationStatus";
import {
  DEFAULT_INTERVIEW_MANAGER_ID,
  INTERVIEW_API_BASE,
} from "./interviewApi";

const ApplicationsContext = createContext(null);

const matchesApplicationId = (application, applicationId) =>
  String(application?.id) === String(applicationId);

const formatInterviewDateForInput = (value) => {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
};

const formatInterviewTimeForInput = (value) => {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime()) && /[t\s]/i.test(String(value))) {
    return `${String(parsed.getHours()).padStart(2, "0")}:${String(parsed.getMinutes()).padStart(2, "0")}`;
  }

  const [hours = "00", minutes = "00"] = String(value).split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};

const formatInterviewTimeForApi = (value) => {
  const [hours = "00", minutes = "00", seconds = "00"] = String(value || "").split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
};

const normalizeInterviewMode = (mode) =>
  String(mode || "").toLowerCase() === "offline" ? "Offline" : "Online";

const extractInterviewDetails = (source) => {
  if (!source) {
    return null;
  }

  const interview =
    source.interview ||
    source.interviewDetails ||
    source.scheduledInterview ||
    source.data ||
    source;

  const rawDate =
    interview.interviewDate ||
    interview.date ||
    interview.scheduledDate ||
    interview.scheduledAt ||
    "";
  const rawTime =
    interview.interviewTime ||
    interview.time ||
    interview.scheduledTime ||
    interview.scheduledAt ||
    "";
  const rawMode = interview.mode || interview.interviewMode || "";
  const rawMeetingLink = interview.meetingLink || interview.interviewLink || "";
  const interviewer = interview.interviewer || interview.manager || interview.owner || null;
  const rawManagerName =
    interview.managerName ||
    interview.interviewerName ||
    interview.ownerName ||
    (typeof interviewer === "string"
      ? interviewer
      : interviewer?.name || interviewer?.fullName || "") ||
    "";
  const rawManagerId =
    interview.managerId ||
    interview.interviewerId ||
    interview.ownerId ||
    interviewer?.id ||
    null;
  const rawNotes = interview.notes || interview.interviewNotes || "";
  const details = {
    date: formatInterviewDateForInput(rawDate),
    time: formatInterviewTimeForInput(rawTime),
    mode: normalizeInterviewMode(rawMode),
    meetingLink: rawMeetingLink,
    managerName: rawManagerName,
    managerId: rawManagerId,
    notes: rawNotes,
  };

  const scheduledFlag =
    source.interviewScheduled ??
    source.isInterviewScheduled ??
    source.hasInterview ??
    interview.interviewScheduled ??
    interview.isInterviewScheduled;
  const hasInterviewData = [
    rawDate,
    rawTime,
    rawMode,
    rawMeetingLink,
    rawManagerName,
    rawNotes,
  ].some(Boolean);

  if (!hasInterviewData && !scheduledFlag) {
    return null;
  }

  return details;
};

const normalizeApplication = (application) => {
  const interviewDetails = extractInterviewDetails(application);

  return {
    id: application.id,
    name: application.name || "Unknown candidate",
    email: application.email || "Not available",
    jobTitle:
      application.jobTitle ||
      application.position ||
      application.role ||
      "Not assigned",
    status: normalizeApplicationStatus(application.status),
    appliedDate: application.appliedDate || application.createdDate || "",
    selectedDate: getApplicationSelectedDate(application),
    interviewScheduled: Boolean(
      application.interviewScheduled ??
        application.isInterviewScheduled ??
        application.hasInterview ??
        interviewDetails
    ),
    interviewDetails,
  };
};

export const AdminApplicationsProvider = ({ children }) => {
  const navigate = useNavigate();
  const token = getAdminToken();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdatingIds, setStatusUpdatingIds] = useState({});

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

  const setApplicationPatch = useCallback((applicationId, patch) => {
    setApplications((prev) =>
      prev.map((application) =>
        matchesApplicationId(application, applicationId)
          ? {
              ...application,
              ...(typeof patch === "function" ? patch(application) : patch),
            }
          : application
      )
    );
  }, []);

  const replaceApplicationSnapshot = useCallback((applicationId, nextApplication) => {
    setApplications((prev) =>
      prev.map((application) =>
        matchesApplicationId(application, applicationId) ? nextApplication : application
      )
    );
  }, []);

  const refreshApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const headers = getHeaders();
      if (!headers) {
        return;
      }

      const response = await fetch(JOB_APPLICATIONS_API_BASE, { headers });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data = await parseJsonSafely(response);
      const list = Array.isArray(data) ? data : data.applications || data.data || [];
      setApplications(list.map(normalizeApplication));
    } catch (requestError) {
      setError(requestError.message || "Unable to load applications.");
    } finally {
      setLoading(false);
    }
  }, [getHeaders, handleUnauthorized]);

  useEffect(() => {
    if (!token) {
      navigate("/admin-login", { replace: true });
      return;
    }

    refreshApplications();
  }, [navigate, refreshApplications, token]);

  const updateApplicationStatus = useCallback(
    async (applicationId, nextStatus, options = {}) => {
      const normalizedStatus = normalizeApplicationStatus(nextStatus);
      const currentApplication = applications.find((application) =>
        matchesApplicationId(application, applicationId)
      );

      if (!currentApplication) {
        return {
          ok: false,
          message: "Application not found.",
        };
      }

      const optimisticSelectedDate =
        normalizedStatus === "selected"
          ? currentApplication.selectedDate || new Date().toISOString()
          : "";

      if (options.optimistic) {
        setApplicationPatch(applicationId, {
          status: normalizedStatus,
          selectedDate: optimisticSelectedDate,
        });
      }

      setStatusUpdatingIds((prev) => ({
        ...prev,
        [String(applicationId)]: true,
      }));

      try {
        const result = await requestApplicationStatusUpdate({
          applicationId,
          nextStatus: normalizedStatus,
          token,
        });

        if (!result.ok) {
          if (options.optimistic) {
            replaceApplicationSnapshot(applicationId, currentApplication);
          }

          if (result.unauthorized) {
            handleUnauthorized();
          }

          return result;
        }

        const resolvedStatus = normalizeApplicationStatus(
          result.data?.status || normalizedStatus
        );
        const selectedDate =
          resolvedStatus === "selected"
            ? getApplicationSelectedDate(result.data) ||
              currentApplication.selectedDate ||
              new Date().toISOString()
            : "";

        setApplicationPatch(applicationId, {
          status: resolvedStatus,
          selectedDate,
          interviewScheduled: currentApplication.interviewScheduled,
          interviewDetails: currentApplication.interviewDetails,
        });

        return {
          ok: true,
          data: result.data,
          status: resolvedStatus,
          selectedDate,
          interviewScheduled: currentApplication.interviewScheduled,
        };
      } catch (requestError) {
        if (options.optimistic) {
          replaceApplicationSnapshot(applicationId, currentApplication);
        }

        console.error(
          "[ApplicationsContext] Status update error:",
          requestError.response?.data || requestError.message || requestError
        );

        return {
          ok: false,
          message: requestError.message || "Unable to update application status.",
        };
      } finally {
        setStatusUpdatingIds((prev) => {
          const next = { ...prev };
          delete next[String(applicationId)];
          return next;
        });
      }
    },
    [applications, handleUnauthorized, replaceApplicationSnapshot, setApplicationPatch, token]
  );

  const scheduleInterview = useCallback(
    async ({ applicationId, interviewForm }) => {
      const currentApplication = applications.find((application) =>
        matchesApplicationId(application, applicationId)
      );

      if (!currentApplication) {
        return {
          ok: false,
          message: "Application not found.",
        };
      }

      if (normalizeApplicationStatus(currentApplication.status) !== "shortlisted") {
        return {
          ok: false,
          message: "Only shortlisted candidates can be scheduled from Interviews.",
        };
      }

      const headers = getHeaders();
      if (!headers) {
        return {
          ok: false,
          unauthorized: true,
          message: "Session expired. Please login again.",
        };
      }

      const payload = {
        applicationId,
        managerId: DEFAULT_INTERVIEW_MANAGER_ID,
        interviewDate: new Date(interviewForm.date).toISOString(),
        interviewTime: formatInterviewTimeForApi(interviewForm.time),
        mode: interviewForm.mode,
        meetingLink:
          interviewForm.mode === "Online" ? interviewForm.meetingLink.trim() : "",
        notes: interviewForm.notes.trim(),
      };

      try {
        const response = await fetch(INTERVIEW_API_BASE, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
        const responseData = await parseJsonSafely(response);

        if (response.status === 401) {
          handleUnauthorized();
          return {
            ok: false,
            unauthorized: true,
            message: "Unauthorized",
          };
        }

        if (!response.ok) {
          throw new Error(getApiErrorMessage(responseData, "Unable to schedule interview."));
        }

        const interviewDetails = extractInterviewDetails(responseData) || {
          date: interviewForm.date,
          time: formatInterviewTimeForInput(payload.interviewTime),
          mode: payload.mode,
          meetingLink: payload.meetingLink,
          managerId: payload.managerId,
          notes: payload.notes,
        };

        setApplicationPatch(applicationId, {
          interviewScheduled: true,
          interviewDetails,
          status: currentApplication.status,
        });

        return {
          ok: true,
          data: {
            interviewDetails,
            status: currentApplication.status,
          },
          message: "Interview scheduled successfully.",
        };
      } catch (requestError) {
        return {
          ok: false,
          message: requestError.message || "Unable to schedule interview.",
        };
      }
    },
    [applications, getHeaders, handleUnauthorized, setApplicationPatch]
  );

  const groupedApplications = useMemo(() => {
    const grouped = applicationStatusOptions.reduce((groups, status) => {
      groups[status] = [];
      return groups;
    }, {});

    applications.forEach((application) => {
      grouped[normalizeApplicationStatus(application.status)].push(application);
    });

    return grouped;
  }, [applications]);

  const applicationCounts = useMemo(
    () =>
      applicationStatusOptions.reduce((counts, status) => {
        counts[status] = groupedApplications[status]?.length || 0;
        return counts;
      }, {}),
    [groupedApplications]
  );

  const selectedCandidates = useMemo(
    () =>
      applications.filter(
        (application) => normalizeApplicationStatus(application.status) === "selected"
      ),
    [applications]
  );

  const getApplicationById = useCallback(
    (applicationId) =>
      applications.find((application) => matchesApplicationId(application, applicationId)) ||
      null,
    [applications]
  );

  const isApplicationStatusUpdating = useCallback(
    (applicationId) => Boolean(statusUpdatingIds[String(applicationId)]),
    [statusUpdatingIds]
  );

  const value = useMemo(
    () => ({
      applications,
      loading,
      error,
      groupedApplications,
      applicationCounts,
      selectedCandidates,
      refreshApplications,
      updateApplicationStatus,
      scheduleInterview,
      getApplicationById,
      isApplicationStatusUpdating,
    }),
    [
      applications,
      loading,
      error,
      groupedApplications,
      applicationCounts,
      selectedCandidates,
      refreshApplications,
      updateApplicationStatus,
      scheduleInterview,
      getApplicationById,
      isApplicationStatusUpdating,
    ]
  );

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  );
};

export const useAdminApplications = () => {
  const context = useContext(ApplicationsContext);

  if (!context) {
    throw new Error("useAdminApplications must be used within AdminApplicationsProvider.");
  }

  return context;
};
