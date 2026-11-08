const Event = require("../models/Event");
const Ticket = require("../models/Ticket");

// ================= CREATE EVENT =================
const Event = require("../models/Event");

// ================= CREATE EVENT - NO TOKEN =================
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      category,
      location,
      ticketPrice,
      startDate,
      endDate,
      description
    } = req.body;

    console.log("📝 Received event data:", req.body);

    // ✅ Validation
    if (!title || !category || !location || !startDate || !endDate || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    // ✅ Date validation
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    if (isNaN(start.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date"
      });
    }
    
    if (isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid end date"
      });
    }
    
    if (start > end) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be after end date"
      });
    }

    if (start < now) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be in the past"
      });
    }

    // ✅ Create event - HARDCODED organizer ID (ya optional)
    const eventData = {
      title: title.trim(),
      category: category,
      location: location.trim(),
      ticketPrice: Number(ticketPrice) || 0,
      startDate: start,
      endDate: end,
      description: description.trim(),
      organizer: "673a4f2a8d9f3e001a2b3c4a", // Dummy organizer ID
      totalSeats: 100,
      availableSeats: 100,
      status: "upcoming"
    };

    // ✅ Save to database
    const event = new Event(eventData);
    const savedEvent = await event.save();

    console.log(`✅ Event created: ${savedEvent.title}`);

    res.status(201).json({
      success: true,
      message: "Event created successfully! 🎉",
      event: {
        id: savedEvent._id,
        title: savedEvent.title,
        category: savedEvent.category,
        location: savedEvent.location,
        ticketPrice: savedEvent.ticketPrice,
        startDate: savedEvent.startDate,
        endDate: savedEvent.endDate,
        status: savedEvent.status
      }
    });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create event"
    });
  }
};

// ================= GET ALL EVENTS =================
exports.getAllEvents = async (req, res) => {
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
      message: "Failed to fetch events"
    });
  }
};

// ================= GET SINGLE EVENT =================
exports.getEventById = async (req, res) => {
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
      message: "Failed to fetch event"
    });
  }
};

// ================= GET ALL EVENTS =================
exports.getAllEvents = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    
    // Build filter
    let filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    
    // Get events with pagination
    const events = await Event.find(filter)
      .populate('organizer', 'name email')
      .sort({ startDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalCount = await Event.countDocuments(filter);

    res.json({
      success: true,
      count: events.length,
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      events
    });
  } catch (error) {
    console.error("❌ Get Events Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message
    });
  }
};

// ================= GET SINGLE EVENT =================
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    // Get ticket sales info
    const ticketSales = await Ticket.aggregate([
      { $match: { eventId: event._id, status: 'confirmed' } },
      { 
        $group: {
          _id: null,
          totalTickets: { $sum: "$quantity" },
          totalRevenue: { $sum: "$totalPrice" }
        }
      }
    ]);

    res.json({
      success: true,
      event: {
        ...event.toObject(),
        sales: ticketSales[0] || { totalTickets: 0, totalRevenue: 0 }
      }
    });
  } catch (error) {
    console.error("❌ Get Event Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event",
      error: error.message
    });
  }
};

// ================= UPDATE EVENT =================
exports.updateEvent = async (req, res) => {
  try {
    const {
      title,
      category,
      location,
      ticketPrice,
      startDate,
      endDate,
      description,
      status,
      totalSeats
    } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    // Check if user is authorized to update
    const organizerId = event.organizer.toString();
    const userId = req.user._id.toString();
    
    if (organizerId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this event"
      });
    }

    // Update fields
    if (title) event.title = title;
    if (category) event.category = category;
    if (location) event.location = location;
    if (ticketPrice) event.ticketPrice = Number(ticketPrice);
    if (startDate) event.startDate = new Date(startDate);
    if (endDate) event.endDate = new Date(endDate);
    if (description) event.description = description;
    if (status) event.status = status;
    if (totalSeats) {
      const seatsDiff = totalSeats - event.totalSeats;
      event.totalSeats = totalSeats;
      event.availableSeats += seatsDiff;
    }

    await event.save();

    console.log(`✏️ Event updated: ${event.title}`);

    res.json({
      success: true,
      message: "Event updated successfully",
      event
    });
  } catch (error) {
    console.error("❌ Update Event Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message
    });
  }
};

// ================= DELETE EVENT =================
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    // Check if user is authorized to delete
    const organizerId = event.organizer.toString();
    const userId = req.user._id.toString();
    
    if (organizerId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this event"
      });
    }

    // Check if there are any tickets sold
    const ticketsSold = await Ticket.countDocuments({ 
      eventId: event._id,
      status: 'confirmed'
    });

    if (ticketsSold > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete event. ${ticketsSold} tickets have already been sold.`
      });
    }

    // Delete event and related tickets
    await event.deleteOne();
    await Ticket.deleteMany({ eventId: req.params.id });

    console.log(`🗑️ Event deleted: ${event.title}`);

    res.json({
      success: true,
      message: "Event deleted successfully"
    });
  } catch (error) {
    console.error("❌ Delete Event Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message
    });
  }
};

// ================= GET EVENTS BY CATEGORY =================
exports.getEventsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const events = await Event.find({ category })
      .populate('organizer', 'name email')
      .sort({ startDate: 1 });

    res.json({
      success: true,
      count: events.length,
      category,
      events
    });
  } catch (error) {
    console.error("❌ Get Events By Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events by category",
      error: error.message
    });
  }
};

// ================= GET UPCOMING EVENTS =================
exports.getUpcomingEvents = async (req, res) => {
  try {
    const now = new Date();
    
    const events = await Event.find({
      startDate: { $gt: now },
      status: 'upcoming'
    })
      .populate('organizer', 'name email')
      .sort({ startDate: 1 })
      .limit(10);

    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    console.error("❌ Get Upcoming Events Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming events",
      error: error.message
    });
  }
};

// ================= GET LIVE EVENTS =================
exports.getLiveEvents = async (req, res) => {
  try {
    const now = new Date();
    
    const events = await Event.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
      status: 'live'
    })
      .populate('organizer', 'name email')
      .sort({ startDate: 1 });

    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    console.error("❌ Get Live Events Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch live events",
      error: error.message
    });
  }
};

// ================= GET DASHBOARD STATS =================
exports.getEventStats = async (req, res) => {
  try {
    const now = new Date();
    
    // Get counts by status
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ 
      startDate: { $gt: now },
      status: 'upcoming'
    });
    const liveEvents = await Event.countDocuments({ 
      startDate: { $lte: now },
      endDate: { $gte: now },
      status: 'live'
    });
    const completedEvents = await Event.countDocuments({ 
      endDate: { $lt: now },
      status: 'completed'
    });
    
    // Get counts by category
    const eventsByCategory = await Event.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    
    // Get recent events - FIXED: Use startDate instead of createdAt
    const recentEvents = await Event.find()
      .sort({ startDate: -1 })
      .limit(5)
      .select('title location startDate endDate status ticketPrice');

    res.json({
      success: true,
      stats: {
        totalEvents,
        upcomingEvents,
        liveEvents,
        completedEvents
      },
      eventsByCategory,
      recentEvents
    });
  } catch (error) {
    console.error("❌ Get Event Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event statistics",
      error: error.message
    });
  }
};