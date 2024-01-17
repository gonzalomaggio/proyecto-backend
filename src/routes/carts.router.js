import express from "express";
import cartManager from "../CartManager.js";

const routerCart = express.Router();

routerCart.get("/:cid", (req, res) => {
  const cartId = req.params.cid;
  const cart = cartManager.getCartById(cartId);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).send("Cart not found");
  }
});

routerCart.post("/", (req, res) => {
  const cartId = req.body.id;
  const cart = cartManager.createCart(cartId);
  res.status(201).json(cart);
});

routerCart.post("/:cid/product/:pid", (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  const cart = cartManager.addProductToCart(cartId, productId, quantity);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).send("Cart not found");
  }
});

export default routerCart;
