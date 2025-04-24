import { ImageService } from "../service/image.service.js";
import { Request, Response } from 'express';
import { Image } from "../types/Image.type.js";
export class ImageController{
    private imageService;

    constructor(imageService: ImageService){
        this.imageService = imageService;
    }

    async uploadImage(req:Request, res: Response):Promise<void>{
        try{
            if(!req.files){
                throw new Error("INVALID_REQUEST")
            }
            const imageData = req.files.img
            const img: Image = await this.imageService.insertImage(imageData);
            if(img){
                res.status(200).json(img)
            }else{
                res.status(400).json({message: `Couldn't upload image: ${JSON.stringify(imageData)}`})
            }
        }catch(err){

        }
    }
    async updateImage(req:Request, res: Response):Promise<void>{
        try{
            const imageData = req.body
            if(await this.imageService.updateImage(imageData)){
                res.status(201).json({message:"Sucessfully updated image"})
            }else{
                res.status(404).json({message: `Couldn't update Image: ${JSON.stringify(imageData)}`})
            }
        }catch(err){

        }
    }
    async deleteImage(req:Request, res: Response):Promise<void>{
        try{
            if(!req.body.imageID){
                res.status(400).json({message: `Missing image ID!`})
            }
            const imageID = req.body.imageID
            if(await this.imageService.deleteImage(imageID)){
                res.status(204).json({message:`Successfully deleted image!`})
            }else{
                res.status(400).json({message:`Couldn't delete image with id: ${imageID}`})
            }
        }catch(err){

        }
    }
}