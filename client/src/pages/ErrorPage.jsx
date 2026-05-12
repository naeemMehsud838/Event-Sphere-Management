import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Sparkles } from "lucide-react";
import "./ErrorPage.css"

function NotFound() {
  return (
    <div className="notfound-page">
      {/* Floating Glow */}
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>

      {/* Content */}
      <motion.div
        className="notfound-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="error-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <Sparkles size={18} />
          EventSphere
        </motion.div>

        <motion.h1
          className="error-code"
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          404
        </motion.h1>

        <motion.h2
          className="error-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Oops! This event page vanished.
        </motion.h2>

        <motion.p
          className="error-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          The page you’re looking for may have been removed, renamed,
          or never existed in the EventSphere universe.
        </motion.p>

        <motion.div
          className="button-group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Link to="/" className="home-btn">
            <Home size={18} />
            Back Home
          </Link>

          <button className="back-btn" onClick={() => window.history.back()}>
            <ArrowLeft size={18} />
            Go Back
          </button>
        </motion.div>
      </motion.div>

      {/* Background Text */}
      <div className="bg-text">EVENTSPHERE</div>
    </div>
  );
}

export default NotFound