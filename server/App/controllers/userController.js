const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, company, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Block admin registration
    if (role === "admin") {
      return res.json({
        success: false,
        message: "Admin cannot be registered",
      });
    }

    const checkUser = await userModel.findOne({ email });

    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // Dono roles ke liye pending status (attendee + exhibitor both need approval)
    const isApproved = false;
    const userStatus = "pending";

    const user = new userModel({
      name,
      email,
      password: hashPassword,
      role: role,
      company: company || "",
      phone: phone || "",
      isApproved: isApproved,
      status: userStatus,
    });

    await user.save();

    const message = "Registration successful! Please wait for admin approval before logging in.";

    res.status(201).json({
      success: true,
      message: message,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        status: user.status,
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        status: 0,
        message: "User not found",
      });
    }

    // Admin ko chodkar sabko approval check
    if (user.role !== "admin" && (user.status !== "approved" || user.isApproved !== true)) {
      return res.json({
        status: 0,
        message: "Your account is pending admin approval. Please wait.",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.json({
        status: 0,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        status: user.status,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      status: 1,
      message: "Login Success",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        phone: user.phone,
        isApproved: user.isApproved,
        status: user.status,
      },
    });

  } catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: "Server Error",
    });
  }
};

// ================= PROFILE =================
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select("-password");

    if (!user) {
      return res.json({
        status: 0,
        message: "User not found",
      });
    }

    res.json({
      status: 1,
      user,
    });

  } catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: "Error fetching profile",
    });
  }
};

// ================= UPDATE PROFILE =================
const updateUserProfile = async (req, res) => {
  console.log("updateUserProfile loaded");
  try {
    const updated = await userModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({
        status: 0,
        message: "User not found",
      });
    }

    res.json({
      status: 1,
      message: "Updated successfully",
      user: updated,
    });

  } catch (error) {
    res.json({
      status: 0,
      message: "Server Error",
    });
  }
};

// ================= ADMIN: GET PENDING USERS =================
const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await userModel.find({
      $or: [
        { role: "exhibitor", isApproved: false },
        { role: "exhibitor", status: "pending" },
        { status: "pending" }
      ]
    }).select("-password").sort({ createdAt: -1 });

    res.json({
      success: true,
      status: 1,
      count: pendingUsers.length,
      users: pendingUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      status: 0,
      message: "Error fetching pending users",
    });
  }
};

// ================= ADMIN: APPROVE USER (BOTH ROLES) =================
const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    console.log("📝 Approving user:", { userId, role });
    
    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    // Update user
    user.isApproved = true;
    user.status = "approved";
    
    if (role) {
      user.role = role;
    }
    
    await user.save();
    
    console.log("✅ User approved:", { email: user.email, role: user.role });
    
    const updatedUser = user.toObject();
    delete updatedUser.password;
    
    res.json({
      success: true,
      status: 1,
      message: `${user.role === 'exhibitor' ? 'Exhibitor' : 'Attendee'} approved successfully!`,
      user: updatedUser,
    });
    
  } catch (error) {
    console.error("❌ Approve error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= ADMIN: REJECT USER =================
const rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await userModel.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    console.log("❌ User rejected:", user.email);
    
    res.json({
      success: true,
      message: "User rejected and removed successfully",
    });
  } catch (error) {
    console.error("Reject error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= ADMIN: GET ALL USERS WITH FILTERS =================
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password").sort({ createdAt: -1 });
    
    const stats = {
      total: users.length,
      attendees: users.filter(u => u.role === "attendee").length,
      exhibitors: users.filter(u => u.role === "exhibitor").length,
      admins: users.filter(u => u.role === "admin").length,
      pending: users.filter(u => u.status === "pending").length,
      approved: users.filter(u => u.status === "approved").length,
    };
    
    res.json({
      success: true,
      stats: stats,
      users: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= EXPORT ALL FUNCTIONS =================
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getPendingUsers,
  approveUser,
  rejectUser,
  getAllUsers,
};