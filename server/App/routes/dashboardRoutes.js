const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/userModel");

// ================= DASHBOARD STATS =================
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

module.exports = router;