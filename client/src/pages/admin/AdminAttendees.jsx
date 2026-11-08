import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AdminAttendees.css";

const AdminAttendeePage = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [exhibitors, setExhibitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAttendees: 0,
    totalExhibitors: 0,
    pendingCount: 0
  });

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        toast.error("Please login as admin");
        setLoading(false);
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.get(
        "http://localhost:1000/api/users/all",
        config
      );

      if (response.data.success) {
        const allUsers = response.data.users || [];
        
        // Pending users (status pending, admin ko chhod kar)
        const pending = allUsers.filter(user => 
          user.role !== 'admin' && user.status === 'pending'
        );
        
        // Approved Attendees
        const allAttendees = allUsers.filter(user => 
          user.role === 'attendee' && user.status === 'approved'
        );
        
        // Approved Exhibitors
        const approvedExhibitors = allUsers.filter(user => 
          user.role === 'exhibitor' && user.status === 'approved'
        );
        
        setAttendees(allAttendees);
        setExhibitors(approvedExhibitors);
        setPendingRequests(pending);
        
        setStats({
          totalAttendees: allAttendees.length,
          totalExhibitors: approvedExhibitors.length,
          pendingCount: pending.length
        });
        
        console.log("Stats Updated:", {
          attendees: allAttendees.length,
          exhibitors: approvedExhibitors.length,
          pending: pending.length
        });
      }

    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId, userEmail, userRole) => {
    try {
      const token = getToken();
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      console.log("Approving:", { userId, userEmail, userRole });

      const response = await axios.put(
        `http://localhost:1000/api/users/approve-user/${userId}`,
        { 
          isApproved: true, 
          status: "approved",
          role: userRole
        },
        config
      );

      console.log("Approve response:", response.data);

      if (response.data.success) {
        toast.success(`${userEmail} approved as ${userRole === 'exhibitor' ? 'Exhibitor' : 'Attendee'}!`);
        setTimeout(() => fetchData(), 500);
      } else {
        toast.error(response.data.message || "Approval failed");
      }
    } catch (error) {
      console.error("Approve error:", error);
      toast.error(error.response?.data?.message || "Failed to approve user");
    }
  };

  const handleReject = async (userId, userEmail) => {
    if (window.confirm(`Are you sure you want to reject ${userEmail}?`)) {
      try {
        const token = getToken();
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const response = await axios.delete(
          `http://localhost:1000/api/users/reject-user/${userId}`,
          config
        );

        if (response.data.success) {
          toast.success(`${userEmail} has been rejected and removed.`);
          fetchData();
        } else {
          toast.error(response.data.message || "Rejection failed");
        }
      } catch (error) {
        console.error("Reject error:", error);
        toast.error(error.response?.data?.message || "Failed to reject user");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading attendee data...</p>
      </div>
    );
  }

  return (
    <div className="admin-attendee-page">
      <div className="attendee-banner">
        <div className="banner-left">
          <span className="banner-icon">👥</span>
          <div>
            <h1>Attendee Management</h1>
            <p>Manage requests and registered attendees</p>
          </div>
        </div>
        <div className="stats-badge">
          <span className="stat-item">📊 Attendees: {stats.totalAttendees}</span>
          <span className="stat-item">🏢 Exhibitors: {stats.totalExhibitors}</span>
          <span className="stat-item pending-stat">⏳ Pending: {stats.pendingCount}</span>
        </div>
      </div>

      {/* PENDING REQUESTS SECTION */}
      <div className="section-card">
        <h2> ⏳ Pending Approval Requests ({pendingRequests.length})</h2>
        {pendingRequests.length === 0 ? (
          <div className="empty-state">
            <p>✨ No pending requests!</p>
          </div>
        ) : (
          <div className="request-list">
            {pendingRequests.map((item) => (
              <div className="request-card" key={item._id}>
                <div className="request-info">
                  <h3>{item.name}</h3>
                  <small>📧 {item.email}</small>
                  <div>
                    <small>🎭 Role: {item.role === 'exhibitor' ? 'Exhibitor' : 'Attendee'}</small>
                  </div>
                  {item.company && <div><small>🏢 Company: {item.company}</small></div>}
                  {item.phone && <div><small>📞 Phone: {item.phone}</small></div>}
                  <div className="request-date">
                    <small>🕒 Registered: {new Date(item.createdAt).toLocaleDateString()}</small>
                  </div>
                </div>
                <div className="request-actions">
                  <button 
                    className="approve-btn"
                    onClick={() => handleApprove(item._id, item.email, item.role)}
                  >
                    ✅ Approve as {item.role === 'exhibitor' ? 'Exhibitor' : 'Attendee'}
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => handleReject(item._id, item.email)}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REGISTERED ATTENDEES TABLE */}
      <div className="section-card">
        <h2> ✅ Registered Attendees ({attendees.length})</h2>
        {attendees.length === 0 ? (
          <div className="empty-state">
            <p>No attendees registered yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <div className="table-header">
              <span>Name</span>
              <span>Email</span>
              <span>Phone</span>
              <span>Status</span>
            </div>
            {attendees.map((item) => (
              <div className="table-row" key={item._id}>
                <span>{item.name}</span>
                <span>{item.email}</span>
                <span>{item.phone || "—"}</span>
                <span>
                  <span className="status-badge approved"> Approved</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REGISTERED EXHIBITORS TABLE */}
      <div className="section-card">
        <h2> 🏢 Registered Exhibitors ({exhibitors.length})</h2>
        {exhibitors.length === 0 ? (
          <div className="empty-state">
            <p>No approved exhibitors yet.</p>
            <small>Exhibitors will appear here after admin approval.</small>
          </div>
        ) : (
          <div className="table-container">
            <div className="table-header">
              <span>Name</span>
              <span>Email</span>
              <span>Company</span>
              <span>Phone</span>
              <span>Status</span>
            </div>
            {exhibitors.map((item) => (
              <div className="table-row" key={item._id}>
                <span>{item.name}</span>
                <span>{item.email}</span>
                <span>{item.company || "—"}</span>
                <span>{item.phone || "—"}</span>
                <span>
                  <span className="status-badge approved"> Approved</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAttendeePage;