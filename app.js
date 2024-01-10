const ProductManager = require("./ProductManager");

const express = require("express");
const app = express();

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await ProductManager.getProducts(limit);
    res.send(products);
  } catch (error) {
    res.status(500).send("Error obteniendo los productos");
  }
});

app.get("/products/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await ProductManager.getProductById(productId);
    if (!product) {
      res.status(404).send("Producto no encontrado");
    } else {
      res.send(product);
    }
  } catch (error) {
    res.status(500).send("Error obteniendo el producto");
  }
});




app.listen(3000, () => {
  console.log("Aplicacion funcionando en el puerto 3000")
}) 