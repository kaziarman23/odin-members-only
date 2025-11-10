const express = require("express");
const router = express.Router();
const { Message, User } = require("../models");

// Home page - show all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        { model: User, as: "author", attributes: ["firstName", "lastName"] },
      ],
    });

    res.render("home", { messages });
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to load messages.");
    res.redirect("/");
  }
});

module.exports = router;
