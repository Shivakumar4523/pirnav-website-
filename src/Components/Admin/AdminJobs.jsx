import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import { clearAdminToken, getAdminHeaders, getAdminToken } from "./adminAuth";

const API_BASE =
  "/api/Jobs";

const AdminJobs = () => {
  const navigate = useNavigate();
  const token = getAdminToken();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState(null);

  const [form, setForm] = useState({
    jobTitle: "",
    workLocation: "",
    jobType: "full-time",
    status: "open",
    experience: "",
    ctc: "",
    highestQualification: "",
    jobDescription: "",
    mandatorySkills: "",
  });

  const getHeaders = () => {
    return getAdminHeaders(token);
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin-login", { replace: true });
      return;
    }

    fetchJobs();
  }, [navigate, token]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const headers = getHeaders();
      if (!headers) return;

      const res = await fetch(API_BASE, { headers });
      if (res.status === 401) {
        clearAdminToken();
        navigate("/admin-login", { replace: true });
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch jobs");

      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const headers = getHeaders();
      if (!headers) return;

      const method = editingJob ? "PUT" : "POST";
      const url = editingJob
        ? `${API_BASE}/${editingJob.id}`
        : API_BASE;

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(form),
      });

      if (res.status === 401) {
        clearAdminToken();
        navigate("/admin-login", { replace: true });
        return;
      }

      if (!res.ok) {
        alert("Operation failed");
        return;
      }

      setShowModal(false);
      setEditingJob(null);
      fetchJobs();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const headers = getHeaders();
      if (!headers) return;

      const res = await fetch(`${API_BASE}/${editingJob.id}`, {
        method: "DELETE",
        headers,
      });

      if (res.status === 401) {
        clearAdminToken();
        navigate("/admin-login", { replace: true });
        return;
      }

      if (!res.ok) {
        alert("Delete failed");
        return;
      }

      setDeleteModal(false);
      setEditingJob(null);
      fetchJobs();
    } catch (error) {
      console.error(error);
    }
  };

  const openCreate = () => {
    setEditingJob(null);
    setForm({
      jobTitle: "",
      workLocation: "",
      jobType: "full-time",
      status: "open",
      experience: "",
      ctc: "",
      highestQualification: "",
      jobDescription: "",
      mandatorySkills: "",
    });
    setShowModal(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setForm({
      jobTitle: job.jobTitle || "",
      workLocation: job.workLocation || "",
      jobType: job.jobType || "full-time",
      status: job.status || "open",
      experience: job.experience || "",
      ctc: job.ctc || "",
      highestQualification: job.highestQualification || "",
      jobDescription: job.jobDescription || "",
      mandatorySkills: job.mandatorySkills || "",
    });
    setShowModal(true);
  };

  const filteredJobs = jobs.filter((job) =>
    job.jobTitle?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="jobs-wrapper">
      <div className="jobs-header">
        <h1>Jobs</h1>
        <button className="add-btn" onClick={openCreate}>
          <Plus size={16} /> Post New Job
        </button>
      </div>

      <div className="search-box">
        <Search size={16} />
        <input
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p>Loading...</p>}

      <div className="jobs-accordion">
        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card-admin">
            <div className="job-header-admin">
              <div>
                <h3>{job.jobTitle}</h3>
                <p>
                  {job.workLocation} | {job.jobType} | Experience:{" "}
                  {job.experience}
                </p>
              </div>

              <div className="job-actions-admin">
                <button
                  className="expand-btn"
                  onClick={() =>
                    setOpenId(openId === job.id ? null : job.id)
                  }
                >
                  {openId === job.id ? "−" : "+"}
                </button>

                <button onClick={() => openEdit(job)}>
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => {
                    setEditingJob(job);
                    setDeleteModal(true);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div
              className={`job-expand-section ${
                openId === job.id ? "active" : ""
              }`}
            >
              <div className="expand-content">
                <p><strong>CTC:</strong> {job.ctc}</p>
                <p><strong>Status:</strong> {job.status}</p>
                <p><strong>Highest Qualification:</strong> {job.highestQualification}</p>

                <h4>Job Description</h4>
                <p>{job.jobDescription}</p>

                <h4>Mandatory Skills</h4>
                <pre>{job.mandatorySkills}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal large">
            <h3>{editingJob ? "Edit Job" : "Post New Job"}</h3>

            <input
              placeholder="Job Title"
              value={form.jobTitle}
              onChange={(e) =>
                setForm({ ...form, jobTitle: e.target.value })
              }
            />

            <input
              placeholder="Work Location"
              value={form.workLocation}
              onChange={(e) =>
                setForm({ ...form, workLocation: e.target.value })
              }
            />

            <select
              value={form.jobType}
              onChange={(e) =>
                setForm({ ...form, jobType: e.target.value })
              }
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="hybrid">Hybrid</option>
              <option value="remote">Remote</option>
            </select>

            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>

            <input
              placeholder="Experience"
              value={form.experience}
              onChange={(e) =>
                setForm({ ...form, experience: e.target.value })
              }
            />

            <input
              placeholder="CTC"
              value={form.ctc}
              onChange={(e) =>
                setForm({ ...form, ctc: e.target.value })
              }
            />

            <input
              placeholder="Highest Qualification"
              value={form.highestQualification}
              onChange={(e) =>
                setForm({
                  ...form,
                  highestQualification: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Job Description"
              value={form.jobDescription}
              onChange={(e) =>
                setForm({ ...form, jobDescription: e.target.value })
              }
            />

            <textarea
              placeholder="Mandatory Skills"
              value={form.mandatorySkills}
              onChange={(e) =>
                setForm({
                  ...form,
                  mandatorySkills: e.target.value,
                })
              }
            />

            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={handleSave} className="save-btn">
                {editingJob ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Job</h3>
            <p>Are you sure you want to delete this job?</p>
            <div className="modal-actions">
              <button onClick={() => setDeleteModal(false)}>
                Cancel
              </button>
              <button onClick={handleDelete} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
