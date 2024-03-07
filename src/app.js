import express from "express";
import http from 'http';
import { Server } from "socket.io";
import handlebars from 'express-handlebars';
import routerProduct from "./routes/products.router.js";
import routerCart from "./routes/carts.router.js";
import UsersDAO from "./daos/users.dao.js";
import routerSessions from "./routes/sessions.router.js" 
/* import routerViews from "./routes/views.router.js"; */
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
/* import fs from "fs"; */
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import initializePassport from "./utils/passport.config.js";
import initializePassportGithub from "./utils/passport-github2.js";


const app = express();
const server = http.createServer(app);
const socketServer = new Server(server);
mongoose.connect("mongodb+srv://gonzalomaggiofs:bahia123@ecommerce.kqcrjmj.mongodb.net/ecommerce?retryWrites=true&w=majority",).then(() => {
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
app.use(express.urlencoded({ extended: true }))
app.use("/api/products", routerProduct);
app.use("/api/carts", routerCart);
app.use(cookieParser());
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



/* app.use('/', routerViews); */
/* app.use("/realtimeproducts", routerViews); */


app.get("/", (req, res) => {
  res.redirect("home");
});

app.get("/home", (req, res) => {

  if (req.session.user) {
    res.redirect("profile");
  } else {
    res.render("home")
  }
})
  
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

/* app.use((req, res, next) => {
  res.render("404");
}); */

/* socketServer.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });


  socket.on('addProduct', (newProduct) => {

    const productsFilePath = join(__dirname, 'products.json');
    const productsData = fs.readFileSync(productsFilePath, 'utf-8');
    let updatedProducts = JSON.parse(productsData);


    updatedProducts.push(newProduct);


    fs.writeFileSync(productsFilePath, JSON.stringify(updatedProducts, null, 2));


    socketServer.emit('updateProducts', updatedProducts);
  });
}); */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error interno del servidor');
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
