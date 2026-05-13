import { useState } from "react";
import "./AdminExhibitors.css";

const exhibitorsData = [
  { id: 1, name: "Ali Khan", email: "ali@gmail.com", company: "TechNova" },
  { id: 2, name: "Sara Ahmed", email: "sara@gmail.com", company: "Eventify" },
  {
    id: 3,
    name: "Usman Tariq",
    email: "usman@gmail.com",
    company: "BrightMedia",
  },
  {
    id: 4,
    name: "Ayesha Noor",
    email: "ayesha@gmail.com",
    company: "DesignHub",
  },
  { id: 5, name: "Hassan Ali", email: "hassan@gmail.com", company: "SoftCore" },
  {
    id: 6,
    name: "Fatima Zia",
    email: "fatima@gmail.com",
    company: "MarketPro",
  },
  { id: 7, name: "Bilal Shah", email: "bilal@gmail.com", company: "NextGen" },
];

export default function ExhibitorAdmin() {
  const [activeUser, setActiveUser] = useState(null);

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
          <h2>7</h2>
        </div>

        <div className="exh-stat-box">
          <span>📅 Active Events</span>
          <h2>3</h2>
        </div>

        <div className="exh-stat-box">
          <span>⏳ Pending Requests</span>
          <h2>5</h2>
        </div>

        <div className="exh-stat-box">
          <span>💰 Revenue</span>
          <h2>$24K</h2>
        </div>
      </section>
      {/* TABLE */}
      <section className="exh-table-wrapper">
        <table className="exh-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {exhibitorsData.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.company}</td>
                <td>
                  <button
                    className="exh-btn"
                    onClick={() => setActiveUser(user)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* MODAL */}
      {activeUser && (
        <div className="exh-modal" onClick={() => setActiveUser(null)}>
          <div className="exh-modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Exhibitor Profile</h2>

            <div className="exh-modal-content">
              <p>
                <b>Name:</b> {activeUser.name}
              </p>
              <p>
                <b>Email:</b> {activeUser.email}
              </p>
              <p>
                <b>Company:</b> {activeUser.company}
              </p>
            </div>

            <button onClick={() => setActiveUser(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
