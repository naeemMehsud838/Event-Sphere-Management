
const User = require("../models/userModel");
const express = require("express");
const router = express.Router();
// const User = require("../../models/userModel"); // path check karo

const bcrypt = require("bcryptjs"); // 🔥 THIS WAS MISSING

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.put("/update/:id", updateUserProfile);
router.post("/admin-create", async (req, res) => {
  try {
    const { secretCode, name, email, password, company, phone } = req.body;

    if (secretCode !== "EVENT2026") {
      return res.json({
        success: false,
        message: "Invalid secret code"
      });
    }

    const exist = await User.findOne({ email });

    if (exist) {
      return res.json({
        success: false,
        message: "Admin already exists"
      });
    }

    // 🔥 FIX HERE (DEFINE INSIDE ROUTE)
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      company,
      phone
    });

    await admin.save();

    res.json({
      success: true,
      message: "Admin created successfully",
      user: admin
    });

  } catch (err) {
    console.log(err);
   
  };
});
module.exports = router;