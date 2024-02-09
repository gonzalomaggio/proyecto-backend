import express from "express";
import ProductsDAO from "../daos/products.dao.js";
import upload from "../utils/upload.middleware.js";

const routerProduct = express.Router();

routerProduct.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const withStock = req.query.stock;

    let products;
    if (withStock === undefined) {
      products = await ProductsDAO.getAll();
    } else {
      products = await ProductsDAO.getAllWithStock();
    }

    if (limit !== undefined) {
      products = products.slice(0, limit);
    }

    res.render("home", { products });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching products");
  }
});

routerProduct.get("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);

    if (!productId || isNaN(productId)) {
      return res.redirect("/products");
    }

    const product = await ProductsDAO.getById(productId);

    if (!product) {
      return res.status(404).render("404", { message: "Product not found" });
    }

    res.render("product", {
      title: product.title,
      description: product.description,
      photo: product.photo,
      price: product.price,
      isStock: product.stock > 0
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

routerProduct.get("/new", (req, res) => {
  res.render("new-product");
});

routerProduct.post("/", upload.single('image'), async (req, res) => {
  try {
    const filename = req.file.filename;
    const product = req.body;

    await ProductsDAO.add(product.title, product.description, filename, product.price, product.stock);
    res.status(201).send("Product added successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

routerProduct.put("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedFields = req.body;
  await ProductsDAO.update(productId, updatedFields);
  res.send("Product updated successfully");
});

routerProduct.delete("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  await ProductsDAO.remove(productId);
  res.send("Product deleted successfully");
});

export default routerProduct;
