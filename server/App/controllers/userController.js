const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, company, phone } = req.body;

    console.log("BODY:", req.body); // ✅ DEBUG

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // ❌ ADMIN BLOCK
    // allow admin only for testing
if (role === "admin" && process.env.NODE_ENV === "production") {
  return res.json({
    success: false,
    message: "Admin cannot be registered"
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

    // ✅ IMPORTANT FIX
    const user = new userModel({
      name,
      email,
      password: hashPassword,
      role,          // ✅ direct use
      company,       // ✅ direct save
      phone,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Register Successfully",
      user,
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

    // ===============================
    // FIND USER
    // ===============================
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.send({
        status: 0,
        message: "User not found",
      });
    }

    // ===============================
    // PASSWORD CHECK
    // ===============================
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.send({
        status: 0,
        message: "Invalid Password",
      });
    }

    // ===============================
    // TOKEN GENERATE
    // ===============================
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ===============================
    // RESPONSE
    // ===============================
    res.send({
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
      },
    });

  } catch (error) {
    console.log(error);
    res.send({
      status: 0,
      message: "Server Error",
    });
  }
};


// ================= PROFILE =================
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.send({
        status: 0,
        message: "User not found",
      });
    }

    res.send({
      status: 1,
      user,
    });

  } catch (error) {
    console.log(error);
    res.send({
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
      return res.status(404).send({
        status: 0,
        message: "User not found",
      });
    }

    res.send({
      status: 1,
      message: "Updated successfully",
      user: updated,
    });

  } catch (error) {
    res.send({
      status: 0,
      message: "Server Error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};