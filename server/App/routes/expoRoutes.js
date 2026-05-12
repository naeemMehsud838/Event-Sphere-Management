const express = require("express");
const router = express.Router();

const {
  createExpo,
  getAllExpos,
  getSingleExpo,
  updateExpo,
  deleteExpo,
} = require("../controllers/expoController");

const requireLogin = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/roleMiddleware");

// PUBLIC ROUTES
router.get("/", getAllExpos);
router.get("/:id", getSingleExpo);

// ADMIN ROUTES
router.post("/create", requireLogin, requireAdmin, createExpo);
router.put("/:id", requireLogin, requireAdmin, updateExpo);
router.delete("/:id", requireLogin, requireAdmin, deleteExpo);

module.exports = router;




//----------------------------------------------
// const express = require("express");

// const router = express.Router();

// const protect = require("../middleware/authMiddleware");

// const authorizeRoles = require(
//   "../middleware/roleMiddleware"
// );

// router.post(
//   "/create",
//   protect,
//   authorizeRoles("admin", "organizer"),
//   createExpo
// );

// router.get("/", getAllExpos);

// module.exports = router;