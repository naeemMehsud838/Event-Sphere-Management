const express = require("express");
const router = express.Router();
const Booth = require("../models/Booth");

// ✅ CREATE BOOTH








router.post("/create", async (req, res) => {
  try {
    const { title, category, description, location, email } = req.body;

    // Trim and validate
    if (!title?.trim()) return res.status(400).json({ success: false, message: "Booth name is required" });
    if (!category) return res.status(400).json({ success: false, message: "Category is required" });
    if (!description?.trim()) return res.status(400).json({ success: false, message: "Description is required" });
    if (!location?.trim()) return res.status(400).json({ success: false, message: "Location is required" });
    if (!email?.trim()) return res.status(400).json({ success: false, message: "Contact email is required" });

    // Optional: email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const exhibitorId = req.user?._id || "673a4f2a8d9f3e001a2b3c4a";

    const booth = new Booth({
      title: title.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      email: email.trim(),
      exhibitorId,
      status: "pending",
    });

    await booth.save();
    res.status(201).json({ success: true, message: "Booth created successfully! 🎉", booth });
  } catch (error) {
    console.error("Create booth error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { title, category, description, location, email } = req.body;
    if (!title || !category || !description || !location || !email) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }
    // Temporary: use a dummy exhibitorId (later replace with req.user._id)
    const exhibitorId = req.user?._id || "673a4f2a8d9f3e001a2b3c4a";
    const booth = new Booth({ title, category, description, location, email, exhibitorId, status: "pending" });
    await booth.save();
    res.status(201).json({ success: true, message: "Booth created! 🎉", booth });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ GET MY BOOTH (for exhibitor)
router.get("/my-booth", async (req, res) => {
  try {
    const exhibitorId = req.user?._id || "673a4f2a8d9f3e001a2b3c4a";
    const booths = await Booth.find({ exhibitorId });
    res.json({ success: true, booths });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;