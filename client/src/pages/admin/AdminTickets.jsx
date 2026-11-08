import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AdminTickets.css";

const AdminTickets = () => {
  const [ticketsData, setTicketsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState(null);

  // ✅ Fetch tickets from backend
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:1000/api/tickets/all");
      
      console.log("Tickets response:", response.data);
      
      if (response.data.success) {
        setTicketsData(response.data.tickets || []);
      }
    } catch (error) {
      console.error("Fetch tickets error:", error);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  // ✅ REFRESH FUNCTION - Reset filters and fetch fresh data
  const handleRefresh = async () => {
    // Reset search and category filters
    setSearch("");
    setCategory("All");
    
    // Fetch fresh data from backend
    await fetchTickets();
    
    // Show success toast
    toast.success("Tickets refreshed successfully!");
  };

  // ✅ Create bulk demo tickets (if needed)
  const createBulkTickets = async () => {
    try {
      const response = await axios.post("http://localhost:1000/api/tickets/bulk-create");
      if (response.data.success) {
        toast.success(`${response.data.message}`);
        fetchTickets();
      }
    } catch (error) {
      console.error("Bulk create error:", error);
      toast.error("Failed to create demo tickets");
    }
  };

  // ✅ Update ticket status
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:1000/api/tickets/update-status/${id}`, {
        status: newStatus
      });
      
      if (response.data.success) {
        toast.success(`Ticket ${newStatus}`);
        fetchTickets();
      }
    } catch (error) {
      console.error("Update status error:", error);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ✅ FILTER LOGIC
  const filteredTickets = ticketsData.filter((ticket) => {
    const matchesSearch =
      ticket.user?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.subject?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.ticketId?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === "All" || ticket.category === category;

    return matchesSearch && matchesCategory;
  });

  // ✅ STATS
  const totalTickets = ticketsData.length;
  const openTickets = ticketsData.filter(t => t.status === "Open").length;
  const pendingTickets = ticketsData.filter(t => t.status === "Pending").length;
  const closedTickets = ticketsData.filter(t => t.status === "Closed").length;

  // ✅ Loading State
  if (loading) {
    return (
      <div className="tickets-page">
        <div className="tickets-topbar">
          <h2>🎫 Support Tickets</h2>
        </div>
        <div className="ticket-stats">
          {[1,2,3,4].map(i => (
            <div key={i} className="stat-card">
              <span>Loading...</span>
              <h4>---</h4>
            </div>
          ))}
        </div>
        <div className="ticket-table-wrapper">
          <div className="no-data">Loading tickets...</div>
        </div>
      </div>
    );
  }

  // ✅ No Tickets State
  if (!loading && ticketsData.length === 0) {
    return (
      <div className="tickets-page">
        <div className="tickets-topbar">
          <h2>🎫 Support Tickets</h2>
          <div className="ticket-actions">
            <button onClick={createBulkTickets} style={{ padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>
              📋 Add Demo Tickets
            </button>
          </div>
        </div>
        <div className="ticket-table-wrapper">
          <div className="no-data">No tickets found. Click "Add Demo Tickets" to get started.</div>
        </div>
      </div>
    );
  }

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

          {/* ✅ REFRESH BUTTON - Resets filters and fetches fresh data */}
          <button onClick={handleRefresh}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="ticket-stats">
        <div className="stat-card">
          <span>Total</span>
          <h4>{totalTickets}</h4>
        </div>

        <div className="stat-card">
          <span>Open</span>
          <h4>{openTickets}</h4>
        </div>

        <div className="stat-card">
          <span>Pending</span>
          <h4>{pendingTickets}</h4>
        </div>

        <div className="stat-card">
          <span>Closed</span>
          <h4>{closedTickets}</h4>
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
                <tr key={ticket._id || index}>
                  <td>{ticket.ticketId}</td>
                  <td>{ticket.user}</td>
                  <td>{ticket.subject}</td>
                  <td>{ticket.category}</td>
                  <td>
                    <span className={`status ${ticket.status?.toLowerCase()}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td>{ticket.priority}</td>
                  <td>{ticket.date}</td>
                  <td>
                    <button onClick={() => setSelectedTicket(ticket)}>
                      View
                    </button>
                    {ticket.status === "Open" && (
                      <button onClick={() => updateStatus(ticket._id, "Pending")}>
                        Mark Pending
                      </button>
                    )}
                    {ticket.status === "Pending" && (
                      <button onClick={() => updateStatus(ticket._id, "Closed")}>
                        Close
                      </button>
                    )}
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

            <div className="popup-details-grid">
              <div className="popup-detail">
                <strong>Ticket ID</strong>
                <span>{selectedTicket.ticketId}</span>
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