// AdminTickets.jsx

import { useState } from "react";
import "./AdminTickets.css";

const AdminTickets = () => {
  const ticketsData = [
    {
      id: "#1021",
      user: "Ali",
      subject: "Payment Issue",
      status: "Open",
      priority: "High",
      category: "Billing",
      date: "11 May",
    },
    {
      id: "#1022",
      user: "Ahmed",
      subject: "Login Error",
      status: "Pending",
      priority: "Medium",
      category: "Technical",
      date: "10 May",
    },
    {
      id: "#1023",
      user: "Sara",
      subject: "Refund Request",
      status: "Closed",
      priority: "Low",
      category: "Billing",
      date: "09 May",
    },
    {
      id: "#1024",
      user: "Hassan",
      subject: "Account Locked",
      status: "Open",
      priority: "High",
      category: "Security",
      date: "08 May",
    },
    {
      id: "#1025",
      user: "Areeba",
      subject: "Profile Update",
      status: "Pending",
      priority: "Low",
      category: "General",
      date: "07 May",
    },
    {
      id: "#1026",
      user: "Usman",
      subject: "Subscription Error",
      status: "Closed",
      priority: "Medium",
      category: "Billing",
      date: "06 May",
    },
    {
      id: "#1027",
      user: "Fatima",
      subject: "Password Reset",
      status: "Open",
      priority: "Medium",
      category: "Security",
      date: "05 May",
    },
    {
      id: "#1028",
      user: "Bilal",
      subject: "Website Crash",
      status: "Open",
      priority: "High",
      category: "Technical",
      date: "04 May",
    },
    {
      id: "#1029",
      user: "Zoya",
      subject: "Email Verification",
      status: "Pending",
      priority: "Medium",
      category: "General",
      date: "03 May",
    },
    {
      id: "#1030",
      user: "Hamza",
      subject: "Refund Delay",
      status: "Closed",
      priority: "Low",
      category: "Billing",
      date: "02 May",
    },
    {
      id: "#1031",
      user: "Iqra",
      subject: "2FA Problem",
      status: "Open",
      priority: "High",
      category: "Security",
      date: "01 May",
    },
    {
      id: "#1032",
      user: "Daniyal",
      subject: "Dashboard Bug",
      status: "Pending",
      priority: "Medium",
      category: "Technical",
      date: "30 Apr",
    },
  ];

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // POPUP STATE
  const [selectedTicket, setSelectedTicket] = useState(null);

  // FILTER LOGIC
  const filteredTickets = ticketsData.filter((ticket) => {
    const matchesSearch =
      ticket.user.toLowerCase().includes(search.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      ticket.id.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === "All" || ticket.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="tickets-page">
      {/* TOPBAR */}
      <div className="tickets-topbar">
        <h2>🎫 Support Tickets</h2>

        <div className="ticket-actions">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* CATEGORY FILTER */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Billing">Billing</option>
            <option value="Technical">Technical</option>
            <option value="Security">Security</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      {/* STATS */}
      <div className="ticket-stats">
        <div className="stat-card">
          <span>Total</span>
          <h4>{ticketsData.length}</h4>
        </div>

        <div className="stat-card">
          <span>Open</span>
          <h4>
            {ticketsData.filter((ticket) => ticket.status === "Open").length}
          </h4>
        </div>

        <div className="stat-card">
          <span>Pending</span>
          <h4>
            {ticketsData.filter((ticket) => ticket.status === "Pending").length}
          </h4>
        </div>

        <div className="stat-card">
          <span>Closed</span>
          <h4>
            {ticketsData.filter((ticket) => ticket.status === "Closed").length}
          </h4>
        </div>
      </div>

      {/* TABLE */}
      <div className="ticket-table-wrapper">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Subject</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket, index) => (
                <tr key={index}>
                  <td>{ticket.id}</td>

                  <td>{ticket.user}</td>

                  <td>{ticket.subject}</td>

                  <td>{ticket.category}</td>

                  <td>
                    <span className={`status ${ticket.status.toLowerCase()}`}>
                      {ticket.status}
                    </span>
                  </td>

                  <td>{ticket.priority}</td>

                  <td>{ticket.date}</td>

                  <td>
                    <button onClick={() => setSelectedTicket(ticket)}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  No Tickets Found 🔍
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* POPUP */}
      {selectedTicket && (
        <div className="popup-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="ticket-popup" onClick={(e) => e.stopPropagation()}>
            <h3>Ticket Details</h3>

            {/* NEW 2-COLUMN GRID LAYOUT */}
            <div className="popup-details-grid">
              <div className="popup-detail">
                <strong>Ticket ID</strong>
                <span>{selectedTicket.id}</span>
              </div>

              <div className="popup-detail">
                <strong>User</strong>
                <span>{selectedTicket.user}</span>
              </div>

              <div className="popup-detail">
                <strong>Subject</strong>
                <span>{selectedTicket.subject}</span>
              </div>

              <div className="popup-detail">
                <strong>Category</strong>
                <span>{selectedTicket.category}</span>
              </div>

              <div className="popup-detail">
                <strong>Status</strong>
                <span>{selectedTicket.status}</span>
              </div>

              <div className="popup-detail">
                <strong>Priority</strong>
                <span>{selectedTicket.priority}</span>
              </div>

              <div className="popup-detail">
                <strong>Date</strong>
                <span>{selectedTicket.date}</span>
              </div>
            </div>

            <button
              className="close-popup-btn"
              onClick={() => setSelectedTicket(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTickets;
