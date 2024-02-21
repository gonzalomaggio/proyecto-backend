import express from "express";
import CartDAO from "../daos/carts.dao.js";
import upload from "../utils/upload.middleware.js";

const routerCart = express.Router();

routerCart.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await CartDAO.getCartById(cartId);
    res.render("cart", { cart: cart });
  } catch (error) {
    res.status(404).send("Cart not found");
  }
});

routerCart.post("/", async (req, res) => {
  const productId = req.body.productId;
  const quantity = req.body.quantity || 1;

  try {
    
    await CartDAO.addToCart(productId, quantity);
    res.redirect("/api/carts"); 
  } catch (error) {
    res.status(500).send("Error adding product to cart");
  }
});

routerCart.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;
  try {
    const cart = await CartDAO.addProductToCart(cartId, productId, quantity);
    res.json(cart);
  } catch (error) {
    if (error.message === "Cart not found") {
      res.status(404).send("Cart not found");
    } else {
      res.status(500).send("Error adding product to cart");
    }
  }
});

export default routerCart;
