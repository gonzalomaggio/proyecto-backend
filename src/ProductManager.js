import fs from "fs";

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.productIdCounter = 1;
    this.products = [];
    this.loadFromFile();
  }

  loadFromFile() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      this.products = JSON.parse(data);
      if (this.products.length > 0) {
        const lastProduct = this.products[this.products.length - 1];
        this.productIdCounter = lastProduct.id + 1;
      }
    } catch (error) {
      console.error("Error loading product data from file:", error.message);
    }
  }

  saveToFile() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), "utf8");
    } catch (error) {
      console.error("Error saving product data to file:", error.message);
    }
  }

  addProduct(productData) {
    const { title, description, price, code, stock, category, thumbnails } = productData;

    if (!(title && description && price && code && stock)) {
      throw new Error("All fields are required.");
    }

    const codeExists = this.products.some(product => product.code === code);
    if (codeExists) {
      throw new Error("The product code already exists.");
    }

    const newProduct = {
      id: this.productIdCounter,
      title,
      description,
      price,
      code,
      stock,
      status: true,
      category,
      thumbnails: thumbnails || []
    };

    this.products.push(newProduct);
    this.productIdCounter++;
    this.saveToFile();
  }

  getAllProducts() {
    return this.products;
  }

  getProductById(productId) {
    return this.products.find(product => product.id === productId);
  }

  updateProduct(productId, updatedFields) {
    const productIndex = this.products.findIndex(product => product.id === productId);
    if (productIndex === -1) {
      console.log("Product not found.");
      return;
    }

    this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
    this.saveToFile();
  }

  deleteProduct(productId) {
    const updatedProducts = this.products.filter(product => product.id !== productId);
    if (updatedProducts.length === this.products.length) {
      console.log("Product not found.");
      return;
    }

    this.products = updatedProducts;
    this.saveToFile();
  }
}

const productManager = new ProductManager("./src/products.json");
export default productManager;
