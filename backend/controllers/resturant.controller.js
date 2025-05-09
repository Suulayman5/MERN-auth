import { Resturant } from "../models/resturant.models.js"
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const createResturant = async (req, res) => {
    const {name, details, imageUrl, category, items, rating, delivery} = req.body
    try {
        if (!name || !details || !imageUrl || !category) {
            throw new Error ('all feilds are requried')
        }
             let imageData = {}
             if (imageUrl){
              const results = await uploadToCloudinary(imageUrl, "my-profile")
              imageData = results
             }
             const newResturant = new Resturant({name, details, imageUrl, category, items, rating, delivery});
             await newResturant.save()
             res.status(201).json({
                success: true,
                message: "Resturant created",
                item: newResturant,
                category: newResturant,
              });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
          });
    }
}

export const getResturant = async (req, res) => {
    try {
        const resturant = await Resturant.find()
        res.status(200).json({
            success: true,
            message: 'resturants fetched successfully',
            resturant
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch resturants',
            error: error.message,
            });
    }
}

export const getResturantById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const resturant = await Resturant.findById(id);
  
      if (!resturant) {
        return res.status(404).json({
          success: false,
          message: "Restaurant not found",
        });
      }
  
      res.status(200).json({
        success: true,
        resturant,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch restaurant",
        error: error.message,
      });
    }
  };
  