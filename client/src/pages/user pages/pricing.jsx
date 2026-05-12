import { motion } from "framer-motion";
import "./pricing.css";

export default function Pricing() {
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
    },
  ];

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

            <button link="/signup">Choose Plan</button>
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
    />
  </div>

  <button link="/signup">Get Started Free</button>
</motion.div>

    </div>
  );
}