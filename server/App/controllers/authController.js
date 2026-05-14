// const User = require("../models/User");
// const bcrypt = require("bcryptjs");

// //REGISTER
// const registerUser = async (req, res) => {
//   console.log("REGISTER HIT");

//   try {

//     const {
//       name,
//       email,
//       password,
//       role,
//       company,
//       phone,
//     } = req.body;

//     const existingUser = await User.findOne({
//       email,
//     });

//     if (existingUser) {

//       return res.status(400).json({
//         success: false,
//         message: "Email already exists",
//       });

//     }

//     const hashedPassword =
//       await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       company,
//       phone,
//     });

//     // STORE SESSION
//     req.session.user = {
//       id: user._id,
//       role: user.role,
//     };

//     // REMOVE PASSWORD
//     const userWithoutPassword = {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       company: user.company,
//       phone: user.phone,
//     };

//     res.status(201).json({
//       success: true,
//       message: "Registration successful",
//       user: userWithoutPassword,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }
// };

// //LOGIN

// const loginUser = async (req, res) => {

//   try {

//     const { email, password } = req.body;

//     // FIND USER
//     const user =
//       await User.findOne({ email });

//     if (!user) {

//       return res.status(400).json({
//         success: false,
//         message: "User not found",
//       });

//     }

//     // CHECK PASSWORD
//     const isMatch =
//       await bcrypt.compare(
//         password,
//         user.password
//       );

//     if (!isMatch) {

//       return res.status(400).json({
//         success: false,
//         message: "Invalid password",
//       });

//     }

//     // STORE SESSION
//     req.session.user = {
//       id: user._id,
//       role: user.role,
//     };

//     // REMOVE PASSWORD
//     const userWithoutPassword = {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       company: user.company,
//       phone: user.phone,
//     };

//     res.json({
//       success: true,
//       message: "Login successful",
//       user: userWithoutPassword,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }

// };

// //LOGOUT USER

// const logoutUser = (req, res) => {

//   req.session.destroy(() => {

//     res.json({
//       success: true,
//       message: "Logged out successfully",
//     });

//   });

// };

// // CHECK AUTH

// const checkAuth = async (req, res) => {

//   try {

//     if (!req.session.user) {

//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });

//     }

//     const user =
//       await User.findById(
//         req.session.user.id
//       ).select("-password");

//     res.json({
//       success: true,
//       user,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }

// };

// module.exports = {
//   registerUser,
//   loginUser,
//   logoutUser,
//   checkAuth,
// };