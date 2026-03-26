// src/Components/Admin/ContactMessages.jsx
 
import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { Search, Eye, Trash2, Clock } from "lucide-react";

import "./Admin.css";
import { clearAdminToken, getAdminHeaders, getAdminToken } from "./adminAuth";
 
const API_BASE =
  "/api/Contact";
 
const ContactMessages = () => {

  const [messages, setMessages] = useState([]);

  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState(null);

  const [deleteMsg, setDeleteMsg] = useState(null);

  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(false);
 
  const navigate = useNavigate();
  const token = getAdminToken();
 
  const getHeaders = () => {
    return getAdminHeaders(token);

  };
 
  useEffect(() => {
    if (!token) {
      navigate("/admin-login", { replace: true });
      return;
    }

    fetchMessages();

    fetchUnreadCount();

  }, [navigate, token]);
 
  // ===============================

  // GET ALL

  // ===============================

  const fetchMessages = async () => {

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

      const data = await res.json();
 
      setMessages(Array.isArray(data) ? data : []);

    } catch (err) {

      console.error("Load error", err);

    } finally {

      setLoading(false);

    }

  };
 
  // ===============================

  // GET UNREAD COUNT

  // ===============================

  const fetchUnreadCount = async () => {

    try {

      const headers = getHeaders();

      if (!headers) return;
 
      const res = await fetch(`${API_BASE}/unread-count`, {

        headers,

      });

      if (res.status === 401) {
        clearAdminToken();
        navigate("/admin-login", { replace: true });
        return;
      }
 
      if (!res.ok) return;
 
      const data = await res.json();
 
      // Backend returns: { unread: number }

      setUnreadCount(data?.unread ?? 0);

    } catch (err) {

      console.error("Unread count error:", err);

    }

  };
 
  // ===============================

  // 👁 VIEW + MARK READ

  // ===============================

  const openMessage = async (id) => {

    try {

      const headers = getHeaders();

      if (!headers) return;
 
      const res = await fetch(`${API_BASE}/${id}`, {

        headers,

      });

      if (res.status === 401) {
        clearAdminToken();
        navigate("/admin-login", { replace: true });
        return;
      }
 
      const data = await res.json();

      setSelected(data);
 
      if (data.status === "Unread") {

      const markReadResponse = await fetch(`${API_BASE}/mark-read/${id}`, {

          method: "PUT",

          headers,

        });

        if (markReadResponse.status === 401) {
          clearAdminToken();
          navigate("/admin-login", { replace: true });
          return;
        }
 
        await fetchMessages();

        await fetchUnreadCount();

      }

    } catch (err) {

      console.error("Open error", err);

    }

  };
 
  // ===============================

  // DELETE

  // ===============================

  const handleDelete = async () => {

    try {

      const headers = getHeaders();

      if (!headers) return;
 
      const response = await fetch(`${API_BASE}/${deleteMsg.id}`, {

        method: "DELETE",

        headers,

      });

      if (response.status === 401) {
        clearAdminToken();
        navigate("/admin-login", { replace: true });
        return;
      }
 
      await fetchMessages();

      await fetchUnreadCount();
 
      setDeleteMsg(null);

    } catch (err) {

      console.error("Delete error", err);

    }

  };
 
  const filtered = messages.filter(

    (m) =>

      m.name?.toLowerCase().includes(search.toLowerCase()) ||

      m.email?.toLowerCase().includes(search.toLowerCase()) ||

      m.subject?.toLowerCase().includes(search.toLowerCase())

  );
 
  return (
<div className="messages-wrapper">
<div className="messages-header">
<h1>Contact Messages</h1>
<span className="unread-badge">

          {unreadCount} unread
</span>
</div>
 
      <div className="search-box">
<Search size={16} />
<input

          placeholder="Search..."

          value={search}

          onChange={(e) => setSearch(e.target.value)}

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

          {filtered.map((msg) => (
<tr key={msg.id}>
<td>
<strong>{msg.name}</strong>
<br />
<small>{msg.email}</small>
</td>
 
              <td>{msg.subject}</td>
 
              <td>
<span

                 className={`status ${msg.status === "Read" ? "read" : "unread"}`}
>

                 {msg.status === "Read" ? "Read" : "Unread"}
</span>
</td>
 
              <td>
<Clock size={12} />

                {msg.createdDate

                  ? new Date(msg.createdDate).toLocaleDateString()

                  : ""}
</td>
 
              <td>
<button onClick={() => openMessage(msg.id)}>
<Eye size={14} />
</button>
 
                <button onClick={() => setDeleteMsg(msg)}>
<Trash2 size={14} />
</button>
</td>
</tr>

          ))}
</tbody>
</table>
 
      {/* VIEW MODAL */}

      {selected && (
<div className="modal-overlay">
<div className="modal">
<h3>{selected.subject}</h3>
<p>

              From: {selected.name} ({selected.email})
</p>
 
            <div className="message-box">

              {selected.message}
</div>
 
           <div className="modal-actions">
<button onClick={() => setSelected(null)}>
Close
</button>
</div>
</div>
</div>

      )}
 
      {/* DELETE MODAL */}

      {deleteMsg && (
<div className="modal-overlay">
<div className="modal">
<h3>Delete Message</h3>
<p>Delete message from {deleteMsg.name}?</p>
 
            <div className="modal-actions">
<button onClick={() => setDeleteMsg(null)}>

                Cancel
</button>
 
              <button

                className="delete-btn"

                onClick={handleDelete}
>

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
