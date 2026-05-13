import "./AdminProfile.css";

const AdminProfile = () => {
  const admin = {
    name: "Umaima Ijaz",
    role: "Event Admin",
    email: "umaimaijaz@gmail.com",
    phone: "+92 300 1234567",
    company: "Eventify Pvt Ltd",
    location: "Karachi, Pakistan",
  };

  // ✅ GET INITIALS
  const initials = admin.name
    .split(" ")
    .map((word) => word[0])
    .join("");

  return (
    <div className="adminProfileWrapper">
      <div className="adminProfileCard">
        {/* TOP SECTION */}
        <div className="adminProfileTop">
          {/* AVATAR */}
          <div className="adminProfileAvatar">{initials}</div>

          {/* NAME */}
          <h1 className="adminProfileName">{admin.name}</h1>

          {/* ROLE */}
          <p className="adminProfileRole">{admin.role}</p>
        </div>

        {/* INFO AREA */}
        <div className="adminProfileInfoArea">
          {/* NAME INFO */}
          <div className="adminInfoBox">
            <label className="adminInfoLabel">Name</label>
            <p className="adminInfoValue">{admin.name}</p>
          </div>

          {/* EMAIL INFO */}
          <div className="adminInfoBox">
            <label className="adminInfoLabel">Email</label>
            <p className="adminInfoValue">{admin.email}</p>
          </div>

          {/* PHONE INFO */}
          <div className="adminInfoBox">
            <label className="adminInfoLabel">Phone</label>
            <p className="adminInfoValue">{admin.phone}</p>
          </div>

          {/* COMPANY INFO */}
          <div className="adminInfoBox">
            <label className="adminInfoLabel">Company</label>
            <p className="adminInfoValue">{admin.company}</p>
          </div>

          {/* LOCATION INFO */}
          <div className="adminInfoBox">
            <label className="adminInfoLabel">Location</label>
            <p className="adminInfoValue">{admin.location}</p>
          </div>
        </div>

        {/* EDIT BUTTON */}
        <button className="adminEditButton">✏️ Edit Profile</button>
      </div>
    </div>
  );
};

export default AdminProfile;
