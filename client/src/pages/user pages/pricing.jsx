import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./pricing.css";

export default function Pricing() {
  const navigate = useNavigate();
  
  // ✅ Get user role from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = storedUser?.role;
  const isLoggedIn = !!storedUser?.token || !!localStorage.getItem("token");

  const plans = [
    {
      name: "Starter Event",
      price: "$0",
      desc: "Perfect for small meetups & trials",
      features: [
        "1 Active Event",
        "Basic Dashboard",
        "Email Support",
      ],
      role: "all"
    },
    {
      name: "Professional Events",
      price: "$19",
      desc: "For organizers managing real events",
      features: [
        "Unlimited Events",
        "Live Attendee Tracking",
        "Advanced Analytics",
      ],
      popular: true,
      role: "all"
    },
    {
      name: "Enterprise Scale",
      price: "$49",
      desc: "For expos, conferences & large venues",
      features: [
        "Multi-event system",
        "Custom branding",
        "Dedicated support",
      ],
      role: "exhibitor"
    },
  ];

  // ✅ Handle Choose Plan button - Always go to Register
  const handleChoosePlan = () => {
    navigate("/register");
  };

  // ✅ Handle Get Started button - Always go to Register
  const handleGetStarted = () => {
    navigate("/register");
  };

  return (
    <div className="pricing-wrapper">

      {/* HERO SECTION */}
      <motion.div
        className="pricing-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>
          Simple Pricing for <span>Powerful Events</span>
        </h1>
        <p>
          Whether you're hosting a small meetup or a large expo,
          EventSphere scales with you.
        </p>
      </motion.div>

      {/* PLANS */}
      <div className="pricing-cards">

        {plans.map((plan, i) => (
          <motion.div
            key={i}
            className={`pricing-card ${plan.popular ? "popular" : ""}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            whileHover={{ scale: 1.03 }}
          >

            {plan.popular && <div className="badge">Most Popular</div>}

            <h2>{plan.name}</h2>
            <h3>{plan.price}<span>/mo</span></h3>
            <p>{plan.desc}</p>

            <ul>
              {plan.features.map((f, idx) => (
                <li key={idx}>✔ {f}</li>
              ))}
            </ul>

            {/* ✅ Choose Plan button - Always navigates to Register */}
            <button onClick={handleChoosePlan}>
              Choose Plan
            </button>
          </motion.div>
        ))}
      </div>

      {/* BENEFITS SECTION */}
      <motion.div
        className="pricing-benefits"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2>Why EventSphere?</h2>

        <div className="benefit-grid">

          <div className="benefit">
            🎯 Built for Real Events
            <p>From meetups to expos, everything is supported.</p>
          </div>

          <div className="benefit">
            ⚡ Real-Time Control
            <p>Track attendees, sessions & performance live.</p>
          </div>

          <div className="benefit">
            🔐 Secure & Scalable
            <p>Enterprise-grade security for all event data.</p>
          </div>

        </div>
      </motion.div>

      {/* FINAL CTA */}
      <motion.div
        className="pricing-cta"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2>Ready to Host Your Next Event?</h2>
        <p>Start with EventSphere today — no complexity, just results.</p>

        {/* IMAGE ADDED */}
        <div className="cta-image">
          <img
            src="src/assets/pricing-img.jpeg"
            alt="EventSphere Event"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/800x400?text=EventSphere";
            }}
          />
        </div>

        {/* ✅ Get Started button - Always navigates to Register */}
        <button onClick={handleGetStarted}>
          Get Started Free
        </button>
      </motion.div>

      {/* ✅ Show Create Event prompt for logged in exhibitors/admins */}
      {isLoggedIn && (userRole === "admin" || userRole === "exhibitor") && (
        <motion.div
          className="create-event-prompt"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* <div className="prompt-card">
            <span>🎉</span>
            <div>
              <h3>Ready to create your first event?</h3>
              <p>As an {userRole === "admin" ? "Admin" : "Exhibitor"}, you can start creating events right away!</p>
            </div>
            <button onClick={() => navigate("/create-event")}>
              + Create New Event
            </button> */}
          {/* </div> */}
        </motion.div>
      )}

      {/* ✅ Login prompt for non-logged in users */}
      {!isLoggedIn && (
        <motion.div
          className="login-prompt"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="prompt-card login-card">
            <span>🔐</span>
            <div>
              <h3>Already have an account?</h3>
              <p>Sign in to access your dashboard and start managing events.</p>
            </div>
            <button onClick={() => navigate("/login")}>
              Login Now
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}