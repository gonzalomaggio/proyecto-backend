import express from "express";
import routerProduct from "./routes/products.router.js";
import routerCart from "./routes/carts.router.js";

const app = express();

app.use(express.json());
app.use("/api/products", routerProduct);
app.use("/api/carts", routerCart);




app.get("/ping", (req, res) => {
  res.send("pong");
});

app.listen(8080, () => {
  console.log("App running on port 8080");
});
