import { NavLink, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  LayoutDashboard,
  CalendarPlus,
  Building2,
  LayoutGrid,
  MessageCircle,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function ExhibitorLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    isActive ? "link active" : "link";

   const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };


  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <style>{`
        /* ================= WRAPPER ================= */
        .exhibitor-wrapper{
          display:flex;
          height:100vh;
          background:var(--darkest);
          color:var(--accent);
          overflow:hidden;
        }

        /* ================= SIDEBAR ================= */
        .sidebar{
          width:260px;
          height:100vh;
          background:var(--secondary);
          border-right:1px solid rgba(255,255,255,0.08);
          display:flex;
          flex-direction:column;
          padding:20px;
        }

        .top{
          display:flex;
          align-items:center;
          gap:10px;
          font-size:18px;
          font-weight:700;
          margin-bottom:25px;
        }

        .logo-box{
          width:38px;
          height:38px;
          border-radius:12px;
          background:var(--primary);
          display:flex;
          align-items:center;
          justify-content:center;
          font-weight:800;
          color:var(--accent);
        }

        .nav{
          display:flex;
          flex-direction:column;
          gap:10px;
          flex:1;
        }

        .link{
          display:flex;
          align-items:center;
          gap:12px;
          padding:12px 14px;
          border-radius:12px;
          text-decoration:none;
          color:var(--accent);
          transition:0.3s;
        }

        .link:hover{
          background:var(--secondary);
          transform:translateX(4px);
        }

        .link.active{
          background:var(--secondary);
        }

        /* ================= MAIN ================= */
        .main-area{
          flex:1;
          display:flex;
          flex-direction:column;
          min-width:0;
          height:100vh;
        }

        .topbar{
          height:65px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:0 20px;
          background:var(--secondary);
          border-bottom:1px solid rgba(255,255,255,0.08);
        }

        .menu-btn{
          display:none;
          cursor:pointer;
        }

        .content{
          flex:1;
          overflow-y:auto;
          padding:20px;
        }

        /* ================= MOBILE ================= */
        @media (max-width:768px){
          .sidebar{ display:none; }
          .menu-btn{ display:block; }
        }

        /* ================= OVERLAY ================= */
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 900;
          backdrop-filter: blur(3px);
        }

        /* ================= MOBILE SIDEBAR ================= */
        .mobile {
          position: fixed;
          top: 0;
          left: 0;
          width: 260px;
          height: 100vh;
          background: var(--darkest);
          padding: 20px;
          z-index: 1000;

          display: flex;
          flex-direction: column;

          border-right: 1px solid rgba(255,255,255,0.08);
          box-shadow: 5px 0 20px rgba(0,0,0,0.4);
          overflow-y: auto;
        }

        .mobile-top{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:25px;
        }

        .close-btn{
          background:none;
          border:none;
          color:var(--accent);
          cursor:pointer;
          font-size:20px;
        }

        .mobile-links{
          display:flex;
          flex-direction:column;
          gap:10px;
        }

        .mobile-links .link:hover{
          background:var(--secondary);
          transform:translateX(4px);
        }

        .mobile-links .link.active{
          background:var(--secondary);
        }

      `}</style>

      <div className="exhibitor-wrapper">

        {/* ================= SIDEBAR ================= */}
        <motion.aside
          className="sidebar"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="top">
            <div className="logo-box">ES</div>
            EventSphere
          </div>

          <div className="nav">
            <NavLink to="/exhibitor" end className={linkClass}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>

            <NavLink to="/exhibitor/ExhibitorEvents" className={linkClass}>
              <CalendarPlus size={18} /> Events
            </NavLink>

            <NavLink to="/exhibitor/create-booth" className={linkClass}>
              <Building2 size={18} /> Create Booth
            </NavLink>

            <NavLink to="/exhibitor/my-booth" className={linkClass}>
              <LayoutGrid size={18} /> My Booth
            </NavLink>

            <NavLink to="/exhibitor/message" className={linkClass}>
              <MessageCircle size={18} /> Messages
            </NavLink>

            <NavLink to="/exhibitor/profile" className={linkClass}>
              <User size={18} /> Profile
            </NavLink>

            <button className="link" onClick={handleLogout}>
              <LogOut size={18} /> Logout
            </button>

          </div>
        </motion.aside>

        {/* ================= MAIN ================= */}
        <div className="main-area">

          <div className="topbar">
            <Menu className="menu-btn" onClick={() => setMobileOpen(true)} />
            <h3>Exhibitor Panel</h3>
            <div>Maryam</div>
          </div>

          <div className="content">
            <Outlet />
          </div>
        </div>

        {/* ================= MOBILE SIDEBAR ================= */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                className="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMobile}
              />

              <motion.aside
                className="mobile"
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                exit={{ x: -260 }}
              >
                <div className="mobile-top">
                  <div className="top">
                    <div className="logo-box">ES</div>
                    EventSphere
                  </div>

                  <button className="close-btn" onClick={closeMobile}>
                    <X />
                  </button>
                </div>

                <div className="mobile-links" onClick={closeMobile}>
                  <NavLink to="/exhibitor" end className={linkClass}>
                    <LayoutDashboard size={18} /> Dashboard
                  </NavLink>

                  <NavLink to="/exhibitor/ExhibitorEvents" className={linkClass}>
                    <CalendarPlus size={18} /> Events
                  </NavLink>

                  <NavLink to="/exhibitor/create-booth" className={linkClass}>
                    <Building2 size={18} /> Create Booth
                  </NavLink>

                  <NavLink to="/exhibitor/my-booth" className={linkClass}>
                    <LayoutGrid size={18} /> My Booth
                  </NavLink>

                  <NavLink to="/exhibitor/message" className={linkClass}>
                    <MessageCircle size={18} /> Messages
                  </NavLink>

                  <NavLink to="/exhibitor/profile" className={linkClass}>
                    <User size={18} /> Profile
                  </NavLink>

                  <button className="link" onClick={handleLogout}>
              <LogOut size={18} /> Logout
            </button>

                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}