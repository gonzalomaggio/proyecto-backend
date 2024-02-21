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
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const sortDirection = req.query.sort === 'desc' ? -1 : 1;
    const sort = req.query.sort ? { price: sortDirection } : null;
    const query = req.query.query || '';
    const withStock = req.query.stock && req.query.stock.toLowerCase() === 'true';
    const categoryFilter = req.query.category || ''; 

    let filter = {};
    if (categoryFilter !== '') { 
      filter.category = categoryFilter; 
    }

    if (withStock) {
      filter.stock = { $gt: 0 };
    }

    const result = await ProductsDAO.getAllPaginated(filter, page, limit, sort);

    
    const categories = await ProductsDAO.getCategories();

    
    const prevLink = result.hasPrevPage ? `/api/products?page=${page - 1}&limit=${limit}` : null;
    const nextLink = result.hasNextPage ? `/api/products?page=${page + 1}&limit=${limit}` : null;

    res.render("products", {
      products: result.docs,
      categories: categories,
      prevLink: prevLink,
      nextLink: nextLink
    });
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
      category: product.category,
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

    await ProductsDAO.add(product.title, product.description, product.category, filename, product.price, product.stock);
    res.status(201).send("Product added successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

routerProduct.put("/", upload.single('image'), async (req, res) => {
  const productId = req.body.pid;
  const updatedData = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
    stock: req.body.stock
  };

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

routerProduct.delete("/", async (req, res) => {
  const productId = req.body.pid;
  try {
    await ProductsDAO.remove(productId);
    res.send("Product deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting product");
  }
});

export default routerProduct;
