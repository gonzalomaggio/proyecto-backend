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
      console.log(id);
      return await Products.findOne({ _id: id }).lean();
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      return null;
    }
  }

  static async add(title, description, category, photo, price, stock) {
    try {
      if (!(title && description && category && price && photo && stock)) {
        throw new Error("All fields are required.");
      }
      const newProduct = new Products({ title, description, category, photo, price, stock });
      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.log("Error adding product:", error);
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

  static async getCategories() {
    try {
      const categories = await Products.distinct("category");
      return categories;
    } catch (error) {
      throw new Error("Error fetching categories");
    }
  }

  static async getFilteredAndSorted(filter, page, limit, sort) {
    try {
      const aggregationPipeline = [];


      aggregationPipeline.push({ $match: filter });


      if (sort) {
        aggregationPipeline.push({ $sort: sort });
      }


      const skip = (page - 1) * limit;
      aggregationPipeline.push({ $skip: skip });
      aggregationPipeline.push({ $limit: limit });


      const result = await Products.aggregate(aggregationPipeline);


      const totalDocs = await Products.countDocuments(filter);


      const totalPages = Math.ceil(totalDocs / limit);


      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      return {
        docs: result,
        totalDocs: totalDocs,
        totalPages: totalPages,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage
      };
    } catch (error) {
      throw new Error("Error fetching filtered and sorted products");
    }
  }

  static async getAllPaginated(filter, page, limit, sort) {
    try {

      console.log("Filter in getAllPaginated:", filter);
      console.log("Page in getAllPaginated:", page);
      console.log("Limit in getAllPaginated:", limit);
      console.log("Sort in getAllPaginated:", sort);
      // Obtener el número total de documentos que coinciden con el filtro
      const totalDocs = await Products.countDocuments(filter);

      // Calcular el número total de páginas
      const totalPages = Math.ceil(totalDocs / limit);

      // Calcular el índice de salto (skip) para la paginación
      const skip = (page - 1) * limit;

      // Obtener los documentos paginados
      const result = await Products.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();


      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      return {
        docs: result,
        totalDocs: totalDocs,
        totalPages: totalPages,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage
      };
    } catch (error) {
      throw new Error("Error fetching paginated products");
    }
  }


}

export default ProductsDAO;
