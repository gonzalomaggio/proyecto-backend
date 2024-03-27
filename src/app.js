import express from "express";
import http from 'http';
import { Server } from "socket.io";
import handlebars from 'express-handlebars';
import routerProduct from "./routes/products.router.js";
import routerCart from "./routes/carts.router.js";
import routerSessions from "./routes/sessions.router.js";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import initializePassport from "./utils/passport.config.js";
import initializePassportGithub from "./utils/passport-github2.js";
import passport from "./utils/passport.jwt.js";

const app = express();
const server = http.createServer(app);
const socketServer = new Server(server);

mongoose.connect("mongodb+srv://gonzalomaggiofs:bahia123@ecommerce.kqcrjmj.mongodb.net/ecommerce?retryWrites=true&w=majority").then(() => {
  console.log("MongoDB connected successfully");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.engine('handlebars', handlebars.engine());
app.set('views', join(__dirname, '/views'));
app.set('view engine', 'handlebars');

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.static(join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cookieParser("secret_code")); 


app.use(session({
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://gonzalomaggiofs:bahia123@ecommerce.kqcrjmj.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ecommerce",
    ttl: 15,
  }),
  secret: "secretCode", 
  resave: true,
  saveUninitialized: true,
}));

initializePassportGithub();
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/sessions", routerSessions);
app.use("/api/products", routerProduct);
app.use("/api/carts", routerCart);

app.get("/", (req, res) => {
  res.redirect("home");
});

app.get("/home", (req, res) => {
  if (req.session.user) {
    res.redirect("profile");
  } else {
    res.render("home")
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/profile");
  } else {
    res.render("login");
  }
});

app.get("/profile", async (req, res) => {
  if (req.user) {
    res.render("profile", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
