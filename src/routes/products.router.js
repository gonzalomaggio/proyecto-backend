import express from "express";
import ProductsDAO from "../daos/products.dao.js";
import upload from "../utils/upload.middleware.js";

const routerProduct = express.Router();

routerProduct.get("/admin", (req, res) => {
  res.render("admin");
});

routerProduct.get("/new", (req, res) => {
  res.render("new-product");
});

routerProduct.get("/update", (req, res) => {
  res.render("update-product");
});

routerProduct.get("/delete", (req, res) => {
  res.render("delete-product");
});

routerProduct.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const withStock = req.query.stock;

    let products;
    if (withStock !== undefined && withStock.toLowerCase() === 'true') {
      products = await ProductsDAO.getAllWithStock();
    } else {
      products = await ProductsDAO.getAll();
    }

    if (limit !== undefined) {
      products = products.slice(0, limit);
    }

    res.render("products", { products });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching products");
  }
});


routerProduct.get("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    console.log("Product ID:", productId);

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

routerProduct.post("/", upload.single('image'), async (req, res) => {
  try {
    console.log("Received product data:", req.body);
    const filename = req.file.filename;
    const product = req.body;

    await ProductsDAO.add(product.title, product.description, filename, product.price, product.stock);
    res.status(201).send("Product added successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

routerProduct.put("/:pid", upload.single('image'), async (req, res) => {
  const productId = req.params.pid;
  const updatedData = req.body;

  try {

    let filename;
    if (req.file) {
      filename = req.file.filename;
    } else {

      const product = await ProductsDAO.getById(productId);
      filename = product.photo;
    }


    const updatedProduct = await ProductsDAO.update(productId, { ...updatedData, photo: filename });


    res.status(200).send("Producto actualizado correctamente");
  } catch (error) {

    console.error(error);
    res.status(500).send("Error al actualizar el producto");
  }
});

routerProduct.delete("/:pid", async (req, res) => {
  const productId = req.params.pid;
  await ProductsDAO.remove(productId);
  res.send("Product deleted successfully");
});

export default routerProduct;

