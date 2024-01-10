const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.productIdCounter = 1;
    this.products = [];
    this.loadFromFile();
  }

  loadFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
      if (this.products.length > 0) {
        const lastProduct = this.products[this.products.length - 1];
        this.productIdCounter = lastProduct.id + 1;
      }
    } catch (error) {
      console.error('Error loading data from file:', error.message);
    }
  }


  saveToFile() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving data to file:', error.message);
    }
  }

  addProduct(productData) {
    const { title, description, price, thumbnail, code, stock } = productData;
    if (!(title && description && price && thumbnail && code && stock)) {
      console.log('Todos los campos son obligatorios.');
      return;
    }

    const codeExists = this.products.some(product => product.code === code);
    if (codeExists) {
      console.log('El código del producto ya existe.');
      return;
    }

    const newProduct = {
      id: this.productIdCounter,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);
    this.productIdCounter++;
    this.saveToFile();
  }

  getProducts() {
    return this.products;
  }

  getProducts(limit) {
    if (limit !== undefined) {
      return this.products.slice(0, limit);
    } else {
      return this.products;
    }
  }


  getProductById(id) {
    const product = this.products.find(product => product.id === id);
    if (!product) {
      console.log("Producto no encontrado.");
    } else {
      return product;
    }
  }

  updateProduct(productId, updatedFields) {
    const productIndex = this.products.findIndex(product => product.id === productId);
    if (productIndex === -1) {
      console.log("Producto no encontrado.");
      return;
    }

    this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
    this.saveToFile();
  }

  deleteProduct(productId) {
    const updatedProducts = this.products.filter(product => product.id !== productId);
    if (updatedProducts.length === this.products.length) {
      console.log("Producto no encontrado.");
      return;
    }

    this.products = updatedProducts;
    this.saveToFile();
  }
}

const manager = new ProductManager("products.json");

// Ejemplo de uso:
manager.addProduct({
  title: 'Nuevo Producto',
  description: 'Descripción del nuevo producto',
  price: 2500,
  thumbnail: 'imagen.jpg',
  code: 'P005',
  stock: 50,
});

manager.addProduct({
  title: 'Remera',
  description: 'Descripción del nuevo producto',
  price: 3600,
  thumbnail: 'imagen.jpg',
  code: 'P008',
  stock: 20,
});

const productList = manager.getProducts();
console.log(productList);

module.exports = manager;