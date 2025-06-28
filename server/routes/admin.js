// // server/routes/admin.js
// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const adminAuth = require("../middleware/adminAuth");
// const Subscription = require("../models/subscription.model");

// // @route   GET /api/admin/metrics
// // @desc    Get business metrics
// // @access  Admin Only
// router.get("/metrics", [auth, adminAuth], async (req, res) => {
//   try {
//     // Default ke 30 hari terakhir jika tidak ada query
//     const endDate = req.query.endDate
//       ? new Date(req.query.endDate)
//       : new Date();
//     const startDate = req.query.startDate
//       ? new Date(req.query.startDate)
//       : new Date(new Date().setDate(endDate.getDate() - 30));

//     const newSubscriptions = await Subscription.countDocuments({
//       createdAt: { $gte: startDate, $lte: endDate },
//     });

//     const mrrResult = await Subscription.aggregate([
//       { $match: { status: "active" } },
//       { $group: { _id: null, total: { $sum: "$totalPrice" } } },
//     ]);
//     const monthlyRecurringRevenue =
//       mrrResult.length > 0 ? mrrResult[0].total : 0;

//     // Untuk Reactivations, kita hitung yang statusnya 'active' tapi pernah di-pause
//     const reactivations = await Subscription.countDocuments({
//       status: "active",
//       pauseStartDate: { $exists: true }, // Asumsi sederhana: jika pernah di-pause, itu reaktivasi
//     });

//     const subscriptionGrowth = await Subscription.countDocuments({
//       status: "active",
//     });

//     res.json({
//       newSubscriptions,
//       monthlyRecurringRevenue,
//       reactivations,
//       subscriptionGrowth,
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server Error");
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const Subscription = require("../models/subscription.model");
const User = require("../models/user.model");

// PENTING: Terapkan middleware untuk semua route di file ini
// Setiap request ke /api/admin/... akan melewati pengecekan ini terlebih dahulu
router.use(auth, adminAuth);

// @route   GET /api/admin/metrics
// @desc    Get business metrics
// @access  Admin Only
router.get("/metrics", async (req, res) => {
  try {
    const endDate = req.query.endDate
      ? new Date(req.query.endDate)
      : new Date();
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : new Date(new Date().setDate(endDate.getDate() - 30));

    const newSubscriptions = await Subscription.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const mrrResult = await Subscription.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const monthlyRecurringRevenue =
      mrrResult.length > 0 ? mrrResult[0].total : 0;

    const reactivations = await Subscription.countDocuments({
      status: "active",
      pauseStartDate: { $exists: true },
    });
    const subscriptionGrowth = await Subscription.countDocuments({
      status: "active",
    });

    res.json({
      newSubscriptions,
      monthlyRecurringRevenue,
      reactivations,
      subscriptionGrowth,
    });
  } catch (error) {
    console.error("Metrics Error:", error.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/admin/subscriptions
// @desc    Get ALL user subscriptions
// @access  Admin Only
router.get("/subscriptions", async (req, res) => {
  // <-- PASTIKAN PATH-NYA '/subscriptions'
  try {
    const subscriptions = await Subscription.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (error) {
    console.error("Get All Subscriptions Error:", error.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/admin/subscriptions/:id
// @desc    Update a subscription by ID
// @access  Admin Only
router.put("/subscriptions/:id", async (req, res) => {
  // <-- PASTIKAN PATH-NYA '/subscriptions/:id'
  try {
    const { plan, status, phone } = req.body;
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ msg: "Subscription not found" });
    }

    if (plan) subscription.plan = plan;
    if (status) subscription.status = status;
    if (phone) subscription.phone = phone;

    await subscription.save();
    const updatedSubscription = await Subscription.findById(
      req.params.id
    ).populate("user", "fullName email");
    res.json(updatedSubscription);
  } catch (error) {
    console.error("Update Subscription Error:", error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
