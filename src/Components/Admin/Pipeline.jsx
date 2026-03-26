import { useMemo, useState } from "react";
import {
  Bookmark,
  CheckCircle2,
  Clock,
  Search,
  XCircle,
} from "lucide-react";
import "./Admin.css";
import {
  applicationStatusLabels,
  applicationStatusOptions,
  normalizeApplicationStatus,
} from "./applicationStatus";
import { useAdminApplications } from "./applicationsContext";
import CandidateDetailsModal from "./CandidateDetailsModal";

const pipelineColumnConfig = {
  pending: {
    title: "Pending",
    description: "New candidates waiting for interview planning.",
    icon: Clock,
  },
  shortlisted: {
    title: "Shortlisted",
    description: "Candidates ready for interviews and evaluation.",
    icon: Bookmark,
  },
  selected: {
    title: "Selected",
    description: "Finalised candidates who move into hiring.",
    icon: CheckCircle2,
  },
  rejected: {
    title: "Rejected",
    description: "Archived from the active hiring flow.",
    icon: XCircle,
  },
};

const matchesApplicationId = (application, applicationId) =>
  String(application?.id) === String(applicationId);

const formatAppliedDate = (value) => {
  if (!value) {
    return "Date unavailable";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return parsed.toLocaleDateString([], {
    dateStyle: "medium",
  });
};

const Pipeline = () => {
  const {
    applications,
    loading,
    updateApplicationStatus,
    isApplicationStatusUpdating,
  } = useAdminApplications();
  const [search, setSearch] = useState("");
  const [draggedId, setDraggedId] = useState("");
  const [dragOverStatus, setDragOverStatus] = useState("");
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return applications;
    }

    return applications.filter((application) =>
      [application.name, application.email, application.jobTitle]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [applications, search]);

  const groupedCandidates = useMemo(() => {
    const grouped = applicationStatusOptions.reduce((groups, status) => {
      groups[status] = [];
      return groups;
    }, {});

    filteredApplications.forEach((candidate) => {
      grouped[normalizeApplicationStatus(candidate.status)].push(candidate);
    });

    return grouped;
  }, [filteredApplications]);

  const handleDragStart = (event, applicationId) => {
    const normalizedId = String(applicationId);
    setDraggedId(normalizedId);
    setFeedback({ type: "", text: "" });
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", normalizedId);
  };

  const handleDragEnd = () => {
    setDraggedId("");
    setDragOverStatus("");
  };

  const handleDrop = async (event, nextStatus) => {
    event.preventDefault();

    const applicationId = draggedId || event.dataTransfer.getData("text/plain");
    setDraggedId("");
    setDragOverStatus("");

    if (!applicationId) {
      return;
    }

    const currentApplication = applications.find((application) =>
      matchesApplicationId(application, applicationId)
    );

    if (
      !currentApplication ||
      normalizeApplicationStatus(currentApplication.status) === nextStatus
    ) {
      return;
    }

    const result = await updateApplicationStatus(applicationId, nextStatus, {
      optimistic: true,
    });

    if (!result.ok) {
      const message = result.message || "Failed to update. Try again.";
      setFeedback({
        type: "error",
        text: message,
      });
      if (typeof window !== "undefined") {
        window.alert(message);
      }
      return;
    }

    setFeedback({
      type: "success",
      text: `${currentApplication.name} moved to ${applicationStatusLabels[nextStatus]}.`,
    });
  };

  return (
    <div className="pipeline-wrapper">
      <div className="pipeline-header">
        <div>
          <h1>Hiring Pipeline</h1>
          <p>Drag candidates between stages and keep every admin screen in sync.</p>
        </div>
      </div>

      <div className="pipeline-toolbar">
        <div className="search-box pipeline-search">
          <Search size={14} />
          <input
            placeholder="Search candidates by name, email, or role..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {feedback.text && (
        <div className={`pipeline-feedback ${feedback.type === "error" ? "is-error" : "is-success"}`}>
          {feedback.text}
        </div>
      )}

      <div className="pipeline-board">
        {applicationStatusOptions.map((status) => {
          const column = pipelineColumnConfig[status];
          const Icon = column.icon;
          const candidates = groupedCandidates[status] || [];

          return (
            <section
              key={status}
              className={`pipeline-column${dragOverStatus === status ? " is-drag-over" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragOverStatus(status);
              }}
              onDragLeave={() => {
                setDragOverStatus((currentStatus) =>
                  currentStatus === status ? "" : currentStatus
                );
              }}
              onDrop={(event) => handleDrop(event, status)}
            >
              <div className={`pipeline-column-header pipeline-column-header-${status}`}>
                <div>
                  <div className="pipeline-column-title">
                    <Icon size={18} />
                    <h2>{column.title}</h2>
                  </div>
                  <p>{column.description}</p>
                </div>
                <span className="pipeline-column-count">{candidates.length}</span>
              </div>

              <div className="pipeline-column-body">
                {loading ? (
                  <div className="pipeline-empty-state">Loading candidates...</div>
                ) : candidates.length === 0 ? (
                  <div className="pipeline-empty-state">
                    No candidates in {column.title.toLowerCase()}.
                  </div>
                ) : (
                  candidates.map((candidate) => (
                    <article
                      key={candidate.id}
                      className={`pipeline-card pipeline-card-${status}${
                        isApplicationStatusUpdating(candidate.id) ? " is-updating" : ""
                      }`}
                      draggable={!isApplicationStatusUpdating(candidate.id)}
                      onDragStart={(event) => handleDragStart(event, candidate.id)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="pipeline-card-top">
                        <div>
                          <h3>{candidate.name}</h3>
                          <p>{candidate.email}</p>
                        </div>
                        <span className={`status ${status}`}>
                          {applicationStatusLabels[status]}
                        </span>
                      </div>

                      <div className="pipeline-card-meta">
                        <strong>{candidate.jobTitle}</strong>
                        <span>Applied {formatAppliedDate(candidate.appliedDate)}</span>
                      </div>

                      <div className="pipeline-card-actions">
                        <button
                          type="button"
                          className="pipeline-view-btn"
                          draggable={false}
                          onClick={() => setSelectedCandidateId(candidate.id)}
                        >
                          View
                        </button>
                      </div>

                      {candidate.interviewScheduled && (
                        <div className="pipeline-card-badge">Interview Scheduled</div>
                      )}
                    </article>
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>

      {selectedCandidateId && (
        <CandidateDetailsModal
          candidateId={selectedCandidateId}
          onClose={() => setSelectedCandidateId(null)}
          title="Candidate Details"
        />
      )}
    </div>
  );
};

export default Pipeline;
