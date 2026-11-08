// import { useState, useEffect, useRef } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import "./Navbar.css";

// const NAV_LINKS = [
//   { to: "/events", label: "Events", icon: "◈" },
//   { to: "/pricing", label: "Pricing", icon: "✧" },
//   { to: "/about", label: "About", icon: "◎" },
//   { to: "/contact", label: "Contact", icon: "⬟" },
// ];

// export default function Navbar() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const drawerRef = useRef(null);

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);

//   const [theme, setTheme] = useState(
//     () => localStorage.getItem("es-theme") || "dark"
//   );

//   const [user, setUser] = useState(() =>
//     JSON.parse(localStorage.getItem("user"))
//   );

//   /* SCROLL */
//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollY = window.scrollY;
//       setScrolled(scrollY > 20);

//       document.body.classList.toggle("navbar-scrolled", scrollY > 20);
//       document.documentElement.style.scrollPaddingTop =
//         scrollY > 20 ? "64px" : "72px";
//     };

//     handleScroll();
//     window.addEventListener("scroll", handleScroll, { passive: true });

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   /* THEME */
//   useEffect(() => {
//     document.body.classList.toggle("dark-mode", theme === "dark");
//     document.body.classList.toggle("light-mode", theme !== "dark");
//     localStorage.setItem("es-theme", theme);
//   }, [theme]);

//   /* ROUTE CHANGE */
//   useEffect(() => {
//     setMenuOpen(false);
//     setProfileOpen(false);
//     setUser(JSON.parse(localStorage.getItem("user")));
//   }, [location.pathname]);

//   /* OUTSIDE CLICK */
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (drawerRef.current && !drawerRef.current.contains(e.target)) {
//         setMenuOpen(false);
//         setProfileOpen(false);
//       }
//     };

//     if (menuOpen || profileOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, [menuOpen, profileOpen]);

//   const toggleTheme = () =>
//     setTheme((p) => (p === "dark" ? "light" : "dark"));

//   const toggleProfile = () => setProfileOpen((p) => !p);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     setUser(null);
//     setProfileOpen(false);
//     navigate("/login");
//   };

//   const handleProfileClick = () => {
//     if (!user) return;
//     navigate(`/profilepage?role=${user.role}`);
//     setProfileOpen(false);
//   };

//   const dark = theme === "dark";

//   /* ROLE ICON */
//   const getRoleLabel = (role) => {
//     if (role === "attendee") return "👤 Attendee Profile";
//     if (role === "exhibitor") return "🏪 Exhibitor Profile";
//     if (role === "admin") return "⚙️ Admin Profile";
//     return "Profile";
//   };

//   return (
//     <nav className={`nb-root ${scrolled ? "nb-scrolled" : "nb-top"}`} ref={drawerRef}>
//       <div className="nb-wrap">
//         <div className="nb-bar">

//           {/* LOGO */}
//           <Link to="/" className="nb-logo">
//             <div className="nb-orb">
//               <span className="nb-orb-label">ES</span>
//             </div>
//             <span className="nb-brand">
//               Event<em>Sphere</em>
//             </span>
//           </Link>

//           {/* LINKS */}
//           <div className="nb-center nb-desktop">
//             {NAV_LINKS.map((link, i) => (
//               <div key={link.to} style={{ display: "flex", alignItems: "center" }}>
//                 {i > 0 && <div className="nb-sep" />}
//                 <Link
//                   to={link.to}
//                   className={`nb-link ${location.pathname === link.to ? "active" : ""}`}
//                 >
//                   <span>{link.icon}</span>
//                   {link.label}
//                 </Link>
//               </div>
//             ))}
//           </div>

//           {/* RIGHT */}
//           <div className="nb-right nb-desktop">

//             <button className="nb-theme" onClick={toggleTheme}>
//               {dark ? "☀️" : "🌙"}
//             </button>

//             {/* NOT LOGGED IN */}
//             {!user ? (
//               <>
//                 <Link to="/login" className="nb-signin">Sign in</Link>
//                 <Link to="/register" className="nb-cta">Get Started →</Link>
//               </>
//             ) : (
//               /* PROFILE */
//               <div className="nb-profile-container">

//                 <button className="nb-profile-btn" onClick={toggleProfile}>
//                   <span className="nb-profile-name">{user.name}</span>
//                   <span className="nb-profile-arrow">▼</span>
//                 </button>

//                 <div className={`nb-profile-dropdown ${profileOpen ? "open" : ""}`}>

//                   {/* ROLE (ONLY ONE LINE) */}
//                   <div className="nb-profile-item" onClick={handleProfileClick}>
//                     {getRoleLabel(user.role)}
//                   </div>

//                   <hr />

//                   {/* LOGOUT */}
//                   <div className="nb-profile-item logout" onClick={handleLogout}>
//                     🚪 Logout
//                   </div>

//                 </div>
//               </div>
//             )}
//           </div>

//           {/* MOBILE */}
//           <div className="nb-right nb-mobile-only">

//             <button className="nb-theme" onClick={toggleTheme}>
//               {dark ? "☀️" : "🌙"}
//             </button>

//             <button
//               className={`nb-ham ${menuOpen ? "open" : ""}`}
//               onClick={() => setMenuOpen(!menuOpen)}
//             >
//               <div className="nb-ham-line"></div>
//               <div className="nb-ham-line"></div>
//               <div className="nb-ham-line"></div>
//             </button>

//           </div>
//         </div>

//         {/* MOBILE DRAWER */}
//         <div className={`nb-drawer ${menuOpen ? "open" : ""}`}>
//           <div className="nb-drawer-inner">

//             {NAV_LINKS.map((link) => (
//               <Link
//                 key={link.to}
//                 to={link.to}
//                 className={`nb-mob-link ${location.pathname === link.to ? "active" : ""}`}
//                 onClick={() => setMenuOpen(false)}
//               >
//                 <span className="nb-mob-icon">{link.icon}</span>
//                 {link.label}
//               </Link>
//             ))}

//             <div className="nb-mob-actions">

//               {!user ? (
//                 <>
//                   <Link to="/login" className="nb-signin">Sign in</Link>
//                   <Link to="/register" className="nb-cta">Get Started →</Link>
//                 </>
//               ) : (
//                 <div className="nb-mob-profile">

//                   <div className="nb-profile-item" onClick={handleProfileClick}>
//                     {getRoleLabel(user.role)}
//                   </div>

//                   <div className="nb-profile-item logout" onClick={handleLogout}>
//                     🚪 Logout
//                   </div>

//                 </div>
//               )}

//             </div>
//           </div>
//         </div>

//       </div>
//     </nav>
//   );
// }



import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const NAV_LINKS = [
  { to: "/events", label: "Events", icon: "◈" },
  { to: "/pricing", label: "Pricing", icon: "✧" },
  { to: "/about", label: "About", icon: "◎" },
  { to: "/contact", label: "Contact", icon: "⬟" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const drawerRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("es-theme") || "dark"
  );

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user:", error);
      return null;
    }
  });

  // Refresh user data from localStorage
  const refreshUserData = () => {
    try {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUser(updatedUser);
      console.log("🔄 Navbar updated:", updatedUser?.name);
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  // ✅ Get dashboard link based on role
  const getDashboardLink = () => {
    if (!user) return null;
    if (user.role === "admin") return "/admin/";
    if (user.role === "exhibitor") return "/exhibitor/";
    if (user.role === "attendee") return "/attendee/";
    return null;
  };

  // ✅ Get dashboard label based on role
  const getDashboardLabel = () => {
    if (!user) return "";
    if (user.role === "admin") return "⚙️ Admin Dashboard";
    if (user.role === "exhibitor") return "🏪 Exhibitor Dashboard";
    if (user.role === "attendee") return "📊 My Dashboard";
    return "Dashboard";
  };

  /* SCROLL */
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);

      document.body.classList.toggle("navbar-scrolled", scrollY > 20);
      document.documentElement.style.scrollPaddingTop =
        scrollY > 20 ? "64px" : "72px";
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* THEME */
  useEffect(() => {
    document.body.classList.toggle("dark-mode", theme === "dark");
    document.body.classList.toggle("light-mode", theme !== "dark");
    localStorage.setItem("es-theme", theme);
  }, [theme]);

  /* ROUTE CHANGE */
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
    refreshUserData();
  }, [location.pathname]);

  // Listen for profile update event
  useEffect(() => {
    window.addEventListener("userProfileUpdated", refreshUserData);
    
    return () => {
      window.removeEventListener("userProfileUpdated", refreshUserData);
    };
  }, []);

  /* OUTSIDE CLICK */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMenuOpen(false);
        setProfileOpen(false);
      }
    };

    if (menuOpen || profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, profileOpen]);

  const toggleTheme = () =>
    setTheme((p) => (p === "dark" ? "light" : "dark"));

  const toggleProfile = () => setProfileOpen((p) => !p);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setProfileOpen(false);
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (!user) return;
    navigate(`/profilepage?role=${user.role}`);
    setProfileOpen(false);
  };

  // ✅ Dashboard Click Handler - Navigates according to role
  const handleDashboardClick = () => {
    if (!user) return;
    const dashboardLink = getDashboardLink();
    if (dashboardLink) {
      navigate(dashboardLink);
      setProfileOpen(false);
    }
  };

  const dark = theme === "dark";

  const getRoleLabel = (role) => {
    if (role === "attendee") return "👤 Attendee Profile";
    if (role === "exhibitor") return "🏪 Exhibitor Profile";
    if (role === "admin") return "⚙️ Admin Profile";
    return "Profile";
  };

  const dashboardLabel = getDashboardLabel();
  const dashboardLink = getDashboardLink();

  return (
    <nav className={`nb-root ${scrolled ? "nb-scrolled" : "nb-top"}`} ref={drawerRef}>
      <div className="nb-wrap">
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

          {/* LINKS */}
          <div className="nb-center nb-desktop">
            {NAV_LINKS.map((link, i) => (
              <div key={link.to} style={{ display: "flex", alignItems: "center" }}>
                {i > 0 && <div className="nb-sep" />}
                <Link
                  to={link.to}
                  className={`nb-link ${location.pathname === link.to ? "active" : ""}`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="nb-right nb-desktop">
            <button className="nb-theme" onClick={toggleTheme}>
              {dark ? "☀️" : "🌙"}
            </button>

            {!user ? (
              <>
                <Link to="/login" className="nb-signin">Sign in</Link>
                <Link to="/register" className="nb-cta">Get Started →</Link>
              </>
            ) : (
              <div className="nb-profile-container">
                <button className="nb-profile-btn" onClick={toggleProfile}>
                  <span className="nb-profile-name">{user.name}</span>
                  <span className="nb-profile-arrow">▼</span>
                </button>
                
                <div className={`nb-profile-dropdown ${profileOpen ? "open" : ""}`}>
                  
                  {/* ✅ DASHBOARD BUTTON - According to role */}
                  {dashboardLink && (
                    <>
                      <div className="nb-profile-item dashboard" onClick={handleDashboardClick}>
                        {dashboardLabel}
                      </div>
                      <hr />
                    </>
                  )}
                  
                  {/* PROFILE BUTTON */}
                  <div className="nb-profile-item" onClick={handleProfileClick}>
                    {getRoleLabel(user.role)}
                  </div>
                  
                  <hr />
                  
                  {/* LOGOUT BUTTON */}
                  <div className="nb-profile-item logout" onClick={handleLogout}>
                    🚪 Logout
                  </div>
                  
                </div>
              </div>
            )}
          </div>

          {/* MOBILE */}
          <div className="nb-right nb-mobile-only">
            <button className="nb-theme" onClick={toggleTheme}>
              {dark ? "☀️" : "🌙"}
            </button>
            <button
              className={`nb-ham ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
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
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nb-mob-link ${location.pathname === link.to ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <span className="nb-mob-icon">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            <div className="nb-mob-actions">
              {!user ? (
                <>
                  <Link to="/login" className="nb-signin">Sign in</Link>
                  <Link to="/register" className="nb-cta">Get Started →</Link>
                </>
              ) : (
                <div className="nb-mob-profile">
                  {/* ✅ DASHBOARD BUTTON IN MOBILE */}
                  {dashboardLink && (
                    <div className="nb-profile-item dashboard" onClick={handleDashboardClick}>
                      {dashboardLabel}
                    </div>
                  )}
                  <div className="nb-profile-item" onClick={handleProfileClick}>
                    {getRoleLabel(user.role)}
                  </div>
                  <div className="nb-profile-item logout" onClick={handleLogout}>
                    🚪 Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}