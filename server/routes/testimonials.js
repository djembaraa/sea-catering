const express = require("express");
const router = express.Router();
const Testimonial = require("../models/testimonial.model");

// @route   POST /api/testimonials
// @desc    Create a new testimonial
// @access  Public
router.post("/", async (req, res) => {
  const { name, review, rating } = req.body;

  // Validasi sederhana
  if (!name || !review || !rating) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const newTestimonial = new Testimonial({
      name,
      review,
      rating,
    });

    const testimonial = await newTestimonial.save();
    res.status(201).json(testimonial); // Kirim kembali data yang baru dibuat
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/testimonials
// @desc    Get all testimonials
// @access  Public
router.get("/", async (req, res) => {
  try {
    // Ambil 5 testimoni terbaru, diurutkan dari yang paling baru
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(testimonials);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
