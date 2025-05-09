import mongoose from "mongoose";

const resturantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    details: {
        type: String,
        required: true,
    },
      imageUrl: {
        type: String,
        publicId: String,
        required: true,
    },
    category: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    }],
    items: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    }],
    rating: String,
    delivery: String

})
export const Resturant = mongoose.model("Resturant", resturantSchema);
