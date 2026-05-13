import { FaChartLine } from "react-icons/fa";

import "./AdminPayments.css";

const AdminPayment = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "$12,450",
      change: "+12.5%",
      icon: "💰",
      color: "#10b981",
    },
    {
      title: "Total Bookings",
      value: "540",
      change: "+8.2%",
      icon: "🎟️",
      color: "#3b82f6",
    },
    {
      title: "Pending Payments",
      value: "8",
      change: "-2.1%",
      icon: "⏳",
      color: "#f59e0b",
    },
    {
      title: "Successful Transactions",
      value: "320",
      change: "+15.8%",
      icon: "✅",
      color: "#10b981",
    },
    {
      title: "Refunded Amount",
      value: "$1,200",
      change: "+3.4%",
      icon: "↩️",
      color: "#ef4444",
    },
    {
      title: "Monthly Earnings",
      value: "$4,800",
      change: "+22.1%",
      icon: "📈",
      color: "#8b5cf6",
    },
  ];

  // Static data for charts
  const revenueData = [
    { month: "Jan", value: 40 },
    { month: "Feb", value: 70 },
    { month: "Mar", value: 55 },
    { month: "Apr", value: 90 },
    { month: "May", value: 60 },
    { month: "Jun", value: 110 },
  ];

  const topEvents = [
    { name: "🎵 Music Fest 2026", percent: 85, sales: 425 },
    { name: "💻 Tech Conference", percent: 70, sales: 350 },
    { name: "🍔 Food Carnival", percent: 60, sales: 300 },
  ];

  return (
    <div className="admin-payment-page">
      {/* Premium Banner */}
      <div className="payment-banner">
        <div className="banner-left">
          <div className="banner-emoji">💳</div>
          <div className="banner-text">
            <h1>Payment Dashboard</h1>
            <p>Real-time transaction monitoring & analytics</p>
          </div>
        </div>
        <div className="banner-right">
          <div className="today-revenue">
            <span className="revenue-value">$2,450</span>
            <span className="revenue-label">Today's Revenue</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((item, index) => (
          <div
            className="stat-card"
            key={index}
            style={{ "--card-color": item.color }}
          >
            <div className="stat-emoji">{item.icon}</div>
            <div className="stat-content">
              <h3>{item.title}</h3>
              <p>{item.value}</p>
              <span
                className={`change ${item.change.startsWith("+") ? "up" : "down"}`}
              >
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics */}
      <div className="analytics-section">
        <div className="section-header">
          <FaChartLine className="section-icon" />
          <div>
            <h2>Analytics Overview</h2>
            <span>Last 30 days • Updated 2 mins ago</span>
          </div>
        </div>

        <div className="analytics-grid">
          {/* Revenue Chart */}
          <div className="chart-card revenue-chart-card">
            <div className="chart-header">
              <h3>📈 Revenue by Month</h3>
              <span>+18.2% vs last month</span>
            </div>
            <div className="bar-chart">
              {revenueData.map((data, index) => (
                <div className="bar-container" key={index}>
                  <div
                    className="bar"
                    style={{
                      height: `${data.value * 2}px`,
                      background: `var(--gradient-${index % 3})`,
                    }}
                  >
                    <span>{data.value}</span>
                  </div>
                  <small>{data.month}</small>
                </div>
              ))}
            </div>
          </div>

          {/* Top Events */}
          <div className="chart-card events-card">
            <div className="chart-header">
              <h3>🔥 Top Events</h3>
              <span>By ticket sales</span>
            </div>
            {topEvents.map((event, index) => (
              <div className="event-item" key={index}>
                <div className="event-info">
                  <span>{event.name}</span>
                  <small>{event.sales} tickets</small>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${event.percent}%` }}
                  ></div>
                  <span>{event.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayment;
