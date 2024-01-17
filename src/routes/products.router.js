import express from "express";
import productManager from "../ProductManager.js";

const routerProduct = express.Router();

routerProduct.get("/", (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const products = productManager.getAllProducts();
  res.json(limit ? products.slice(0, limit) : products);
});

routerProduct.get("/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductById(productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send("Product not found");
  }
});

routerProduct.post("/", (req, res) => {
  try {
    const productData = req.body;
    productManager.addProduct(productData);
    res.status(201).send("Product added successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

routerProduct.put("/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedFields = req.body;
  productManager.updateProduct(productId, updatedFields);
  res.send("Product updated successfully");
});

routerProduct.delete("/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);
  productManager.deleteProduct(productId);
  res.send("Product deleted successfully");
});

export default routerProduct;
