import { Food } from "../models/food.model.js";
import fileUpload from "../service/storage.service.js";
import { v4 as uuidv4 } from 'uuid';
import { foodPartnerModel } from "../models/foodpartner.model.js";
import { Like } from "../models/like.model.js";
import { Save } from "../models/save.model.js";


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


  export const likeFoodItem = async (req, res) => {
      try {
        const userId= req.user._id;
        const { foodId } = req.params;
  
        if(!foodId) {
          return res.status(400).json({ message: "Food ID is required" });
        }
  
        const alreadyLiked = await Like.findOne({ user: userId, food: foodId });
  
      
        if (alreadyLiked) {
        const food =  await Food.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } });
          await Like.deleteOne({ _id: alreadyLiked._id });
          return res.status(200).json({ message: "Food item unliked successfully" ,
            data:{
              food
            }
          });

        }
  
        const food = await Food.findById(foodId);
        if (!food) {
          return res.status(404).json({ message: "Food item not found" });
        }
    
        await Food.updateOne({ $inc: { likeCount: 1 } });
       const like=  await Like.create({ user: userId, food: foodId });
    
        return res.status(200).json({ message: "Food item liked successfully" ,
        data: {
          like,
          food
        }
      }       
        );
      } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
        
      }
    
  }


  export const SaveFoodItem = async (req, res) => {
    try {
      const userId= req.user._id;
      const { foodId } = req.params;

      if(!foodId) {
        return res.status(400).json({ message: "Food ID is required" });
      }

      const alreadySaved = await Save.findOne({ user: userId, food: foodId });

    
      if (alreadySaved) {
        await Save.deleteOne({ _id: alreadySaved._id });
        await Food.findByIdAndUpdate(foodId, { $inc: { saveCount: -1 } });
        return res.status(200).json({ message: "Food item unsaved successfully" });

      }

      const food = await Food.findById(foodId);

      if (!food) {
        return res.status(404).json({ message: "Food item not found" });
      }

      await food.updateOne({ $inc: { saveCount: 1 } });
  
     const save=  await Save.create({ user: userId, food: foodId });
  
     return res.status(200).json({ 
      message: "Food item saved successfully",
      data: {
        save,
        food
      }
    });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
      
    }
  }

export const fetchSaveReels = async (req,res) =>{
  try {
    const userId= req.user._id;
    if(!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const savedReels = await Save.find({ user: userId }).populate('food');

    return res.status(200).json({ message: "Saved reels fetched successfully", savedReels });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}