require("dotenv").config();
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { sequelize, User } = require("./models");

const app = express();

// View engine setup
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// --- Session + Flash setup ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// --- Passport setup ---
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          where: { email: email.toLowerCase() },
        });
        if (!user)
          return done(null, false, { message: "Invalid email or password." });

        const isValid = await user.validatePassword(password);
        if (!isValid)
          return done(null, false, { message: "Invalid email or password." });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// --- Middleware to expose user + flash messages to all views ---
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.messages = req.flash();
  next();
});

// --- Routes ---
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/messages", require("./routes/messages"));

// --- Start Server ---
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // Auto create tables during dev
    console.log("✅ Database connected and synced.");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error starting app:", err);
  }
})();
