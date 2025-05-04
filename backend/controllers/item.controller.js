import { Item } from "../models/item.models.js"; // adjust path as needed

export const addItem = async (req, res) => {
  const { imageUrl, name, details, ingredients = [], price,  } = req.body;

  try {
    if (!imageUrl || !name || !details || !ingredients || !price) {
      throw new Error("All fields are required");
    }

    const newItem = new Item({
      imageUrl,
      name,
      details,
      ingredients,
      price,
    });

    await newItem.save();

    res.status(201).json({
      success: true,
      message: "Dish created successfully",
      item: newItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
