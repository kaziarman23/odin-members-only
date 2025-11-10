const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User } = require("../models");

// --- SIGNUP FORM ---
router.get("/signup", (req, res) => res.render("signup"));

router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, isAdmin } =
      req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      req.flash("error", "Please fill in all fields");
      return res.redirect("/auth/signup");
    }
    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match");
      return res.redirect("/auth/signup");
    }
    if (password.length < 8) {
      req.flash("error", "Password must be at least 8 characters");
      return res.redirect("/auth/signup");
    }

    // Sanitize email
    const emailLower = String(email).trim().toLowerCase();

    // Check for existing user
    const existing = await User.findOne({ where: { email: emailLower } });
    if (existing) {
      req.flash("error", "Email already in use");
      return res.redirect("/auth/signup");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create new user
    const user = await User.create({
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      email: emailLower,
      passwordHash,
      isAdmin: isAdmin === "on", // demo-only admin checkbox
    });

    // Log in after signup
    req.login(user, (err) => {
      if (err) throw err;
      req.flash("success", "Signed up successfully!");
      return res.redirect("/");
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Error signing up");
    res.redirect("/auth/signup");
  }
});

// --- LOGIN ---
router.get("/login", (req, res) => res.render("login"));

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

// --- LOGOUT ---
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully");
    res.redirect("/");
  });
});

// --- JOIN THE CLUB (membership) ---
router.get("/join-club", (req, res) => {
  res.render("join-club");
});

router.post("/join-club", async (req, res) => {
  if (!req.user) {
    req.flash("error", "You must be logged in to join the club.");
    return res.redirect("/auth/login");
  }

  const { passcode } = req.body;
  if (!passcode) {
    req.flash("error", "Please enter the passcode.");
    return res.redirect("/auth/join-club");
  }

  if (passcode === process.env.CLUB_PASSCODE) {
    req.user.isMember = true;
    await req.user.save();
    req.flash("success", "Welcome to the club!");
    res.redirect("/");
  } else {
    req.flash("error", "Incorrect passcode.");
    res.redirect("/auth/join-club");
  }
});

module.exports = router;
