import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import "./Navbar.css";

const NAV_LINKS = [
  { to: "/expos", label: "Events", icon: "◈" },
  { to: "/pricing", label: "Pricing", icon: "✧" },
  { to: "/about", label: "About", icon: "◎" },
  { to: "/contact", label: "Contact", icon: "⬟" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate(); // Added navigate hook
  const drawerRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // DARK MODE DEFAULT
  const [theme, setTheme] = useState(
    () => localStorage.getItem("es-theme") || "dark"
  );

  /* scroll */
  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", fn);

    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* APPLY THEME TO BODY */
  useEffect(() => {
    const body = document.body;

    if (theme === "dark") {
      body.classList.add("dark-mode");
      body.classList.remove("light-mode");
    } else {
      body.classList.add("light-mode");
      body.classList.remove("dark-mode");
    }

    localStorage.setItem("es-theme", theme);
  }, [theme]);

  /* close on route change */
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  /* close on outside click */
  useEffect(() => {
    const h = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMenuOpen(false);
        setProfileOpen(false);
      }
    };

    if (menuOpen || profileOpen) {
      document.addEventListener("mousedown", h);
    }

    return () => document.removeEventListener("mousedown", h);
  }, [menuOpen, profileOpen]);

  const toggleTheme = () => {
    setTheme((p) => (p === "dark" ? "light" : "dark"));
  };

  const toggleProfile = () => {
    setProfileOpen((open) => !open);
  };

  // Function to handle profile navigation and close dropdown
  const handleProfileClick = (role) => {
    navigate(`/profilepage?role=${role}`);
    setProfileOpen(false); // Close dropdown after navigation
  };

  const dark = theme === "dark";

  return (
    <nav
      className={`nb-root ${scrolled ? "nb-scrolled" : "nb-top"}`}
      ref={drawerRef}
    >
      <div className="nb-wrap">

        {/* MAIN BAR */}
        <div className="nb-bar">

          {/* LOGO */}
          <Link to="/" className="nb-logo">
            <div className="nb-orb">
              <span className="nb-orb-label">ES</span>
            </div>

            <span className="nb-brand">
              Event<em>Sphere</em>
            </span>
          </Link>

          {/* DESKTOP CENTER */}
          <div className="nb-center nb-desktop">
            {NAV_LINKS.map((l, i) => (
              <div
                key={l.to}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {i > 0 && <div className="nb-sep" />}
                <Link
                  to={l.to}
                  className={`nb-link ${
                    location.pathname === l.to ? "active" : ""
                  }`}
                >
                  <span>{l.icon}</span>
                  {l.label}
                </Link>
              </div>
            ))}
          </div>

          {/* DESKTOP RIGHT */}
          <div className="nb-right nb-desktop">
            <button className="nb-theme" onClick={toggleTheme}>
              {dark ? "☀️" : "🌙"}
            </button>

            <Link to="/login" className="nb-signin">
              Sign in
            </Link>

            <Link to="/register" className="nb-cta">
              Get Started →
            </Link>

            {/* NEW PROFILE DROPDOWN BUTTON */}
            <div className="nb-profile-container">
              <button className="nb-profile-btn" onClick={toggleProfile}>
                {/* <span className="nb-profile-avatar">👤</span> */}
                <span className="nb-profile-name">Profile</span>
                <span className="nb-profile-arrow">▼</span>
              </button>

              {/* PROFILE DROPDOWN */}
              <div className={`nb-profile-dropdown ${profileOpen ? "open" : ""}`}>
                <div 
                  className="nb-profile-item" 
                  onClick={() => handleProfileClick("attendee")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleProfileClick("attendee");
                    }
                  }}
                >
                  👤 Attendee Profile
                </div>
                <div 
                  className="nb-profile-item" 
                  onClick={() => handleProfileClick("exhibitor")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleProfileClick("exhibitor");
                    }
                  }}
                >
                  🏪 Exhibitor Profile
                </div>
                <div 
                  className="nb-profile-item" 
                  onClick={() => handleProfileClick("admin")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleProfileClick("admin");
                    }
                  }}
                >
                  ⚙️ Admin Profile
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE RIGHT */}
          <div className="nb-right nb-mobile-only" style={{ gap: 8 }}>
            <button className="nb-theme" onClick={toggleTheme}>
              {dark ? "☀️" : "🌙"}
            </button>

            <button
              className={`nb-ham ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <div className="nb-ham-line"></div>
              <div className="nb-ham-line"></div>
              <div className="nb-ham-line"></div>
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        <div className={`nb-drawer ${menuOpen ? "open" : ""}`}>
          <div className="nb-drawer-inner">

            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`nb-mob-link ${
                  location.pathname === l.to ? "active" : ""
                }`}
              >
                <span className="nb-mob-icon">{l.icon}</span>
                {l.label}
              </Link>
            ))}

            <div className="nb-mob-actions">
              <Link to="/login" className="nb-signin">
                Sign in
              </Link>

              <Link to="/register" className="nb-cta">
                Get Started →
              </Link>

              {/* MOBILE PROFILE BUTTON */}
              <div className="nb-mob-profile">
                <div 
                  className="nb-profile-item" 
                  onClick={() => handleProfileClick("attendee")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleProfileClick("attendee");
                    }
                  }}
                >
                  👤 Attendee
                </div>
                <div 
                  className="nb-profile-item" 
                  onClick={() => handleProfileClick("exhibitor")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleProfileClick("exhibitor");
                    }
                  }}
                >
                  🏪 Exhibitor
                </div>
                <div 
                  className="nb-profile-item" 
                  onClick={() => handleProfileClick("admin")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleProfileClick("admin");
                    }
                  }}
                >
                  ⚙️ Admin
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}