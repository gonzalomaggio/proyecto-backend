import Router from "express";
import passport from "passport";


const routerSessions = Router()

routerSessions.post("/register", passport.authenticate("register", { failureRedirect:"/api/sessions/failregister"}), async (req, res) => {
  
  res.send({status:"success", message:"User registred"})
    
});

routerSessions.get("/failregister", async(req,res)=> {
  console.log("Failed strategy");
  res.send({ error: "Failed" })
});

routerSessions.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }), async (req, res) => {
  
  if (!req.user) return res.status(400).send({ status: "error", error: "invalid credentials" })
  req.session.user = {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    age: req.user.age,
    email: req.user.email
  }
  res.redirect("/profile")
});

routerSessions.get("/faillogin", (req, res) => {
  res.send({ error: "Failed login" })
});

routerSessions.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/home");
  })
})

routerSessions.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

routerSessions.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
  req.session.user = req.user;
  res.redirect("/profile")
})

export default routerSessions;