// module.exports = router;

const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware"); 
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ================= MULTER CONFIGURATION =================
const uploadDir = "uploads/events";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "event-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpeg, jpg, png, gif, webp)"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

// ================= CREATE EVENT (WITH IMAGE UPLOAD) =================
router.post("/events", upload.single("coverImage"), async (req, res) => {
  try {
    // ✅ Debug logs
    console.log("📥 Request file:", req.file);
    console.log("📥 Request body:", req.body);
    
    // ✅ IMPORTANT: When using multer, text fields come in req.body
    const { 
      title, 
      category, 
      location, 
      ticketPrice, 
      startDate, 
      endDate, 
      description,
      tags
    } = req.body;
    
    // ✅ Validation
    if (!title || !category || !location || !startDate || !endDate || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
        received: { title, category, location, startDate, endDate, description }
      });
    }
    
    // ✅ Handle cover image URL
    let coverImage = "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg";
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      coverImage = `${baseUrl}/uploads/events/${req.file.filename}`;
    }
    
    // ✅ Parse tags
    let tagsArray = [];
    if (tags) {
      tagsArray = tags.split(",").map(t => t.trim());
    }
    
    // ✅ Determine event status
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    let eventStatus = "upcoming";
    if (start <= now && end >= now) {
      eventStatus = "ongoing";
    } else if (end < now) {
      eventStatus = "completed";
    }
    
    // ✅ Create event object
    const eventData = {
      title: title.trim(),
      category: category,
      location: location.trim(),
      ticketPrice: Number(ticketPrice) || 0,
      startDate: start,
      endDate: end,
      description: description.trim(),
      coverImage: coverImage,
      tags: tagsArray,
      totalSeats: 500,
      availableSeats: 500,
      maxAttendees: 500,
      organizer: "673a4f2a8d9f3e001a2b3c4a",
      status: eventStatus
    };
    
    const event = new Event(eventData);
    const savedEvent = await event.save();
    
    console.log(`✅ Event created: ${savedEvent.title}`);
    console.log(`📸 Cover image: ${savedEvent.coverImage}`);
    
    res.status(201).json({
      success: true,
      message: "Event created successfully! 🎉",
      event: savedEvent
    });
    
  } catch (error) {
    console.error("❌ Create event error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ================= GET ALL EVENTS (Public route) =================
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ================= GET SINGLE EVENT =================
router.get("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }
    res.json({
      success: true,
      event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ================= UPDATE EVENT (FIXED WITH IMAGE UPLOAD) =================
router.put("/events/:id", upload.single("coverImage"), async (req, res) => {
  try {
    console.log("📥 Update Request Body:", req.body);
    console.log("📥 Update File:", req.file);
    
    const {
      title,
      category,
      location,
      ticketPrice,
      startDate,
      endDate,
      description,
      coverImage,
      tags,
      status
    } = req.body;
    
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }
    
    // Update text fields
    if (title) event.title = title;
    if (category) event.category = category;
    if (location) event.location = location;
    if (ticketPrice) event.ticketPrice = Number(ticketPrice);
    if (startDate) event.startDate = new Date(startDate);
    if (endDate) event.endDate = new Date(endDate);
    if (description) event.description = description;
    if (coverImage) event.coverImage = coverImage;
    if (tags) event.tags = tags.split(",").map(t => t.trim());
    if (status) event.status = status;
    
    // Update cover image if new file uploaded (this overwrites the coverImage from body)
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      event.coverImage = `${baseUrl}/uploads/events/${req.file.filename}`;
      console.log("📸 New cover image uploaded:", event.coverImage);
    }
    
    // Auto-update status based on dates if dates changed
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : event.startDate;
      const end = endDate ? new Date(endDate) : event.endDate;
      const now = new Date();
      
      if (start <= now && end >= now) {
        event.status = "ongoing";
      } else if (end < now) {
        event.status = "completed";
      } else {
        event.status = "upcoming";
      }
    }
    
    await event.save();
    
    console.log(`✅ Event updated: ${event.title}`);
    
    res.json({
      success: true,
      message: "Event updated successfully",
      event
    });
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ================= DELETE EVENT =================
router.delete("/events/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }
    res.json({
      success: true,
      message: "Event deleted successfully"
    });
  } catch (error) {
    console.error("❌ Delete error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ================= DASHBOARD =================
router.get("/dashboard", async (req, res) => {
  try {
    console.log("📊 Dashboard requested");
    
    const totalEvents = await Event.countDocuments();
    const totalUsers = await User.countDocuments({});
    
    let totalAttendees = totalUsers;
    let totalExhibitors = 0;
    let totalAdmins = 0;
    
    try {
      const sampleUser = await User.findOne({});
      if (sampleUser && sampleUser.role !== undefined) {
        totalAttendees = await User.countDocuments({ role: 'attendee' });
        totalExhibitors = await User.countDocuments({ role: 'exhibitor' });
        totalAdmins = await User.countDocuments({ role: 'admin' });
      }
    } catch (err) {
      console.log("Role field may not exist");
    }
    
    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      success: true,
      stats: {
        totalEvents: totalEvents,
        totalAttendees: totalAttendees,
        totalExhibitors: totalExhibitors,
        totalAdmins: totalAdmins,
        totalTicketsSold: 0,
        totalRevenue: 0
      },
      recentEvents: recentEvents
    });
    
  } catch (error) {
    console.error("❌ Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ================= GET ALL EVENTS FOR ADMIN =================
router.get("/events/all", async (req, res) => {
  try {
    const events = await Event.find().sort({ startDate: -1 });
    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;