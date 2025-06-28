const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // Import middleware auth
const Subscription = require("../models/subscription.model");
const User = require("../models/user.model"); // Kita butuh ini untuk mengaitkan subscription dengan user

// @route   POST /api/subscriptions
// @desc    Create a new subscription
// @access  Private (hanya untuk user yang login)
router.post("/", auth, async (req, res) => {
  // Terapkan 'auth' middleware di sini
  try {
    const { plan, mealTypes, deliveryDays, allergies, totalPrice } = req.body;

    const user = await User.findById(req.user.id).select("-password");

    const newSubscription = new Subscription({
      user: req.user.id, // Kaitkan dengan ID user yang login
      name: user.fullName, // Ambil dari data user
      phone: req.body.phone, // Asumsikan user memasukkan no telp di form
      plan,
      mealTypes,
      deliveryDays,
      allergies,
      totalPrice,
    });

    const subscription = await newSubscription.save();
    res.status(201).json(subscription);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/my", auth, async (req, res) => {
  try {
    // Cari semua subscription yang field 'user'-nya cocok dengan id dari user yang login
    const subscriptions = await Subscription.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(subscriptions);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body; // status bisa 'paused' atau 'cancelled'

    let subscription = await Subscription.findById(req.params.id);

    if (!subscription)
      return res.status(404).json({ msg: "Subscription not found" });

    // Pastikan user yang mengubah adalah pemilik subscription
    if (subscription.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    subscription.status = status;
    await subscription.save();
    res.json(subscription);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
