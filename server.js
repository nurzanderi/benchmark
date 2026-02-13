const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const AUTH_USERNAME = process.env.AUTH_USERNAME;
const AUTH_PASSWORD_HASH = process.env.AUTH_PASSWORD_HASH;
const SESSION_SECRET = process.env.SESSION_SECRET || "change-me-in-production";

// Trust Railway's reverse proxy for secure cookies over HTTPS
app.set("trust proxy", 1);

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Login page — served without auth
app.get("/login", (req, res) => {
  if (req.session.authenticated) {
    return res.redirect("/");
  }
  res.sendFile(path.join(__dirname, "login.html"));
});

// Login form submission
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!AUTH_USERNAME || !AUTH_PASSWORD_HASH) {
    return res.redirect("/login?error=server");
  }

  if (
    username === AUTH_USERNAME &&
    (await bcrypt.compare(password, AUTH_PASSWORD_HASH))
  ) {
    req.session.authenticated = true;
    return res.redirect("/");
  }

  res.redirect("/login?error=invalid");
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// Auth middleware for all other routes
app.use((req, res, next) => {
  if (req.session.authenticated) {
    return next();
  }
  res.redirect("/login");
});

// Serve static files only for authenticated users
app.use(express.static(path.join(__dirname, "public")));

// SPA fallback — serve index.html for any unmatched route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
