// const express = require("express");
// const router = express.Router();
// const Event = require("../models/Event");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // ================= MULTER CONFIGURATION =================
// const uploadDir = "uploads/events";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, "event-" + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|gif|webp/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);
  
//   if (mimetype && extname) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images are allowed (jpeg, jpg, png, gif, webp)"));
//   }
// };

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: fileFilter
// });

// // ================= CREATE EVENT (WITH IMAGE UPLOAD) =================
// router.post("/events", upload.single("coverImage"), async (req, res) => {
//   try {
//     console.log("📥 Request file:", req.file);
//     console.log("📥 Request body:", req.body);
    
//     const { 
//       title, 
//       category, 
//       location, 
//       ticketPrice, 
//       startDate, 
//       endDate, 
//       description,
//       tags
//     } = req.body;
    
//     if (!title || !category || !location || !startDate || !endDate || !description) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields required",
//         received: { title, category, location, startDate, endDate, description }
//       });
//     }
    
//     let coverImage = "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg";
//     if (req.file) {
//       const baseUrl = `${req.protocol}://${req.get("host")}`;
//       coverImage = `${baseUrl}/uploads/events/${req.file.filename}`;
//     }
    
//     let tagsArray = [];
//     if (tags) {
//       tagsArray = tags.split(",").map(t => t.trim());
//     }
    
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     const now = new Date();
//     let eventStatus = "upcoming";
//     if (start <= now && end >= now) {
//       eventStatus = "ongoing";
//     } else if (end < now) {
//       eventStatus = "completed";
//     }
    
//     const eventData = {
//       title: title.trim(),
//       category: category,
//       location: location.trim(),
//       ticketPrice: Number(ticketPrice) || 0,
//       startDate: start,
//       endDate: end,
//       description: description.trim(),
//       coverImage: coverImage,
//       tags: tagsArray,
//       totalSeats: 500,
//       availableSeats: 500,
//       maxAttendees: 500,
//       organizer: "673a4f2a8d9f3e001a2b3c4a",
//       status: eventStatus
//     };
    
//     const event = new Event(eventData);
//     const savedEvent = await event.save();
    
//     console.log(`✅ Event created: ${savedEvent.title}`);
//     console.log(`📸 Cover image: ${savedEvent.coverImage}`);
    
//     res.status(201).json({
//       success: true,
//       message: "Event created successfully! 🎉",
//       event: savedEvent
//     });
    
//   } catch (error) {
//     console.error("❌ Create event error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

// // ================= GET ALL EVENTS (for admin/public) =================
// router.get("/events", async (req, res) => {
//   try {
//     const events = await Event.find().sort({ startDate: -1 });
//     res.json({
//       success: true,
//       count: events.length,
//       events
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

// // ================= GET ALL EVENTS (for exhibitor dashboard - no filters) =================
// // ================= GET ALL EVENTS =================
// router.get("/events", async (req, res) => {
//   try {
//     const events = await Event.find().sort({ startDate: -1 });
//     res.json({
//       success: true,
//       count: events.length,
//       events
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

// // ================= GET SINGLE EVENT =================
// router.get("/events/:id", async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found"
//       });
//     }
//     res.json({
//       success: true,
//       event
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });


// // ================= GET ALL EVENTS FOR EXHIBITOR DASHBOARD =================
// router.get("/events/all", async (req, res) => {
//   try {
//     const events = await Event.find().sort({ startDate: -1 });
//     res.json({
//       success: true,
//       count: events.length,
//       events
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

// // ================= UPDATE EVENT =================
// router.put("/events/:id", async (req, res) => {
//   try {
//     const {
//       title,
//       category,
//       location,
//       ticketPrice,
//       startDate,
//       endDate,
//       description,
//       coverImage,
//       tags,
//       status
//     } = req.body;
    
//     const event = await Event.findById(req.params.id);
//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found"
//       });
//     }
    
//     if (title) event.title = title;
//     if (category) event.category = category;
//     if (location) event.location = location;
//     if (ticketPrice) event.ticketPrice = Number(ticketPrice);
//     if (startDate) event.startDate = new Date(startDate);
//     if (endDate) event.endDate = new Date(endDate);
//     if (description) event.description = description;
//     if (coverImage) event.coverImage = coverImage;
//     if (tags) event.tags = tags.split(",").map(t => t.trim());
//     if (status) event.status = status;
    
//     await event.save();
    
//     res.json({
//       success: true,
//       message: "Event updated successfully",
//       event
//     });
//   } catch (error) {
//     console.error("❌ Update error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

// // ================= DELETE EVENT =================
// router.delete("/events/:id", async (req, res) => {
//   try {
//     const event = await Event.findByIdAndDelete(req.params.id);
//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found"
//       });
//     }
//     res.json({
//       success: true,
//       message: "Event deleted successfully"
//     });
//   } catch (error) {
//     console.error("❌ Delete error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

// module.exports = router;



 const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads/events");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// ================= CREATE EVENT (Admin/Exhibitor) =================
router.post("/admin/events", verifyToken, upload.single("coverImage"), async (req, res) => {
  try {
    const { title, category, location, ticketPrice, startDate, endDate, description, tags, totalSeats, maxAttendees } = req.body;
    
    // Check if user is admin or exhibitor
    if (req.user.role !== "admin" && req.user.role !== "exhibitor") {
      return res.status(403).json({
        success: false,
        message: "Only admin and exhibitor can create events",
      });
    }

    if (!title || !category || !location || !startDate || !endDate || !description) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    // Parse start and end dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be after end date",
      });
    }

    // Determine event status based on dates
    const now = new Date();
    let eventStatus = "upcoming";
    if (start <= now && end >= now) {
      eventStatus = "ongoing";
    } else if (end < now) {
      eventStatus = "completed";
    }

    const coverImage = req.file ? `/uploads/events/${req.file.filename}` : "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg";

    const event = new Event({
      title,
      category,
      location,
      ticketPrice: Number(ticketPrice) || 0,
      startDate: start,
      endDate: end,
      description,
      tags: tags ? tags.split(",").map(t => t.trim()) : [],
      coverImage,
      organizer: req.user.id,
      status: eventStatus,
      totalSeats: Number(totalSeats) || 100,
      maxAttendees: Number(maxAttendees) || 500,
      availableSeats: Number(totalSeats) || 100,
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= GET ALL EVENTS =================
router.get("/events", async (req, res) => {
  try {
    const { category, status, search } = req.query;
    
    let query = {};
    
    if (category && category !== "All") {
      query.category = category;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    
    const events = await Event.find(query)
      .sort({ startDate: 1 })
      .populate("organizer", "name email");

    res.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= GET EVENT BY ID =================
router.get("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "name email");
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }
    res.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= GET EVENTS BY ORGANIZER =================
router.get("/my-events", verifyToken, async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Get my events error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= UPDATE EVENT =================
router.put("/events/:id", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check permission
    if (event.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this event",
      });
    }

    // Update status based on dates if dates are being updated
    if (req.body.startDate || req.body.endDate) {
      const start = req.body.startDate ? new Date(req.body.startDate) : event.startDate;
      const end = req.body.endDate ? new Date(req.body.endDate) : event.endDate;
      const now = new Date();
      
      if (start <= now && end >= now) {
        req.body.status = "ongoing";
      } else if (end < now) {
        req.body.status = "completed";
      } else if (start > now) {
        req.body.status = "upcoming";
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    res.json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= DELETE EVENT =================
router.delete("/events/:id", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check permission
    if (event.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this event",
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ================= GET ALL EVENTS (PUBLIC) =================
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find({ status: { $ne: "cancelled" } })
      .sort({ startDate: 1 })
      .populate("organizer", "name email");

    res.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= ADMIN DASHBOARD STATS =================
router.get("/admin/dashboard", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ status: "upcoming" });
    const ongoingEvents = await Event.countDocuments({ status: "ongoing" });
    const completedEvents = await Event.countDocuments({ status: "completed" });
    
    // Get recent events
    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("organizer", "name");

    res.json({
      success: true,
      stats: {
        totalEvents,
        upcomingEvents,
        ongoingEvents,
        completedEvents,
      },
      recentEvents,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;