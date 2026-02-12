import { Food } from "../models/food.model.js";
import fileUpload from "../service/storage.service.js";
import { v4 as uuidv4 } from 'uuid';
import { foodPartnerModel } from "../models/foodpartner.model.js";

export const createFood = async (req, res) => {
    try {
        const { name, video, description } = req.body;
     
        const foodPartnerId = req.foodPartner._id;
        

        
        const videoUrl = await fileUpload(req.file.buffer, uuidv4());

   
       
        if(!videoUrl) {
           throw new Error("Failed to upload video");
        }



       const food = await Food.create({
        name,
        video: videoUrl.url,
        description,
        foodPartner: foodPartnerId,

       })
       
       if(!food) {
        throw new Error("Failed to create food");
       }

        return res.status(201).json({
            message: "Food created successfully",
            food: {
                _id: food._id,
                name: food.name,
                video: food.video,
                description: food.description,

            }
        })


    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
    });
  }
};


export const getFoodItems= async(req, res) =>{
    const foodItems = await Food.find({});

    return res.status(200).json({
        message: "Food items fetched successfully",
        foodItems
    })
  }



  export const getFoodPartnerNdVideoById = async (req, res) => {
    const { id } = req.params;
 
    try {
      const foodPartner = await foodPartnerModel.findById(id);
      if (!foodPartner) {
        return res.status(404).json({ message: "Food partner not found" });
      }
  
      const foodItems = await Food.find({ foodPartner: id });
  
      return res.status(200).json({
        message: "Food items fetched successfully for profile",
        foodItems,
        foodPartner,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

  };