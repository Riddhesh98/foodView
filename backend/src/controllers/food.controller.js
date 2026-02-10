import { Food } from "../models/food.model.js";
import fileUpload from "../service/storage.service.js";
import { v4 as uuidv4 } from 'uuid';

export const createFood = async (req, res) => {
    try {
        const { name, video, description } = req.body;
     
        const foodPartnerId = req.foodPartner._id;

        
        const videoUrl = await fileUpload(req.file.buffer, uuidv4());

        console.log(videoUrl);
       
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
