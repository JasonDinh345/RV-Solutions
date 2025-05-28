import { ImageService } from "../service/image.service.js";
import { Request, Response } from 'express';
export class ImageController{
    private imageService:ImageService

    constructor(imageService:ImageService){
        this.imageService = imageService;
    }
    async getRandomImages(req:Request, res: Response){
        try{
            const result = await this.imageService.getRandomImages()
            if(result.length > 0){
                res.status(200).json(result)
            }else{
                res.status(404).json({message: "No images found!"})
            }
        }catch(err){
            switch(err.message){
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message: `SQL syntax error!`})
                    break;
                default:
                    res.status(500).json({message: `Server error occured!`})
                    break;
            }
        }
    }
}