const Expo = require("../models/Expo");
const User = require("../models/User");
const Booth = require("../models/Booth");

const getDashboardStats = async (req, res) => {

  try {

    // COUNTS
    const totalEvents = await Expo.countDocuments();

    const totalAttendees =
      await User.countDocuments({
        role: "attendee",
      });

    const totalExhibitors =
      await User.countDocuments({
        role: "exhibitor",
      });

    const totalBooths =
      await Booth.countDocuments();

    // RECENT EVENTS
    const recentEvents = await Expo.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,

      stats: {
        totalEvents,
        totalAttendees,
        totalExhibitors,
        totalBooths,
      },

      recentEvents,

    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  getDashboardStats,
};