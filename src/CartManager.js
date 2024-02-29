/* import fs from "fs";

class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.carts = [];
    this.loadFromFile();
  }

  loadFromFile() {
    try {
      const data = fs.readFileSync(this.filePath, "utf8");
      this.carts = JSON.parse(data) || [];
    } catch (error) {
      console.error("Error loading carts from file:", error.message);
    }
  }

  saveToFile() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.carts, null, 2), "utf8");
    } catch (error) {
      console.error("Error saving carts to file:", error.message);
    }
  }

  generateUniqueId() {
    return this.carts.length + 1;
  }

  createCart() {
    const cartId = this.generateUniqueId();
    const cart = { id: cartId, products: [] };

    this.carts.push(cart);
    this.saveToFile();

    return cart;
  }

  getCartById(cartId) {
    const numericCartId = parseInt(cartId, 10);
    return this.carts.find(cart => cart.id === numericCartId);
  }


  addProductToCart(cartId, productId, quantity = 1) {
    const numericCartId = parseInt(cartId, 10);
    const cart = this.getCartById(numericCartId);

    if (cart) {
      const existingProductIndex = cart.products.findIndex(product => product.product === productId);

      if (existingProductIndex !== -1) {

        cart.products[existingProductIndex].quantity += quantity;
      } else {

        cart.products.push({ product: productId, quantity });
      }

      this.saveToFile();
      return cart;
    }

    return null;
  }

}

const cartManager = new CartManager("./src/carts.json");
export default cartManager;
 */