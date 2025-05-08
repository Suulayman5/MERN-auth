import { Category } from "../models/category.models.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const addCategory = async (req, res) => {
    const { name, minPrice, imageUrl } = req.body

   try {
     if (!name || !minPrice) {
        throw new Error("All fields are required");
     }
     let imageData = {}
     if (imageUrl){
      const results = await uploadToCloudinary(imageUrl, "my-profile")
      imageData = results
     }
     const newCategory = new Category({ name, minPrice, imageUrl: imageData.url });
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


// const createUser = async (req, res) => {
//   const {name, username, image} = req.body
//   try{
//       let imageData = {}
//       if(image){
//           const results = await uploadToCloudinary(image, "my-profile")
//           imageData = results
//       }
//       const user = await User.create({
//           name,
//           username,
//           image: imageData
//       })

//       res.status(200).json(user)
//   } catch(e) {
//       res.status(500).json({error: "A server error occurred with this request"})
//   }
// }

// module.exports = { createUser }
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