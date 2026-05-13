const Booth = require("../models/Booth");

// CREATE
const createBooth = async (req, res) => {

  try {

    const booth = await Booth.create(req.body);

    res.status(201).json({
      success: true,
      message: "Booth created successfully",
      booth,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// GET ALL
const getMyBooths = async (req, res) => {

  try {

    const booths = await Booth.find();

    res.json({
      success: true,
      booths,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

//GET SINGLE
const getSingleBooth = async (req, res) => {

  try {

    const booth = await Booth.findById(req.params.id);

    if (!booth) {
      return res.status(404).json({
        success: false,
        message: "Booth not found",
      });
    }

    res.json({
      success: true,
      booth,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// DELETE
const deleteBooth = async (req, res) => {

  try {

    await Booth.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Booth deleted",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  createBooth,
  getMyBooths,
  getSingleBooth,
  deleteBooth,
};