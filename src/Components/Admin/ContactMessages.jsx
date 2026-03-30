import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Eye, Search, Trash2 } from "lucide-react";
import "./Admin.css";
import { clearAdminToken, getAdminHeaders, getAdminToken } from "./adminAuth";
import { API_ROUTES } from "../../lib/api.js";

const API_BASE = API_ROUTES.contact;

const ContactMessages = () => {
  const navigate = useNavigate();
  const token = getAdminToken();
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [deleteMsg, setDeleteMsg] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getHeaders = useCallback(() => getAdminHeaders(token), [token]);

  const handleUnauthorized = useCallback(() => {
    clearAdminToken();
    navigate("/admin-login", { replace: true });
  }, [navigate]);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const headers = getHeaders();

      if (!headers) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(API_BASE, { headers });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Unable to load contact messages.", error);
    } finally {
      setLoading(false);
    }
  }, [getHeaders, handleUnauthorized]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const headers = getHeaders();

      if (!headers) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(`${API_BASE}/unread-count`, { headers });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setUnreadCount(data?.unread ?? 0);
    } catch (error) {
      console.error("Unable to load unread count.", error);
    }
  }, [getHeaders, handleUnauthorized]);

  useEffect(() => {
    if (!token) {
      navigate("/admin-login", { replace: true });
      return;
    }

    fetchMessages();
    fetchUnreadCount();
  }, [fetchMessages, fetchUnreadCount, navigate, token]);

  const openMessage = async (id) => {
    try {
      const headers = getHeaders();

      if (!headers) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(`${API_BASE}/${id}`, { headers });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();
      setSelected(data);

      if (data.status === "Unread") {
        const markReadResponse = await fetch(`${API_BASE}/mark-read/${id}`, {
          method: "PUT",
          headers,
        });

        if (markReadResponse.status === 401) {
          handleUnauthorized();
          return;
        }

        await Promise.all([fetchMessages(), fetchUnreadCount()]);
      }
    } catch (error) {
      console.error("Unable to open the selected message.", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteMsg) {
      return;
    }

    try {
      const headers = getHeaders();

      if (!headers) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(`${API_BASE}/${deleteMsg.id}`, {
        method: "DELETE",
        headers,
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      await Promise.all([fetchMessages(), fetchUnreadCount()]);
      setDeleteMsg(null);
    } catch (error) {
      console.error("Unable to delete the selected message.", error);
    }
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filteredMessages = messages.filter((message) => {
    if (!normalizedSearch) {
      return true;
    }

    return [message.name, message.email, message.subject]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(normalizedSearch));
  });

  return (
    <div className="messages-wrapper">
      <div className="messages-header">
        <h1>Contact Messages</h1>
        <span className="unread-badge">{unreadCount} unread</span>
      </div>

      <div className="search-box">
        <Search size={16} />
        <input
          placeholder="Search..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading && <p>Loading...</p>}

      <table className="messages-table">
        <thead>
          <tr>
            <th>Sender</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Received</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredMessages.map((message) => (
            <tr key={message.id}>
              <td>
                <strong>{message.name}</strong>
                <br />
                <small>{message.email}</small>
              </td>
              <td>{message.subject}</td>
              <td>
                <span
                  className={`status ${
                    message.status === "Read" ? "read" : "unread"
                  }`}
                >
                  {message.status === "Read" ? "Read" : "Unread"}
                </span>
              </td>
              <td>
                <Clock size={12} />{" "}
                {message.createdDate
                  ? new Date(message.createdDate).toLocaleDateString()
                  : ""}
              </td>
              <td>
                <button type="button" onClick={() => openMessage(message.id)}>
                  <Eye size={14} />
                </button>
                <button type="button" onClick={() => setDeleteMsg(message)}>
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{selected.subject}</h3>
            <p>
              From: {selected.name} ({selected.email})
            </p>

            <div className="message-box">{selected.message}</div>

            <div className="modal-actions">
              <button type="button" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteMsg && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Message</h3>
            <p>Delete message from {deleteMsg.name}?</p>

            <div className="modal-actions">
              <button type="button" onClick={() => setDeleteMsg(null)}>
                Cancel
              </button>
              <button type="button" className="delete-btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
