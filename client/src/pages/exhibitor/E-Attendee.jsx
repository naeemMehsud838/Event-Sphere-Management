import "./E-Attendee.css";

const attendees = [
  {
    id: 1,
    name: "Ali Raza",
    email: "ali@example.com",
    event: "Tech Expo 2026",
    status: "Registered",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Sara Khan",
    email: "sara@example.com",
    event: "Startup Summit",
    status: "Checked In",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Hassan Ali",
    email: "hassan@example.com",
    event: "AI Conference",
    status: "Registered",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    id: 4,
    name: "Ayesha Noor",
    email: "ayesha@example.com",
    event: "Business Expo",
    status: "Pending",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

export default function Attendees() {
  return (
    <div className="attendees-wrapper">
      <h1 className="title">Event Attendees</h1>

      <div className="attendees-grid">
        {attendees.map((a) => (
          <div className="attendee-card" key={a.id}>
            <img src={a.image} alt={a.name} />

            <div className="info">
              <h2>{a.name}</h2>
              <p>{a.email}</p>
              <p className="event">🎟 {a.event}</p>

              <span className={`status ${a.status.toLowerCase()}`}>
                {a.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}