const express = require("express");
const router = express.Router();
const { Message, User } = require("../models");

// Middleware to ensure user is logged in
function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("error", "Please log in first.");
  res.redirect("/auth/login");
}

// Middleware to ensure admin
function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) return next();
  req.flash("error", "Admins only.");
  res.redirect("/");
}

// --- CREATE NEW MESSAGE ---
router.get("/new", ensureLoggedIn, (req, res) => {
  res.render("new-message");
});

router.post("/new", ensureLoggedIn, async (req, res) => {
  const { title, text } = req.body;
  if (!title || !text) {
    req.flash("error", "Title and message text are required.");
    return res.redirect("/messages/new");
  }

  try {
    await Message.create({
      title: String(title).trim(),
      text: String(text).trim(),
      authorId: req.user.id,
    });
    req.flash("success", "Message created successfully!");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create message.");
    res.redirect("/messages/new");
  }
});

// --- DELETE MESSAGE (ADMIN ONLY) ---
router.post("/:id/delete", ensureAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const msg = await Message.findByPk(id);
    if (!msg) {
      req.flash("error", "Message not found.");
      return res.redirect("/");
    }
    await msg.destroy();
    req.flash("success", "Message deleted.");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    req.flash("error", "Error deleting message.");
    res.redirect("/");
  }
});

module.exports = router;
