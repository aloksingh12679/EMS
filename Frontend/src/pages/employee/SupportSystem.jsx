import React, { useState } from "react";
import "../../assets/styles/SupportStyles/Support.css";
import AdminSidebar from "../../Components/AdminSidebar";
import EmployeesSidebar from "../../Components/EmployeesSidebar";
import { ticketService } from "../../services/ticketService";
import { useEffect } from "react";
import { employeeService } from "../../services/employeeServices";

const Support = () => {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);
  
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  const [activate, setActivate] = useState("type");
  const links = [
    {
      id: "type",
      label: "Types & Reason",
    },
    { id: "date", label: "Date" },
    { id: "days", label: "Days" },
    { id: "status", label: "Status" },
  ];

  const contacts = [
    {
      name: "Sarah Jenkins",
      role: "System Administrator",
      avatar: "SJ",
      online: true,
    },
    {
      name: "Michael Chen",
      role: "HR Support Lead",
      avatar: "MC",
      online: true,
    },
  ];

  const faqs = [
    { id: 1, question: "How do I request time off?" },
    { id: 2, question: "Why can't I access my pay stub?" },
    { id: 3, question: "Resetting MFA Token" },
  ];

  const handleSubmit = async () => {
    // Validation
    if (!subject.trim()) {
      showToast("Please enter a subject", "error");
      return;
    }

    if (!category) {
      showToast("Please select a category", "error");
      return;
    }

    if (!description.trim()) {
      showToast("Please enter a description", "error");
      return;
    }

    if (description.length > 2000) {
      showToast("Description cannot exceed 2000 characters", "error");
      return;
    }

    setLoading(true);

    try {
      const ticketData = {
        subject: subject.trim(),
        category,
        priority,
        description: description.trim(),
      };

      const response = await ticketService.createTicket(ticketData);

      if (response.success) {
        showToast("Your query submitted successfully!", "success");

       
        setSubject("");
        setCategory("");
        setPriority("Medium");
        setDescription("");
      }
    } catch (err) {
      console.error("Error submitting ticket:", err);
      showToast(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit ticket. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSubject("");
    setCategory("");
    setPriority("Medium");
    setDescription("");
  };
//  useEffect(() => {
//      fetchTickets();
//    }, []);
 
//    const fetchTickets = async () => {
//      try {
//       //  setLoading(true);
//        const result = await employeeService.getTickets();
//       console.log(result);
       
//      } catch (error) {
//        console.error("tickets Error:", error);
      
//      }
//    };
  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 animate-slideIn ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px] max-w-md`}>
          <div className={`w-2 h-2 rounded-full ${toast.type === 'error' ? 'bg-red-300' : 'bg-green-300'}`}></div>
          <span className="font-medium">{toast.message}</span>
          <button onClick={() => setToast({ show: false, message: '', type: '' })} className="ml-auto text-white/80 hover:text-white">
            ✕
          </button>
        </div>
      )}
      
      <EmployeesSidebar />
      <div className="support-center">
        <div className="support-header">
          <div className="support-header-child1">
            <h1>Support Center</h1>
            <p className="support-subtitle">How can we help you today?</p>
          </div>
          <div className="support-header-child2">
            <div className="support-header-buttons">
              <button className="support-btn-secondary">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                Knowledge Base
              </button>
              <button className="support-btn-secondary">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                My Tickets
              </button>
            </div>
          </div>
        </div>

        <div className="support-content-grid">
          <div className="support-main-content">
            <div className="support-ticket-form">
              <h2>New Support Ticket</h2>
              <p className="support-form-subtitle">
                Please provide detailed information to help us resolve your
                issue quickly.
              </p>

              <div className="support-form-group">
                <label>Subject</label>
                <input
                  type="text"
                  placeholder="Briefly describe the issue (e.g., Unable to access Payroll module)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="support-form-row">
                <div className="support-form-group">
                  <label>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select a category...</option>
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="Payroll & Compensation">Payroll & Compensation</option>
                    <option value="Benefits">Benefits</option>
                    <option value="Access Control">Access Control</option>
                    <option value="HR Policy Inquiry">HR Policy Inquiry</option>
                  </select>
                </div>

                <div className="support-form-group">
                  <label>Priority Level</label>
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Low">Low - Minor Issue</option>
                    <option value="Medium">Medium - Affects Work</option>
                    <option value="High">High - Critical Issue</option>
                    <option value="Urgent">Urgent - Blocking Work</option>
                  </select>
                </div>
              </div>

              <div className="support-form-group">
                <label>Description</label>
                <textarea
                  placeholder="Please describe the issue in detail, including any error messages..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="6"
                ></textarea>
                <div className="support-char-count">
                  {description.length}/2000 characters
                </div>
              </div>

              <div className="support-form-group">
                <label>Attachments (Optional)</label>
                <div className="support-upload-area">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <p>Click to upload or drag and drop</p>
                  <span>SVG, PNG, JPG or PDF (max. 10MB)</span>
                </div>
              </div>

              <div className="support-form-actions">
                <button 
                  className="support-btn-cancel"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  className="support-btn-submit"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Ticket"}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="support-sidebar">
            <div className="support-sidebar-section">
              <h3>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Direct Contacts
              </h3>

              {contacts.map((contact, index) => (
                <div key={index} className="support-contact-card">
                  <div className="support-contact-info">
                    <div className="support-avatar">
                      {contact.avatar}
                      {contact.online && (
                        <span className="support-status-dot"></span>
                      )}
                    </div>
                    <div>
                      <div className="support-contact-name">{contact.name}</div>
                      <div className="support-contact-role">{contact.role}</div>
                    </div>
                  </div>
                  <div className="support-contact-actions">
                    <button className="support-icon-btn">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </button>
                    <button className="support-icon-btn">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              <div className="support-emergency-box">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                <div>
                  <div className="support-emergency-label">IT EMERGENCY</div>
                  <div className="support-emergency-number">
                    Ext. 4004 (24/7)
                  </div>
                </div>
              </div>
            </div>

            <div className="support-sidebar-section">
              <h3>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Common Questions
              </h3>

              <div className="support-faq-list">
                {faqs.map((faq) => (
                  <div key={faq.id} className="support-faq-item">
                    <button
                      className="support-faq-question"
                      onClick={() =>
                        setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                      }
                    >
                      {faq.question}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={expandedFaq === faq.id ? "rotated" : ""}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <button className="support-view-all-btn">
                View all FAQs
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <footer className="support-footer">
          <p>© 2024 Enterprise EMS. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default Support;