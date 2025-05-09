import { Item } from "../models/item.models.js";
import { Category } from '../models/category.models.js';
import { Resturant } from "../models/resturant.models.js";


export const addItem = async (req, res) => {
    const { imageUrl, name, details, ingredients = [], price, category, resturant } = req.body;
  
    try {
      if (!imageUrl || !name || !details || !price || !category || !resturant) {
        throw new Error("All fields are required");
      }
  
      // 1. Create the item
      const newItem = new Item({
        imageUrl,
        name,
        details,
        ingredients,
        price,
        category,
        resturant,
      });
  
      await newItem.save();
  
      // 2. Update the category with the item reference
      await Category.findByIdAndUpdate(category, {
        $push: { items: newItem._id },
      });
      await Resturant.findByIdAndUpdate(resturant, {
        $push: { items: newItem._id },
      });
  
      res.status(201).json({
        success: true,
        message: "Dish created ",
        item: newItem,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

export const getItem = async (req, res) => {
try {
    const items = await Item.find(); // fetch all items from DB

    res.status(200).json({
    success: true,
    message: 'Items fetched successfully',
    items,
    });
} catch (error) {
    res.status(500).json({
    success: false,
    message: 'Failed to fetch items',
    error: error.message,
    });
}
};
export const getItemsByCategory = async (req, res) => {
try {
    const { category } = req.query;

    const items = await Item.find({ category }).populate('category');

    res.status(200).json({ success: true, items });
} catch (error) {
    res.status(500).json({ success: false, message: error.message });
}
};