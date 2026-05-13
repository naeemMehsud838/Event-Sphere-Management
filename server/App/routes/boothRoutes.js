const express = require("express");
const router = express.Router();

const {
  createBooth,
  getMyBooths,
  deleteBooth,
  getSingleBooth,
} = require("../controllers/boothController");

router.post("/create", createBooth);
router.get("/:id", getSingleBooth);
router.get("/", getMyBooths);
router.delete("/:id", deleteBooth);

module.exports = router;