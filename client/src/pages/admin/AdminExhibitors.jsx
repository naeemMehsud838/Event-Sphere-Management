import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AdminExhibitors.css";

export default function ExhibitorAdmin() {
  const [exhibitors, setExhibitors] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeUser, setActiveUser] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [stats, setStats] = useState({
    totalExhibitors: 0,
    activeEvents: 0,
    pendingRequests: 0,
    revenue: 12450
  });

  // ✅ Fetch exhibitors and pending count
  const fetchExhibitors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const response = await axios.get("http://localhost:1000/api/users/all", config);
      
      console.log("All users from backend:", response.data);
      
      if (response.data.success) {
        const allUsers = response.data.users || [];
        
        // Filter exhibitors
        const exhibitorsList = allUsers.filter(user => user.role === 'exhibitor');
        setExhibitors(exhibitorsList);
        
        // 🔥 Count pending exhibitors (status = 'pending')
        const pendingExhibitors = exhibitorsList.filter(user => user.status === 'pending');
        const pendingRequestsCount = pendingExhibitors.length;
        setPendingCount(pendingRequestsCount);
        
        // Update stats
        setStats({
          totalExhibitors: exhibitorsList.length,
          activeEvents: totalEvents,
          pendingRequests: pendingRequestsCount,
          revenue: 12450
        });
        
        console.log(`✅ Total Exhibitors: ${exhibitorsList.length}`);
        console.log(`✅ Pending Requests: ${pendingRequestsCount}`);
      }
      
    } catch (error) {
      console.error("Fetch exhibitors error:", error);
      toast.error("Failed to load exhibitors");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch events count
  const fetchEventsCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const response = await axios.get("http://localhost:1000/api/admin/dashboard", config);
      
      console.log("Dashboard Response:", response.data);
      
      if (response.data.success) {
        const eventsCount = response.data.stats?.totalEvents || 0;
        setTotalEvents(eventsCount);
        setStats(prev => ({
          ...prev,
          activeEvents: eventsCount
        }));
        console.log(`✅ Total Events: ${eventsCount}`);
      }
    } catch (error) {
      console.error("Fetch events error:", error);
      setTotalEvents(0);
    }
  };

  // ✅ Approve exhibitor
  const handleApprove = async (userId, userEmail, userName) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.put(
        `http://localhost:1000/api/users/approve-user/${userId}`,
        { 
          isApproved: true, 
          status: "approved",
          role: "exhibitor"
        },
        config
      );

      if (response.data.success) {
        toast.success(`${userName} approved as Exhibitor!`);
        fetchExhibitors(); // Refresh data
      } else {
        toast.error(response.data.message || "Approval failed");
      }
    } catch (error) {
      console.error("Approve error:", error);
      toast.error(error.response?.data?.message || "Failed to approve user");
    }
  };

  // ✅ Reject exhibitor
  const handleReject = async (userId, userEmail, userName) => {
    if (window.confirm(`Are you sure you want to reject ${userName}?`)) {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const response = await axios.delete(
          `http://localhost:1000/api/users/reject-user/${userId}`,
          config
        );

        if (response.data.success) {
          toast.success(`${userName} has been rejected and removed.`);
          fetchExhibitors(); // Refresh data
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
    fetchExhibitors();
    fetchEventsCount();
  }, []);

  if (loading) {
    return (
      <div className="exh-page">
        <header className="exh-header">
          <h1 className="exh-title">🎪 Exhibitor Management</h1>
          <p className="exh-subtitle">Loading exhibitors data...</p>
        </header>
      </div>
    );
  }

  return (
    <div className="exh-page">
      {/* HEADER */}
      <header className="exh-header">
        <h1 className="exh-title">🎪 Exhibitor Management</h1>
        <p className="exh-subtitle">
          📊 Manage all exhibitors in a structured table view
        </p>
      </header>

      {/* STATS */}
      <section className="exh-stats">
        <div className="exh-stat-box">
          <span>👥 Total Exhibitors</span>
          <h2>{stats.totalExhibitors}</h2>
        </div>

        <div className="exh-stat-box">
          <span>📅 Total Events</span>
          <h2>{stats.activeEvents}</h2>
        </div>

        <div className="exh-stat-box">
          <span>⏳ Pending Requests</span>
          <h2 style={{ color: stats.pendingRequests > 0 ? "#ffa500" : "#4caf50" }}>
            {stats.pendingRequests}
          </h2>
        </div>

        <div className="exh-stat-box">
          <span>💰 Revenue</span>
          <h2>${stats.revenue.toLocaleString()}</h2>
        </div>
      </section>

      {/* PENDING REQUESTS SECTION */}
      {stats.pendingRequests > 0 && (
        <section className="exh-table-wrapper pending-section">
          <h3 style={{ marginBottom: "15px", color: "#ffa500" }}>
            ⏳ Pending Approval Requests ({stats.pendingRequests})
          </h3>
          <table className="exh-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Phone</th>
                <th>Registered</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {exhibitors.filter(e => e.status === 'pending').map((user, index) => (
                <tr key={user._id} style={{ background: "rgba(255, 165, 0, 0.1)" }}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.company || "-"}</td>
                  <td>{user.phone || "-"}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="exh-btn approve"
                      onClick={() => handleApprove(user._id, user.email, user.name)}
                    >
                      ✅ Approve
                    </button>
                    <button
                      className="exh-btn reject"
                      onClick={() => handleReject(user._id, user.email, user.name)}
                      style={{ marginLeft: "8px", background: "#dc3545" }}
                    >
                      ❌ Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* ALL EXHIBITORS TABLE */}
      <section className="exh-table-wrapper">
        <h3 style={{ marginBottom: "15px" }}>📋 All Exhibitors</h3>
        <table className="exh-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {exhibitors.length > 0 ? (
              exhibitors.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.company || "-"}</td>
                  <td>
                    <span className={`status-badge ${user.status === 'pending' ? 'pending' : 'approved'}`}>
                      {user.status === 'pending' ? '⏳ Pending' : '✅ Approved'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="exh-btn view"
                      onClick={() => setActiveUser(user)}
                    >
                      View
                    </button>
                    {user.status === 'pending' && (
                      <>
                        <button
                          className="exh-btn approve"
                          onClick={() => handleApprove(user._id, user.email, user.name)}
                          style={{ marginLeft: "8px", background: "#28a745" }}
                        >
                          Approve
                        </button>
                        <button
                          className="exh-btn reject"
                          onClick={() => handleReject(user._id, user.email, user.name)}
                          style={{ marginLeft: "8px", background: "#dc3545" }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>
                  No exhibitors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* MODAL */}
      {activeUser && (
        <div className="exh-modal" onClick={() => setActiveUser(null)}>
          <div className="exh-modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Exhibitor Profile</h2>
            <div className="exh-modal-content">
              <p><b>Name:</b> {activeUser.name}</p>
              <p><b>Email:</b> {activeUser.email}</p>
              <p><b>Company:</b> {activeUser.company || "-"}</p>
              <p><b>Phone:</b> {activeUser.phone || "-"}</p>
              <p><b>Status:</b> {activeUser.status === 'pending' ? '⏳ Pending' : '✅ Approved'}</p>
              <p><b>Registered:</b> {new Date(activeUser.createdAt).toLocaleDateString()}</p>
            </div>
            <button className="exh-btn" onClick={() => setActiveUser(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}