import Router from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const routerSessions = Router();

// POST route for user registration
routerSessions.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }), async (req, res) => {
  res.send({ status: "success", message: "User registered" });
});

// GET route for failed registration
routerSessions.get("/failregister", async (req, res) => {
  console.log("Failed registration strategy");
  res.send({ error: "Failed" });
});

// POST route for user login
routerSessions.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }), async (req, res) => {
  if (!req.user) return res.status(400).send({ status: "error", error: "Invalid credentials" });

  // Create JWT token
  let token = jwt.sign({
    id: req.user._id
  }, "secret_jwt", { expiresIn: "1h" }); 

  // Set JWT token in cookie
  res.cookie("jwt", token, { httpOnly: true, secure: true, maxAge: 3600000 }); 
  res.redirect("/profile");
});

// GET route for current user
routerSessions.get("/current", passport.authenticate("jwt"), (req, res) => {
  console.log(req);
  res.send(req.user);
});

// GET route for failed login
routerSessions.get("/faillogin", (req, res) => {
  res.send({ error: "Failed login" });
});

// GET route for user logout
routerSessions.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie('jwt'); 
    res.redirect("/home");
  });
});

// GET route for GitHub authentication
routerSessions.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { });

// GET route for GitHub authentication callback
routerSessions.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
  req.session.user = req.user;
  res.redirect("/profile");
});

export default routerSessions;
