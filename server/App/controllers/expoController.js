const Expo = require("../models/Expo");

// CREATE EXPO (ADMIN ONLY)
const createExpo = async (req, res) => {
console.log(req.session);
console.log(req.session.user);

  try {
    const { title, description, date, location, theme } = req.body;

    const expo = await Expo.create({
      title,
      description,
      date,
      location,
      theme,
      createdBy: req.session.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Expo created successfully",
      expo,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL EXPOS
const getAllExpos = async (req, res) => {
  try {
    const expos = await Expo.find()
      .populate("createdBy", "name email");

    res.json({
      success: true,
      expos,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE EXPO
const getSingleExpo = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!expo) {
      return res.status(404).json({
        success: false,
        message: "Expo not found",
      });
    }

    res.json({
      success: true,
      expo,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE EXPO (ADMIN ONLY)
const updateExpo = async (req, res) => {
  try {
    const expo = await Expo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Expo updated",
      expo,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE EXPO (ADMIN ONLY)
const deleteExpo = async (req, res) => {
  try {
    await Expo.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Expo deleted",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createExpo,
  getAllExpos,
  getSingleExpo,
  updateExpo,
  deleteExpo,
};