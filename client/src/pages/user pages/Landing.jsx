import { Link } from "react-router-dom";
import "./Landing.css";
import Landingimg1 from "../../assets/landingimg1.jpg";
import featuredEvents1 from "../../assets/featuredEvents1.jpeg";
import featuredEvents2 from "../../assets/featuredEvents2.jpeg";
import featuredEvents3 from "../../assets/featuredEvents3.jpeg";
import yourRole1 from "../../assets/yourRole1.jpg";
import yourRole2 from "../../assets/yourRole2.jpg";
import yourRole3 from "../../assets/yourRole3.jpg";

/* ─── ALL STATIC DATA ─────────────────────────────────────── */
const DATA = {
  hero: {
    title: "Where great Events begin.",
    subtitle:
      "Manage exhibitors, attendees, and sessions in one powerful platform.",
    featuredEvent: {
      name: "Global Tech Event",
      attendees: "2,400",
      exhibitors: "84",
    },
  },
  features: [
    {
      icon: "🎪",
      title: "Events Management",
      desc: "Create, configure, and launch world-class expos in minutes. Full control over halls, booths, sessions, and scheduling from one unified dashboard.",
    },
    {
      icon: "🏢",
      title: "Exhibitor Portal",
      desc: "Seamless booth selection, approval workflows, lead capture, and profile management. Give every exhibitor a branded self-service workspace.",
    },
    {
      icon: "👥",
      title: "Attendee Experience",
      desc: "Smart booking, QR check-in, personalized agendas, real-time session updates, and post-event certificates — all in one place.",
    },
    {
      icon: "💳",
      title: "Payments & Billing",
      desc: "Accept registrations, exhibitor fees, and sponsorships via Stripe. Multi-currency, auto-invoicing, and instant refunds built in.",
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      desc: "Live foot-traffic heatmaps, session drop-off curves, revenue charts, and exportable sponsor reports — turn every event into data.",
    },
    {
      icon: "🎤",
      title: "Session Manager",
      desc: "Schedule keynotes, panels, and workshops with speaker bios, live streaming links, capacity controls, and automated attendee reminders.",
    },
  ],
  stats: [
    { value: "12K+", label: "Events Hosted" },
    { value: "4.8M", label: "Total Attendees" },
    { value: "99.97%", label: "Uptime SLA" },
    { value: "4.9★", label: "User Rating" },
  ],
  liveEvents: [
    "AI Summit 2026 — Dubai 🔴 Live",
    "Startup Event Karachi — Day 2 🔴 Live",
    "Web Dev Conference — Upcoming 🟡",
    "Global Tech Meetup — London 🔴 Live",
    "HealthTech Forum — Singapore 🔴 Live",
    "EduTech Asia — Upcoming 🟡",
    "Blockchain Event — Berlin 🔴 Live",
    "Pakistan Auto Show 2026 — Upcoming 🟡",
  ],
  testimonials: [
    {
      name: "Sarah Khan",
      role: "Event Organizer",
      rating: 5,
      avatar: "👩‍💼",
      text: "EventSphere transformed our expo management completely. Setup went from 3 months to under 2 weeks. The exhibitor dashboard alone saved 400 hours of coordination.",
    },
    {
      name: "Ahmed Raza",
      role: "Tech Exhibitor",
      rating: 5,
      avatar: "👨‍💼",
      text: "Booth selection was seamless and the lead capture tools are incredible. We got 3x more qualified leads than the previous year's expo.",
    },
    {
      name: "Aisha Malik",
      role: "Attendee",
      rating: 5,
      avatar: "👩",
      text: "Best event app I've ever used. Easy booking, real-time session updates, and the QR check-in was completely frictionless on the day. Loved it!",
    },
  ],
  organizers: [
    { name: "TechFest Global", events: "47", image: "🎯" },
    { name: "InnoVibe Events", events: "23", image: "🚀" },
    { name: "FutureX Conferences", events: "89", image: "⭐" },
    { name: "Global Summit Co.", events: "156", image: "🌍" },
  ],
  howToStart: [
    {
      step: "1",
      title: "Create Event",
      desc: "Setup your event structure, branding, and halls in under an hour.",
    },
    {
      step: "2",
      title: "Invite Exhibitors",
      desc: "Send branded invites with a self-service booth selection portal.",
    },
    {
      step: "3",
      title: "Sell Tickets",
      desc: "Accept payments, issue QR badges, and manage capacity automatically.",
    },
    {
      step: "4",
      title: "Go Live",
      desc: "Monitor check-ins, foot traffic, and revenue in real time.",
    },
  ],
  everythingIncluded: {
    title: "Everything Included, Zero Compromise",
    subtitle:
      "Unlimited events, exhibitors, attendees, and 24/7 support — all in one plan.",
    features: [
      "✅ Unlimited Events",
      "✅ Unlimited Attendees",
      "✅ Custom Branding",
      "✅ Live Support 24/7",
      "✅ Advanced Analytics",
      "✅ Mobile App Access",
    ],
    image: Landingimg1,
  },
  featuredEvents: [
    {
      name: "AI & Robotics Event 2026",
      date: "Jan 15–17",
      location: "Dubai, UAE",
      attendees: "5,200+",
      emoji: "🤖",
      image: featuredEvents1,
    },
    {
      name: "Future Mobility Summit",
      date: "Mar 22–24",
      location: "London, UK",
      attendees: "3,800+",
      emoji: "🚗",
      image: featuredEvents2,
    },
    {
      name: "Digital Health Conference",
      date: "Jun 10–12",
      location: "Singapore",
      attendees: "4,100+",
      emoji: "🏥",
      image: featuredEvents3,
    },
  ],
  yourRole: [
    {
      title: "Event Organizers",
      desc: "Create, manage, and scale events effortlessly with our end-to-end platform.",
      image: yourRole1,
    },
    {
      title: "Exhibitors",
      desc: "Find the perfect booth, manage your profile, and connect with qualified attendees.",
      image: yourRole2,
    },
    {
      title: "Attendees",
      desc: "Discover world-class events, book sessions, and get a seamless day-of experience.",
      image: yourRole3,
    },
  ],
};

/* ════════════════════════════════════════════════════════════ */
export default function Landing() {
  return (
    <>
      {/* ── ANIMATED BG ── */}
      <div className="lp-bg">
        <div className="lp-orb lp-orb-1" />
        <div className="lp-orb lp-orb-2" />
        <div className="lp-orb lp-orb-3" />
      </div>

      <div className="lp-wrap">
        {/* ══ HERO ══════════════════════════════════════════ */}
        <section className="lp-hero">
          <div>
            <div className="lp-hero-badge">
              <span className="lp-pulse" />
              <span>The Future of Events Management</span>
            </div>
            <h1 className="lp-hero-title">{DATA.hero.title}</h1>
            <p className="lp-hero-sub">{DATA.hero.subtitle}</p>
            <div className="lp-hero-btns">
              <Link to="/register" className="lp-btn lp-btn-primary">
                Start Free →
              </Link>
              <Link to="/events" className="lp-btn lp-btn-outline">
                Browse Events
              </Link>
            </div>
          </div>
          <div className="lp-hero-card">
            <h3>{DATA.hero.featuredEvent.name}</h3>
            <div className="lp-expo-meta">
              <div className="lp-expo-meta-item">
                <span style={{ fontSize: 22 }}>👥</span>
                <span>{DATA.hero.featuredEvent.attendees} attendees</span>
              </div>
              <div className="lp-expo-meta-item">
                <span style={{ fontSize: 22 }}>🏢</span>
                <span>{DATA.hero.featuredEvent.exhibitors} exhibitors</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══ LIVE TICKER ═══════════════════════════════════ */}
        <div className="lp-ticker">
          <div className="lp-ticker-track">
            {[...DATA.liveEvents, ...DATA.liveEvents].map((item, i) => (
              <div key={i} className="lp-ticker-item">
                <span className="lp-live-badge">LIVE</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══ STATS ═════════════════════════════════════════ */}
        <div className="lp-stats">
          {DATA.stats.map((s, i) => (
            <div key={i} className="lp-stat-card">
              <div className="lp-stat-val">{s.value}</div>
              <div className="lp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ══ FEATURES ══════════════════════════════════════ */}
        <div className="lp-sec-head">
          <h2 className="lp-sec-title">Everything You Need</h2>
          <p className="lp-sec-sub">
            A complete platform for organizers, exhibitors, and attendees
          </p>
        </div>
        <div className="lp-feat-grid">
          {DATA.features.map((f, i) => (
            <div key={i} className="lp-feat-card">
              <span className="lp-feat-icon">{f.icon}</span>
              <h3 className="lp-feat-title">{f.title}</h3>
              <p className="lp-feat-desc">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* ══ EVERYTHING INCLUDED ═══════════════════════════ */}
        <div className="lp-everything">
          <div className="lp-ev-content">
            <h2 className="lp-ev-title">{DATA.everythingIncluded.title}</h2>
            <p className="lp-ev-sub">{DATA.everythingIncluded.subtitle}</p>
            <ul className="lp-feat-list">
              {DATA.everythingIncluded.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
          <div className="lp-ev-img-wrap">
            <div className="lp-ev-img">
              <img
                src={DATA.everythingIncluded.image}
                alt="Everything Included"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* ══ FEATURED EVENTS ═══════════════════════════════ */}
        <div className="lp-sec-head">
          <h2 className="lp-sec-title">Featured Events</h2>
          <p className="lp-sec-sub">Join thousands at these upcoming events</p>
        </div>

        <div className="lp-events-grid">
          {DATA.featuredEvents.map((ev, i) => (
            <div key={i} className="lp-event-card">
              <div className="lp-event-img">
                <img src={ev.image} alt={ev.name} loading="lazy" />
                <span className="lp-event-emoji">{ev.emoji}</span>
              </div>
              <div className="lp-event-body">
                <h3 className="lp-event-name">{ev.name}</h3>
                <div className="lp-event-meta">
                  <span>{ev.date}</span>
                  <span>•</span>
                  <span>{ev.location}</span>
                </div>
                <div className="lp-event-att">{ev.attendees} attendees</div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ CENTER BUTTON */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "60px",
          }}
        >
          <Link to="/events" className="see-all-btn">
            <span>See All Events</span>
            <span className="arrow">→</span>
          </Link>
        </div>

        {/* ══ TESTIMONIALS ══════════════════════════════════ */}
        <div className="lp-sec-head">
          <h2 className="lp-sec-title">What Organizers Say</h2>
          <p className="lp-sec-sub">Join 12K+ organizers who trust us</p>
        </div>
        <div className="lp-testi-grid">
          {DATA.testimonials.map((t, i) => (
            <div key={i} className="lp-testi-card">
              <span className="lp-testi-av">{t.avatar}</span>
              <div className="lp-stars">{"★".repeat(t.rating)}</div>
              <p className="lp-testi-text">{t.text}</p>
              <div className="lp-testi-name">{t.name}</div>
              <div className="lp-testi-role">{t.role}</div>
            </div>
          ))}
        </div>

        {/* ══ TOP ORGANIZERS ════════════════════════════════ */}
        <div className="lp-sec-head">
          <h2 className="lp-sec-title">Top Organizers</h2>
        </div>
        <div className="lp-org-grid">
          {DATA.organizers.map((o, i) => (
            <div key={i} className="lp-org-card">
              <span className="lp-org-icon">{o.image}</span>
              <div className="lp-org-name">{o.name}</div>
              <div className="lp-org-expos">{o.events} events</div>
            </div>
          ))}
        </div>

        {/* ══ YOUR ROLE ══════════════════════════════════════ */}
        <div className="lp-sec-head">
          <h2 className="lp-sec-title">Your Role, Your Experience</h2>
          <p className="lp-sec-sub">
            Perfect solution for everyone in the event ecosystem
          </p>
        </div>
        <div className="lp-role-grid">
          {DATA.yourRole.map((r, i) => (
            <div key={i} className="lp-role-card">
              <div className="lp-role-img-wrap">
                <img
                  src={r.image}
                  alt={r.title}
                  className="lp-role-img"
                  loading="lazy"
                />
                <div className="lp-role-overlay">
                  <h3 className="lp-role-overlay-title">{r.title}</h3>
                </div>
              </div>
              <div className="lp-role-body">
                <p className="lp-role-desc">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ══ HOW TO START ══════════════════════════════════ */}
        <div className="lp-sec-head">
          <h2 className="lp-sec-title">How to Get Started</h2>
          <p className="lp-sec-sub">
            Launch your first event in under 5 minutes
          </p>
        </div>
        <div className="lp-steps-grid">
          {DATA.howToStart.map((s, i) => (
            <div key={i} className="lp-step-card">
              <div className="lp-step-num">{s.step}</div>
              <h3 className="lp-step-title">{s.title}</h3>
              <p className="lp-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* ══ CTA BANNER ════════════════════════════════════ */}
        <div className="lp-cta">
          <h2 className="lp-cta-title">Ready to create your next big event?</h2>
          <p className="lp-cta-sub">Join 340K+ users who love our platform</p>
          <Link to="/register" className="lp-cta-btn">
            Start Free Trial
          </Link>
        </div>
      </div>
    </>
  );
}
