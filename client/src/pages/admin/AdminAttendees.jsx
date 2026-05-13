import "./AdminAttendees.css";

const AdminAttendeePage = () => {
  const requests = [
    { name: "Ali Khan", event: "Web Dev Bootcamp", email: "ali@gmail.com" },
    { name: "Sara Ahmed", event: "AI Summit", email: "sara@gmail.com" },
    {
      name: "Usman Tariq",
      event: "React Conference",
      email: "usman@gmail.com",
    },
    { name: "Hina Malik", event: "Design Expo", email: "hina@gmail.com" },
  ];

  const attendees = [
    {
      name: "Usman Ali",
      event: "React Workshop",
      email: "usman@gmail.com",
      location: "Karachi",
      status: "Approved",
    },
    {
      name: "Hina Malik",
      event: "Design Conference",
      email: "hina@gmail.com",
      location: "Lahore",
      status: "Approved",
    },
    {
      name: "Zain Raza",
      event: "Startup Meetup",
      email: "zain@gmail.com",
      location: "Islamabad",
      status: "Pending",
    },
    {
      name: "Ayesha Noor",
      event: "Cyber Security",
      email: "ayesha@gmail.com",
      location: "Karachi",
      status: "Approved",
    },
    {
      name: "Bilal Hassan",
      event: "Cloud Summit",
      email: "bilal@gmail.com",
      location: "Peshawar",
      status: "Approved",
    },
    {
      name: "Sana Iqbal",
      event: "AI Workshop",
      email: "sana@gmail.com",
      location: "Quetta",
      status: "Pending",
    },
  ];

  return (
    <div className="admin-attendee-page">
      {/* BANNER */}
      <div className="attendee-banner">
        <div className="banner-left">
          <span className="banner-icon">👥</span>
          <div>
            <h1>Attendee Management</h1>
            <p>Manage requests and registered attendees</p>
          </div>
        </div>
      </div>

      {/* REQUESTS */}
      <div className="section-card">
        <h2> ⏳ Pending Requests</h2>

        <div className="request-list">
          {requests.map((item, index) => (
            <div className="request-card" key={index}>
              <div>
                <h3>{item.name}</h3>
                <small>{item.event}</small>
                <br />
                <small>{item.email}</small>
              </div>

              <div className="request-actions">
                <button className="approve-btn">Approve</button>
                <button className="reject-btn">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ATTENDEES TABLE */}
      <div className="section-card">
        <h2> ✅ Registered Attendees</h2>

        <div className="table">
          <div className="table-header">
            <span>Name</span>
            <span>Event</span>
            <span>Email</span>
            <span>Location</span>
            <span>Status</span>
          </div>

          {attendees.map((item, index) => (
            <div className="table-row" key={index}>
              <span>{item.name}</span>
              <span>{item.event}</span>
              <span>{item.email}</span>
              <span>{item.location}</span>
              <span className={item.status.toLowerCase()}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAttendeePage;
