import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const ProductsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  photo: {
    type: String
  }
},);

ProductsSchema.plugin(mongoosePaginate);

export default mongoose.model("Products", ProductsSchema)
