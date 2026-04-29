import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiCheckCircle, FiClock, FiUser, FiBook, FiCalendar, FiInbox } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Server_URL } from "../../utils/config";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";
import "./librarian.css";

export default function LibrarianRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const url = Server_URL + "librarian/issuerequest"
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      });
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Error fetching requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approveRequest = async (id) => {
    try {
      const url = Server_URL + "librarian/approverequest/" + id;
      const response = await axios.put(url, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      });
      showSuccessToast(response.data.message || "Book issued successfully!");
      fetchRequests();
    } catch (err) {
      const message = err.response?.data?.error || "Something went wrong";
      showErrorToast(message);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-bg-glow"></div>
      
      <div className="container p-relative">
        <div className="admin-header-section">
          <div className="header-left">
            <h1 className="admin-title">Issue Requests</h1>
            <p className="admin-subtitle">Approve or manage pending book issue requests from students.</p>
          </div>
        </div>

        {loading ? (
          <div className="loader-v3"><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
        ) : (
          <div className="requests-container">
            {requests.length === 0 ? (
              <div className="empty-state glass">
                <FiInbox size={60} />
                <h3>No Pending Requests</h3>
                <p>Everything is up to date! Check back later for new requests.</p>
              </div>
            ) : (
              <div className="requests-grid">
                <AnimatePresence>
                  {requests.map((req) => (
                    <motion.div 
                      key={req._id}
                      className="request-card glass"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <div className="request-card-header">
                        <div className="user-info">
                          <div className="avatar-mini"><FiUser /></div>
                          <div>
                            <h4>{req.userId?.name || "Anonymous Student"}</h4>
                            <span>{req.userId?.email}</span>
                          </div>
                        </div>
                        <div className="status-badge-v2 warning">
                          <FiClock /> {req.status}
                        </div>
                      </div>

                      <div className="request-card-body">
                        <div className="info-row">
                          <FiBook />
                          <div>
                            <label>Requested Book</label>
                            <p>{req.bookId?.title || "Unknown Book"}</p>
                          </div>
                        </div>
                        <div className="info-grid">
                          <div className="info-row">
                            <FiCalendar />
                            <div>
                              <label>Issue Date</label>
                              <p>{new Date(req.issueDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="info-row">
                            <FiCalendar />
                            <div>
                              <label>Due Date</label>
                              <p>{new Date(req.dueDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="request-card-footer">
                        <button className="btn-approve" onClick={() => approveRequest(req._id)}>
                          <FiCheckCircle /> Approve & Issue
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
