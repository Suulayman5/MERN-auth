import { Category } from "../models/category.models.js";

export const addCategory = async (req, res) => {
    const { name, minPrice, imageUrl } = req.body

   try {
     if (!name || !minPrice) {
        throw new Error("All fields are required");
     }
           const newCategory = new Category({ name, minPrice, imageUrl });
           await newCategory.save()

           res.status(201).json({
            success: true,
            message: "Category created",
            item: newCategory,
          });
        } catch (error) {
          res.status(400).json({
            success: false,
            message: error.message,
          });
        }
}
export const getCategory = async (req, res) => {
    try {
        const category = await Category.find()

        res.status(200).json({
            success: true,
            message: 'categories fetched successfully',
            category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error.message,
            });
    }
}

export const getCategoryWithItems = async (req, res) => {
    const { categoryId } = req.params;
  
    try {
      const category = await Category.findById(categoryId).populate('items');
  
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
  
      res.status(200).json({
        success: true,
        category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };