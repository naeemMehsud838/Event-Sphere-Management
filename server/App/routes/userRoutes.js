// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const User = require("../models/userModel");

// const {
//   registerUser,
//   loginUser,
//   getUserProfile,
//   updateUserProfile
// } = require("../controllers/userController");

// // ================= PUBLIC ROUTES =================
// router.post("/register", registerUser);
// router.post("/login", loginUser);

// // ================= PROTECTED ROUTES =================
// router.put("/update/:id", updateUserProfile);
// router.get("/profile/:id", getUserProfile);

// // ================= ADMIN CREATE ROUTE =================
// router.post("/admin-create", async (req, res) => {
//   try {
//     const { secretCode, name, email, password, company, phone } = req.body;

//     if (secretCode !== "EVENT2026") {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid secret code"
//       });
//     }

//     const exist = await User.findOne({ email });
//     if (exist) {
//       return res.status(400).json({
//         success: false,
//         message: "Admin already exists with this email"
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const admin = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role: "admin",
//       company: company || "",
//       phone: phone || ""
//     });

//     await admin.save();

//     const adminResponse = admin.toObject();
//     delete adminResponse.password;

//     res.status(201).json({
//       success: true,
//       message: "Admin created successfully",
//       user: adminResponse
//     });

//   } catch (err) {
//     console.error("Admin Create Error:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message || "Failed to create admin"
//     });
//   }
// });

// // ================= GET ALL USERS =================
// router.get("/all", async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.json({
//       success: true,
//       count: users.length,
//       users
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

// // ================= GET TOTAL USERS COUNT =================
// router.get("/count", async (req, res) => {
//   try {
//     const totalUsers = await User.countDocuments();
//     const totalAttendees = await User.countDocuments({ role: 'attendee' });
//     const totalExhibitors = await User.countDocuments({ role: 'exhibitor' });
//     const totalAdmins = await User.countDocuments({ role: 'admin' });
    
//     res.json({
//       success: true,
//       totalUsers: totalUsers,
//       totalAttendees: totalAttendees,
//       totalExhibitors: totalExhibitors,
//       totalAdmins: totalAdmins
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

// // ================= ATTENDEE MANAGEMENT ROUTES =================
// router.get("/attendees", async (req, res) => {
//   try {
//     const attendees = await User.find({ role: 'attendee' }).select('-password');
//     res.json({
//       success: true,
//       count: attendees.length,
//       attendees
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

// router.get("/pending-requests", async (req, res) => {
//   try {
//     const pendingUsers = await User.find({ status: 'pending' }).select('-password');
//     res.json({
//       success: true,
//       count: pendingUsers.length,
//       pendingRequests: pendingUsers
//     });
//   } catch (error) {
//     res.json({
//       success: true,
//       count: 0,
//       pendingRequests: []
//     });
//   }
// });

// router.put("/approve/:id", async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { role: 'attendee', status: 'approved' },
//       { new: true }
//     ).select('-password');
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }
    
//     res.json({
//       success: true,
//       message: "Attendee approved successfully!",
//       user
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

// router.delete("/reject/:id", async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }
//     res.json({
//       success: true,
//       message: "Attendee rejected and removed"
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

// // ================= EXHIBITOR MANAGEMENT ROUTES =================
// router.get("/exhibitors", async (req, res) => {
//   try {
//     const exhibitors = await User.find({ role: 'exhibitor' })
//       .select("-password")
//       .sort({ createdAt: -1 });
    
//     const pendingCount = await User.countDocuments({ 
//       role: 'pending',
//       company: { $exists: true, $ne: "" }
//     });
    
//     res.json({
//       success: true,
//       count: exhibitors.length,
//       pendingCount: pendingCount,
//       exhibitors: exhibitors
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

// router.put("/approve-exhibitor/:id", async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { role: "exhibitor", status: "approved" },
//       { new: true }
//     ).select("-password");
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }
    
//     res.json({
//       success: true,
//       message: "Exhibitor approved successfully!",
//       user
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

// router.delete("/reject-exhibitor/:id", async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }
//     res.json({
//       success: true,
//       message: "Exhibitor rejected and removed"
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

// // ================= PROFILE ROUTES =================
// router.get("/profile", async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
    
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "No token provided"
//       });
//     }
    
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey123");
//     const user = await User.findById(decoded.id).select("-password");
    
//     res.json({
//       success: true,
//       user: user
//     });
    
//   } catch (error) {
//     res.status(401).json({
//       success: false,
//       message: "Invalid token"
//     });
//   }
// });

// router.put("/update-profile", async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
    
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "No token provided"
//       });
//     }
    
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey123");
//     const { name, phone, company, location } = req.body;
    
//     const user = await User.findByIdAndUpdate(
//       decoded.id,
//       {
//         name: name || undefined,
//         phone: phone || undefined,
//         company: company || undefined,
//         location: location || undefined
//       },
//       { new: true }
//     ).select("-password");
    
//     res.json({
//       success: true,
//       message: "Profile updated successfully",
//       user: user
//     });
    
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

// // ✅ GET PROFILE BY EMAIL
// router.get("/profile-by-email", async (req, res) => {
//   try {
//     const { email } = req.query;
    
//     console.log("📥 Profile request for email:", email);
    
//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required"
//       });
//     }
    
//     const user = await User.findOne({ email }).select("-password");
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }
    
//     console.log("✅ User found:", user.name);
    
//     res.json({
//       success: true,
//       user: user
//     });
    
//   } catch (error) {
//     console.error("Profile error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

// // ✅ UPDATE PROFILE BY EMAIL
// router.put("/update-profile-by-email", async (req, res) => {
//   try {
//     const { email } = req.query;
//     const { name, phone, company, location } = req.body;
    
//     console.log("📥 Update request for email:", email);
    
//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required"
//       });
//     }
    
//     const user = await User.findOneAndUpdate(
//       { email: email },
//       {
//         name: name || undefined,
//         phone: phone || undefined,
//         company: company || undefined,
//         location: location || undefined
//       },
//       { new: true }
//     ).select("-password");
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }
    
//     console.log("✅ User updated:", user.name);
    
//     res.json({
//       success: true,
//       message: "Profile updated successfully",
//       user: user
//     });
    
//   } catch (error) {
//     console.error("Update profile error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });
// // ✅ UPDATE PROFILE BY EMAIL (with bio and location)
// router.put("/update-profile-by-email", async (req, res) => {
//   try {
//     const { email } = req.query;
//     const { name, phone, company, bio, location } = req.body;
    
//     console.log("📥 Update request for email:", email);
//     console.log("Update data:", { name, phone, company, bio, location });
    
//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required"
//       });
//     }
    
//     const user = await User.findOneAndUpdate(
//       { email: email },
//       {
//         name: name || undefined,
//         phone: phone || undefined,
//         company: company || undefined,
//         bio: bio || undefined,
//         location: location || undefined
//       },
//       { new: true }
//     ).select("-password");
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }
    
//     console.log("✅ User updated:", user.name);
    
//     res.json({
//       success: true,
//       message: "Profile updated successfully",
//       user: user
//     });
    
//   } catch (error) {
//     console.error("Update profile error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });









// module.exports = router;




const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getPendingUsers,
  approveUser,    // ✅ Make sure this is imported
  rejectUser,     // ✅ Make sure this is imported
  getAllUsers
} = require("../controllers/userController");
// ================= PUBLIC ROUTES =================
router.post("/register", registerUser);
router.post("/login", loginUser);

// ================= PROTECTED ROUTES =================
router.put("/update/:id", updateUserProfile);
router.get("/profile/:id", getUserProfile);


// ================= ADMIN ROUTES =================
router.get("/admin/pending-users", getPendingUsers);
// ================= ADMIN APPROVE ROUTES =================
router.put("/approve-user/:userId", approveUser);
router.delete("/reject-user/:userId", rejectUser);
router.get("/admin/all-users", getAllUsers);

// ================= ADMIN CREATE ROUTE =================
router.post("/admin-create", async (req, res) => {
  try {
    const { secretCode, name, email, password, company, phone } = req.body;

    if (secretCode !== "EVENT2026") {
      return res.status(401).json({
        success: false,
        message: "Invalid secret code"
      });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists with this email"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      company: company || "",
      phone: phone || "",
      isApproved: true  // ✅ Admin auto-approved
    });

    await admin.save();

    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      user: adminResponse
    });

  } catch (err) {
    console.error("Admin Create Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to create admin"
    });
  }
});

// ================= 🆕 NEW: ADMIN APPROVAL ROUTES =================

// 🆕 Get pending exhibitors (waiting for approval)
router.get("/pending-exhibitors", async (req, res) => {
  try {
    const pendingExhibitors = await User.find({ 
      role: "exhibitor",
      isApproved: false 
    }).select("-password");
    
    res.json({
      success: true,
      count: pendingExhibitors.length,
      pendingExhibitors: pendingExhibitors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 🆕 Approve exhibitor
router.put("/approve-exhibitor/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { isApproved: true },
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.json({
      success: true,
      message: "Exhibitor approved successfully! They can now login.",
      user: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 🆕 Reject exhibitor (delete)
router.delete("/reject-exhibitor/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.json({
      success: true,
      message: "Exhibitor rejected and removed from system"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 🆕 Get all approved exhibitors
router.get("/approved-exhibitors", async (req, res) => {
  try {
    const exhibitors = await User.find({ 
      role: "exhibitor",
      isApproved: true 
    }).select("-password");
    
    res.json({
      success: true,
      count: exhibitors.length,
      exhibitors: exhibitors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 🆕 Get all users with approval status (for admin dashboard)
router.get("/all-users-with-status", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    
    const stats = {
      total: users.length,
      approved: users.filter(u => u.isApproved !== false).length,
      pending: users.filter(u => u.role === "exhibitor" && u.isApproved === false).length,
      attendees: users.filter(u => u.role === "attendee").length,
      exhibitors: users.filter(u => u.role === "exhibitor").length,
      admins: users.filter(u => u.role === "admin").length
    };
    
    res.json({
      success: true,
      stats: stats,
      users: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ================= END OF NEW ROUTES =================

// ================= GET ALL USERS =================
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ================= GET TOTAL USERS COUNT =================
router.get("/count", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAttendees = await User.countDocuments({ role: 'attendee' });
    const totalExhibitors = await User.countDocuments({ role: 'exhibitor' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const pendingApprovals = await User.countDocuments({ 
      role: 'exhibitor', 
      isApproved: false 
    });
    
    res.json({
      success: true,
      totalUsers: totalUsers,
      totalAttendees: totalAttendees,
      totalExhibitors: totalExhibitors,
      totalAdmins: totalAdmins,
      pendingApprovals: pendingApprovals  // 🆕 Added
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ================= ATTENDEE MANAGEMENT ROUTES =================
router.get("/attendees", async (req, res) => {
  try {
    const attendees = await User.find({ role: 'attendee' }).select('-password');
    res.json({
      success: true,
      count: attendees.length,
      attendees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/pending-requests", async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: 'pending' }).select('-password');
    res.json({
      success: true,
      count: pendingUsers.length,
      pendingRequests: pendingUsers
    });
  } catch (error) {
    res.json({
      success: true,
      count: 0,
      pendingRequests: []
    });
  }
});

router.put("/approve/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'attendee', status: 'approved', isApproved: true }, // 🆕 Added isApproved
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.json({
      success: true,
      message: "Attendee approved successfully!",
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.delete("/reject/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.json({
      success: true,
      message: "Attendee rejected and removed"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ================= EXHIBITOR MANAGEMENT ROUTES =================
router.get("/exhibitors", async (req, res) => {
  try {
    const exhibitors = await User.find({ role: 'exhibitor' })
      .select("-password")
      .sort({ createdAt: -1 });
    
    const pendingCount = await User.countDocuments({ 
      role: 'exhibitor',
      isApproved: false  // 🆕 Updated condition
    });
    
    res.json({
      success: true,
      count: exhibitors.length,
      pendingCount: pendingCount,
      exhibitors: exhibitors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Note: This route is kept for backward compatibility
router.put("/approve-exhibitor/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: "exhibitor", status: "approved", isApproved: true }, // 🆕 Added isApproved
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.json({
      success: true,
      message: "Exhibitor approved successfully!",
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.delete("/reject-exhibitor/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.json({
      success: true,
      message: "Exhibitor rejected and removed"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ================= PROFILE ROUTES =================
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey123");
    const user = await User.findById(decoded.id).select("-password");
    
    res.json({
      success: true,
      user: user
    });
    
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
});

router.put("/update-profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey123");
    const { name, phone, company, location } = req.body;
    
    const user = await User.findByIdAndUpdate(
      decoded.id,
      {
        name: name || undefined,
        phone: phone || undefined,
        company: company || undefined,
        location: location || undefined
      },
      { new: true }
    ).select("-password");
    
    res.json({
      success: true,
      message: "Profile updated successfully",
      user: user
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ✅ GET PROFILE BY EMAIL
router.get("/profile-by-email", async (req, res) => {
  try {
    const { email } = req.query;
    
    console.log("📥 Profile request for email:", email);
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }
    
    const user = await User.findOne({ email }).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    console.log("✅ User found:", user.name);
    
    res.json({
      success: true,
      user: user
    });
    
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ✅ UPDATE PROFILE BY EMAIL (with bio and location)
router.put("/update-profile-by-email", async (req, res) => {
  try {
    const { email } = req.query;
    const { name, phone, company, bio, location } = req.body;
    
    console.log("📥 Update request for email:", email);
    console.log("Update data:", { name, phone, company, bio, location });
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }
    
    const user = await User.findOneAndUpdate(
      { email: email },
      {
        name: name || undefined,
        phone: phone || undefined,
        company: company || undefined,
        bio: bio || undefined,
        location: location || undefined
      },
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    console.log("✅ User updated:", user.name);
    
    res.json({
      success: true,
      message: "Profile updated successfully",
      user: user
    });
    
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;