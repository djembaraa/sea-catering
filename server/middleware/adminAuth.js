// server/middleware/adminAuth.js
const adminAuth = (req, res, next) => {
  // Middleware ini harus dijalankan SETELAH middleware 'auth'
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ msg: "Access denied. Admin resource." });
  }
};

module.exports = adminAuth;
