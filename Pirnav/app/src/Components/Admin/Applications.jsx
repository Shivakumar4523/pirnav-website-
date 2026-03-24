import { useMemo, useState } from "react";
import {
  Bookmark,
  CheckCircle2,
  Clock,
  Eye,
  Search,
  XCircle,
} from "lucide-react";
import "./Admin.css";
import { applicationStatusLabels, applicationStatusOptions } from "./applicationStatus";
import { useAdminApplications } from "./applicationsContext";
import CandidateDetailsModal from "./CandidateDetailsModal";

const statusConfig = {
  pending: { label: "Pending", icon: Clock },
  shortlisted: { label: "Shortlisted", icon: Bookmark },
  selected: { label: "Selected", icon: CheckCircle2 },
  rejected: { label: "Rejected", icon: XCircle },
};

const formatAppliedDate = (value) => {
  if (!value) {
    return "Date unavailable";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return parsed.toLocaleDateString();
};

const Applications = () => {
  const { applications, applicationCounts, loading } = useAdminApplications();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  const filteredApplications = useMemo(
    () =>
      applications.filter((application) => {
        const query = search.toLowerCase();
        const matchesSearch =
          application.name?.toLowerCase().includes(query) ||
          application.email?.toLowerCase().includes(query) ||
          application.jobTitle?.toLowerCase().includes(query);
        const matchesFilter = filter === "all" || application.status === filter;

        return matchesSearch && matchesFilter;
      }),
    [applications, filter, search]
  );

  return (
    <div className="applications-wrapper">
      <div className="applications-header">
        <h1>Applications</h1>
      </div>

      <div className="summary-grid">
        {applicationStatusOptions.map((status) => {
          const Icon = statusConfig[status].icon;

          return (
            <div
              key={status}
              className={`summary-card status-card-${status} ${filter === status ? "active" : ""}`}
              onClick={() => setFilter(filter === status ? "all" : status)}
            >
              <Icon size={18} />
              <h2>{applicationCounts[status] || 0}</h2>
              <p>{statusConfig[status].label}</p>
            </div>
          );
        })}
      </div>

      <div className="filter-bar">
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">All Status</option>
          {applicationStatusOptions.map((status) => (
            <option key={status} value={status}>
              {applicationStatusLabels[status]}
            </option>
          ))}
        </select>

        <div className="search-box">
          <Search size={14} />
          <input
            placeholder="Search candidates..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <table className="applications-table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Position</th>
            <th>Status</th>
            <th>Applied</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="selected-candidates-empty">
                Loading applications...
              </td>
            </tr>
          ) : filteredApplications.length === 0 ? (
            <tr>
              <td colSpan={5} className="selected-candidates-empty">
                No applications found.
              </td>
            </tr>
          ) : (
            filteredApplications.map((application) => (
              <tr
                key={application.id}
                className={application.status === "selected" ? "selected-candidate-row" : ""}
              >
                <td>
                  <strong>{application.name}</strong>
                  <br />
                  <small>{application.email}</small>
                </td>
                <td>{application.jobTitle}</td>
                <td>
                  <span
                    className={`status ${application.status}${
                      application.status === "selected" ? " badge-selected" : ""
                    }`}
                  >
                    {applicationStatusLabels[application.status]}
                  </span>
                </td>
                <td>
                  <Clock size={12} /> {formatAppliedDate(application.appliedDate)}
                </td>
                <td>
                  <button type="button" onClick={() => setSelectedApplicationId(application.id)}>
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedApplicationId && (
        <CandidateDetailsModal
          candidateId={selectedApplicationId}
          onClose={() => setSelectedApplicationId(null)}
        />
      )}
    </div>
  );
};

export default Applications;
