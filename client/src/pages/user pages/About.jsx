import { motion, useScroll, useTransform } from "framer-motion";
import "./about.css";

export default function About() {

  // ✅ Scroll-based parallax
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 300], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.6]);

  // 🎯 EventSphere TEAM (REALISTIC ROLES)
  const team = [
    {
      name: "Expo Coordinator",
      role: "Manages exhibitions & large-scale events",
      img: "src/assets/ExpoCordinator-img.jpeg",
    },
    {
      name: "Event Operations Lead",
      role: "Handles venue setup & logistics flow",
      img: "src/assets/EventOrg-img.jpeg",
    },
    {
      name: "Marketing Strategist",
      role: "Promotes events & increases engagement",
      img: "src/assets/Marketing-img.jpeg",
    },
  ];

  return (
    <div className="about-wrapper">

      {/* 🌌 BACKGROUND EFFECTS */}
      <div className="particles"></div>
      <div className="bg-glow"></div>

      <div className="about-page">

        {/* HERO */}
       <motion.section
  className="hero hero-split"
  style={{ y: heroY, opacity: heroOpacity }}
>
  {/* LEFT CONTENT */}
  <div className="hero-text">
    <h1>
      About <span>EventSphere</span>
    </h1>
    <p>
      A powerful event management platform for expos, conferences, and large-scale experiences.
    </p>
   <h2 className="auto-text">
  <span>
    Smart Event Management • Expo Control • Real-Time Analytics
  </span>
</h2>
  </div>

  {/* RIGHT IMAGE */}
  <motion.div
    className="hero-image"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
  >
    <img
src="src/assets/about-img.jpeg"/>
  </motion.div>
</motion.section>

        {/* WHO WE ARE */}
        <motion.section
          className="glass section"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Who We Are</h2>
          <p>
            EventSphere is a modern platform designed to simplify event planning,
            coordination, and execution for organizers and exhibitors worldwide.
          </p>
        </motion.section>

        {/* FEATURES */}
        <div className="card-grid">
          {[
            "Smart Event Management",
            "Real-time Attendee Tracking",
            "Secure Registration System",
          ].map((item, i) => (
            <motion.div
              key={i}
              className="card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <h3>{item}</h3>
              <p>Designed for modern large-scale event experiences.</p>
            </motion.div>
          ))}
        </div>

        {/* BANNER */}
        <motion.div
          className="banner"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <h2>Built for Modern Events 🚀</h2>
        </motion.div>

        {/* TEAM SECTION */}
        <div className="team-section">

        <h2 className="team-title">
  Meet Our <span className="underline">Team</span>
</h2>

          <div className="team-grid">

            {team.map((member, i) => (
              <motion.div
                key={i}
                className="team-card"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  rotateX: 12,
                  rotateY: -12,
                  scale: 1.05,
                }}
              >
                <img src={member.img} alt={member.name} />
                <h3>{member.name}</h3>
                <p>{member.role}</p>

                <div className="socials">
                  <a href="#">📅</a>
                  <a href="#">📍</a>
                </div>
              </motion.div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}