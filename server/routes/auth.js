const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const auth = require("../middleware/auth");

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  [
    // Validasi input menggunakan express-validator
    check("fullName", "Full name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Password must be 8 or more characters with a number, an uppercase and a lowercase letter"
    )
      .isLength({ min: 8 })
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password } = req.body;

    try {
      // 1. Cek apakah user sudah ada
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }

      // 2. Jika belum ada, buat user baru
      user = new User({ fullName, email, password });

      // 3. Hash password sebelum disimpan
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // 4. Simpan user ke database
      await user.save();

      res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // 1. Cek apakah user ada
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      // 2. Bandingkan password yang diinput dengan yang ada di DB
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      // 3. Jika password cocok, buat dan kirim JWT
      const payload = {
        user: {
          id: user.id, // ID user dari MongoDB
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET, // Kunci rahasia dari file .env
        { expiresIn: "7d" }, // Token berlaku selama 7 hari
        (err, token) => {
          if (err) throw err;
          res.json({ token, role: user.role }); // Kirim token ke client
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get logged in user's data
// @access  Private
router.get("/me", auth, async (req, res) => {
  // Perhatikan penggunaan middleware 'auth' di sini.
  // Ini memastikan hanya user dengan token valid yang bisa akses.
  try {
    // req.user.id didapat dari token yang sudah diverifikasi oleh middleware 'auth'
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Kirim data user (tanpa password) sebagai respon
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
