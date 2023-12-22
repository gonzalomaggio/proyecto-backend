class ProductManager {
  constructor() {
    this.products = [];
    this.productIdCounter = 1;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title && !description && !price && !thumbnail && !code && !stock) {
      console.log("Todos los campos son obligatorios.");
      return;
    }

    const codeExists = this.products.some(product => product.code === code);
    if (codeExists) {
      console.log("El código del producto ya existe.");
      return;
    }

    const newProduct = {
      id: this.productIdCounter,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    };

    this.products.push(newProduct);
    this.productIdCounter++;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(product => product.id === id);
    if (!product) {
      console.log("Producto no encontrado.");
    } else {
      return product;
    }
  }
}

const manager = new ProductManager();


manager.addProduct("Camisa", "Camisa de algodón para hombres", 1500, "camisa.jpg", "P001", 100);
manager.addProduct("Pantalón", "Pantalón de gabardina para mujeres", 2000, "pantalon.jpg", "P002", 80);
manager.addProduct("Zapatillas", "Zapatillas deportivas unisex", 5000, "zapatos.jpg", "P003", 120);
manager.addProduct("Sombrero", "Sombrero de verano estilo panamá", 1000, "sombrero.jpg", "P004", 60);


const productList = manager.getProducts();
console.log(productList);


console.log(manager.getProductById(2));
console.log(manager.getProductById(5)); 
