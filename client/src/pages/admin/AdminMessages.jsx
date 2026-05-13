import "./AdminMessages.css";
import {
  FaTools,
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillWave,
  FaShieldAlt,
  FaTrash, // DELETE ICON
} from "react-icons/fa";

const messages = {
  system: [
    {
      type: "Maintenance",
      text: "Site will be down for 2 hours on May 15 (2AM - 4AM PST)",
      meta: "EventSphere System",
    },
    {
      type: "Feature",
      text: "Ticket scanning feature has been added successfully",
      meta: "EventSphere Update",
    },
  ],
  events: [
    {
      type: "Approved",
      text: "Your event 'Tech Meetup 2026' is now live",
      meta: "Event ID: 2045",
    },
    {
      type: "Cancelled",
      text: "'Startup Expo 2026' has been cancelled by organizer",
      meta: "Event ID: 1982",
    },
  ],
  users: [
    {
      type: "Report",
      text: "User Ali Khan reported a payment issue",
      meta: "Event ID: 2041",
    },
    {
      type: "New Event",
      text: "A new event 'AI Summit' was created",
      meta: "User: Admin Panel",
    },
  ],
  payments: [
    {
      type: "Refund",
      text: "Refund of $25 processed successfully",
      meta: "Order #8891",
    },
    {
      type: "Payment",
      text: "Payment failed for Event Ticket purchase",
      meta: "Order #7720",
    },
  ],
  security: [
    {
      type: "Warning",
      text: "15 failed login attempts detected",
      meta: "IP: 103.45.xxx.xxx",
    },
    {
      type: "System",
      text: "API response delay detected in server cluster",
      meta: "Monitoring System",
    },
  ],
};

const Section = ({ title, icon, data, onDelete }) => (
  <>
    <div className="section-title">
      {icon} {title}
    </div>

    {data.map((msg) => (
      <div className="card" key={msg.id}>
        <div className="card-header">
          <span className="badge">{msg.type}</span>
        </div>

        <div className="card-content">{msg.text}</div>
        <div className="card-footer">
          <small>{msg.meta}</small>
          <button className="remove-btn" onClick={() => onDelete(msg.id)}>
            <FaTrash />
          </button>
        </div>
      </div>
    ))}
  </>
);

const AdminMessages = () => {
  const handleDelete = (id) => {
    console.log("Delete message:", id);
    // Add delete logic here
  };

  return (
    <div className="container">
      <div className="header">📩 EventSphere Admin Messages</div>

      <Section
        title="System Announcements"
        icon={<FaTools />}
        data={messages.system}
        onDelete={handleDelete}
      />
      <Section
        title="Event Alerts"
        icon={<FaCalendarAlt />}
        data={messages.events}
        onDelete={handleDelete}
      />
      <Section
        title="User Activity Notifications"
        icon={<FaUsers />}
        data={messages.users}
        onDelete={handleDelete}
      />
      <Section
        title="Payments & Transactions"
        icon={<FaMoneyBillWave />}
        data={messages.payments}
        onDelete={handleDelete}
      />
      <Section
        title="Security & System Warnings"
        icon={<FaShieldAlt />}
        data={messages.security}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminMessages;
