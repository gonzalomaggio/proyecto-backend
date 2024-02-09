import Products from "../schemas/products.schema.js";

class ProductsDAO {

  static async getAll() {
    try {
      return await Products.find().lean();
    } catch (error) {
      throw new Error("Error fetching products");
    }
  }

  static async getAllWithStock() {
    try {
      return await Products.find({ stock: { $gt: 0 } }).lean();
    } catch (error) {
      throw new Error("Error fetching products with stock");
    }
  }

  static async getById(id) {
    try {
      return await Products.findOne({ _id: id }).lean();
    } catch (error) {
      throw new Error("Error fetching product by ID");
    }
  }

  static async add(title, description, photo, price, stock) {
    try {
      if (!(title && description && price && photo && stock)) {
        throw new Error("All fields are required.");
      }
      return await new Products({ title, description, photo, price, stock }).save();
    } catch (error) {
      throw new Error("Error adding product");
    }
  }

  static async update(id, data) {
    try {
      return await Products.findByIdAndUpdate(id, data);
    } catch (error) {
      throw new Error("Error updating product");
    }
  }

  static async remove(id) {
    try {
      return await Products.findByIdAndDelete(id);
    } catch (error) {
      throw new Error("Error deleting product");
    }
  }
}

export default ProductsDAO;
