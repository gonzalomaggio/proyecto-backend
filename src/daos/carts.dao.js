import Cart from "../schemas/carts.schema.js";

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

      const existingCartItem = await Cart.findOne({ "items.productId": productId });

      if (existingCartItem) {

        await Cart.findOneAndUpdate(
          { "items.productId": productId },
          { $inc: { "items.$.quantity": quantity } }
        );
      } else {

        await Cart.findOneAndUpdate(
          {},
          { $push: { items: { productId: productId, quantity: quantity } } },
          { upsert: true }
        );
      }


      const updatedCart = await Cart.findOne();
      return updatedCart;
    } catch (error) {
      throw new Error("Error adding product to cart");
    }
  }


}

export default CartDAO;
