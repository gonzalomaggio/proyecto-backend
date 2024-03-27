import Cart from "../schemas/carts.schema.js";
import Product from "../schemas/products.schema.js"; // Importar el esquema del producto

class CartDAO {
  static async getCartById(cartId) {
    try {
      const cart = await Cart.findById(cartId);
      return cart;
    } catch (error) {
      throw new Error("Error fetching cart by ID");
    }
  }

  static async createCart(cartId) {
    try {
      const cart = await Cart.create({ _id: cartId, items: [] });
      return cart;
    } catch (error) {
      throw new Error("Error creating cart");
    }
  }

  static async addToCart(productId, quantity) {
    try {
      console.log("Received request to add product to cart. Product ID:", productId, "Quantity:", quantity);
      let cart = await Cart.findOne();

      if (!cart) {
        cart = await Cart.create({ items: [] });
      }

      if (!cart.items) {
        cart.items = [];
      }

      const existingCartItemIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString());

      if (existingCartItemIndex !== -1) {
        cart.items[existingCartItemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      const productPrice = product.price;

      cart.totalPrice = cart.items.reduce((total, item) => {
        return total + (item.quantity * productPrice); // Usar el precio del producto
      }, 0);

      await cart.save();

      console.log("Cart after adding product:", cart);
      return cart;
    } catch (error) {
      console.error("Error adding product to cart:", error);
      throw new Error("Error adding product to cart");
    }
  }

}

export default CartDAO;
