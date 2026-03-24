import { useMemo, useState } from "react";
import { CheckCircle2, Search } from "lucide-react";
import "./Admin.css";
import {
  applicationStatusLabels,
} from "./applicationStatus";
import { useAdminApplications } from "./applicationsContext";

const formatSelectedDate = (value) => {
  if (!value) {
    return "Not available";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return parsed.toLocaleDateString([], {
    dateStyle: "medium",
  });
};

const SelectedCandidates = () => {
  const { loading, selectedCandidates } = useAdminApplications();
  const [search, setSearch] = useState("");

  const filteredCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();
    const sortedCandidates = [...selectedCandidates].sort((candidateA, candidateB) => {
      const dateA = Date.parse(candidateA.selectedDate || "") || 0;
      const dateB = Date.parse(candidateB.selectedDate || "") || 0;
      return dateB - dateA;
    });

    if (!query) {
      return sortedCandidates;
    }

    return sortedCandidates.filter((candidate) =>
      [candidate.name, candidate.email, candidate.jobTitle]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [search, selectedCandidates]);

  return (
    <div className="applications-wrapper selected-candidates-wrapper">
      <div className="selected-candidates-header">
        <div>
          <h1>Selected Candidates</h1>
          <p>Track finalised candidates moved forward from the interview pipeline.</p>
        </div>

        <div className="selected-candidates-summary">
          <CheckCircle2 size={18} />
          <span>{loading ? "Loading..." : `${selectedCandidates.length} Selected`}</span>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <Search size={14} />
          <input
            placeholder="Search selected candidates..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <table className="applications-table">
        <thead>
          <tr>
            <th>Candidate Name</th>
            <th>Email</th>
            <th>Job Role</th>
            <th>Status</th>
            <th>Date Selected</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="selected-candidates-empty">
                Loading selected candidates...
              </td>
            </tr>
          ) : filteredCandidates.length === 0 ? (
            <tr>
              <td colSpan={5} className="selected-candidates-empty">
                No selected candidates found.
              </td>
            </tr>
          ) : (
            filteredCandidates.map((candidate) => (
              <tr key={candidate.id} className="selected-candidate-row">
                <td>{candidate.name}</td>
                <td>{candidate.email}</td>
                <td>{candidate.jobTitle}</td>
                <td>
                  <span className="status selected badge-selected">
                    {applicationStatusLabels.selected}
                  </span>
                </td>
                <td>{formatSelectedDate(candidate.selectedDate)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SelectedCandidates;
