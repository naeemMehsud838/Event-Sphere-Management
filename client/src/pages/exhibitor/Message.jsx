import "./Message.css";

const messages = [
  {
    id: 1,
    name: "Admin",
    text: "Your booth has been approved 🎉",
    time: "2 min ago",
  },
  {
    id: 2,
    name: "Support Team",
    text: "Need help setting up your booth?",
    time: "1 hour ago",
  },
  {
    id: 3,
    name: "Event System",
    text: "New visitor joined your booth 🚀",
    time: "Yesterday",
  },
];

export default function Message() {
  return (
    <div className="message-page">

      {/* HEADER */}
      <div className="message-header">
        <h1>💬 Messages</h1>
        <p>Stay updated with your booth activity</p>
      </div>

      {/* MESSAGE LIST */}
      <div className="message-list">

        {messages.map((msg) => (
          <div key={msg.id} className="message-card">

            <div className="msg-avatar">
              {msg.name.charAt(0)}
            </div>

            <div className="msg-content">
              <h3>{msg.name}</h3>
              <p>{msg.text}</p>
            </div>

            <span className="msg-time">{msg.time}</span>

          </div>
        ))}

      </div>

    </div>
  );
}