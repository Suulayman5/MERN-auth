import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  minPrice: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    publicId: String,
    required: true,
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
  }],
});

export const Category = mongoose.model("Category", categorySchema);
