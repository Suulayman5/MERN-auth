import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  details: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      type: String,
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
});

export const Item = mongoose.model("Item", itemSchema);
