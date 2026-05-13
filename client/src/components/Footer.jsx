import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  const links = {
    "Quick Links": [
      { label: "Home", to: "/" },
      { label: "Events", to: "/events" },
      { label: "Pricing", to: "/pricing" },
      { label: "About Us", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],

    Platform: [
      { label: "Browse Events", to: "/events" },
      { label: "Create Expo", to: "/events" },
      { label: "Analytics", to: "/events" },
    ],

    "Legal & Support": [
      { label: "Privacy Policy", to: "/contact" },
      { label: "Terms of Service", to: "/contact" },
      { label: "Help Center", to: "/contact" },
      { label: "Cookie Policy", to: "/contact" },
      { label: "Security", to: "/contact" },
    ],
  };

  const socials = [
    { icon: "𝕏", href: "https://twitter.com", label: "Twitter" },
    { icon: "in", href: "https://linkedin.com", label: "LinkedIn" },
    { icon: "f", href: "https://facebook.com", label: "Facebook" },
    { icon: "◎", href: "https://instagram.com", label: "Instagram" },
  ];

  return (
    <footer className="ft-root">
      {/* MAIN GRID */}
      <div className="ft-main">
        {/* BRAND */}
        <div>
          <div className="ft-brand-logo">
            <div className="ft-logo-orb">
              <span className="ft-logo-orb-inner">ES</span>
            </div>

            <span className="ft-brand-name">
              Event<em>Sphere</em>
            </span>
          </div>

          <p className="ft-brand-desc">
            A futuristic event management platform for events, exhibitors, and
            attendees. Build, manage, and grow world-class events —
            effortlessly.
          </p>

          <span className="ft-nl-label">Stay in the loop</span>

          <div className="ft-nl-row">
            <input
              className="ft-nl-input"
              type="email"
              placeholder="your@email.com"
            />

            <button className="ft-nl-btn">Subscribe →</button>
          </div>

          <div className="ft-socials">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ft-soc"
                title={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* LINKS */}
        {Object.entries(links).map(([heading, items]) => (
          <div key={heading} className="ft-col">
            <h4>{heading}</h4>

            {items.map((item) => (
              <Link key={item.label} to={item.to}>
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* BOTTOM */}
      <div className="ft-bottom">
        <span className="ft-copy">
          © {year} EventSphere Inc. All rights reserved.
        </span>

        <div className="ft-bottom-links">
          <Link to="/contact">Privacy</Link>
          <Link to="/contact">Terms</Link>
          <Link to="/contact">Cookies</Link>
          <Link to="/contact">Security</Link>
        </div>

        <div className="ft-made">
          Built with <span className="ft-heart">♥</span> for the future of
          events
        </div>
      </div>
    </footer>
  );
}
