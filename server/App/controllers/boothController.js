const Booth = require("../models/Booth");

// CREATE BOOTH
const createBooth = async (req, res) => {
  try {

    const { title, description, expoId } = req.body;

    const booth = await Booth.create({
      title,
      description,
      expoId,
      exhibitorId: req.session.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Booth created",
      booth,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET MY BOOTHS
const getMyBooths = async (req, res) => {
  try {

    const booths = await Booth.find({
      exhibitorId: req.session.user.id,
    }).populate("expoId");

    res.json({
      success: true,
      booths,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE BOOTH
const deleteBooth = async (req, res) => {
  try {

    await Booth.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Booth deleted",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBooth,
  getMyBooths,
  deleteBooth,
};