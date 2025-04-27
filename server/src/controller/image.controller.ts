import { ImageService } from "../service/image.service.js";
import { Request, Response } from 'express';
import { deleteImage, uploadBlob } from "../util/imageUpload.js";
import fileUpload from 'express-fileupload';
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
            const imageData = req.files.img as fileUpload.UploadedFile
            const imageURLData = uploadBlob(imageData.data, `RV_SOLUTIONS/${imageData.name}`)
            const imgID: string = await this.imageService.insertImage({...imageURLData, imageID: `RV_SOLUTIONS/${imageData.name}`}, req.body.rvVin);
            if(imgID){
                res.status(200).json(imgID)
            }else{
                res.status(400).json({message: `Couldn't upload image: ${JSON.stringify({...imageURLData, imageID: `RV_SOLUTIONS/${imageData.name}`})}`})
            }
        }catch(err){
            switch(err.message){
                case "CLOUDINARY_ERROR":
                    res.status(400).json({message:`Upload to Cloudinary has failed!`})
                    break
                case "DUPLICATE_ENTRY":
                    res.status(409).json({ message: `RV already has an image with vin: ${req.body.vin}` });
                    break;
                case "MISSING_FIELD":
                    res.status(400).json({ message: `Missing fields` });
                    break;
                case "FOREIGN_KEY_ERROR":
                    res.status(409).json({ message: `RV doesn't exist with vin: ${req.body.vin}!`});
                    break;
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message:`SQL syntax invalid!`})
                    break
                default:
                    res.status(500).json({message:`Unexpected Server Error!`})
                    break
            }
        }
    }
    async updateImage(req:Request, res: Response):Promise<void>{
        try{
            const imageData = req.files.img as fileUpload.UploadedFile
            const imageURLData = await uploadBlob(imageData.data, `RV_SOLUTIONS/${imageData.name}`)
            if(!(await deleteImage(req.body.imageID))){
                res.status(400).json({message:`Delete on Cloudinary image has failed!`})
                return;
            }
            if(await this.imageService.updateImage({...imageURLData, imageID: `RV_SOLUTIONS/${imageData.name}`}, req.body.rvVin)){
                res.status(201).json({message:"Sucessfully updated image"})
            }else{
                res.status(404).json({message: `Couldn't update Image: ${JSON.stringify({...imageURLData, imageID: `RV_SOLUTIONS/${imageData.name}`})}`})
            }
        }catch(err){
            switch(err.message){
                case "INVALID_FIELD":
                    res.status(400).json({ message: `Unknown field in update query: ${JSON.stringify(req.files.img)}` });
                    break;
                case "NULL_FIELD":
                    res.status(409).json({message: `Fields can't be null!`})
                    break
                case "FOREIGN_KEY_ERROR":
                    res.status(409).json({ message: `RV doesn't exist with vin: ${req.body.vin}!`});
                    break;
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message:`SQL syntax invalid!`})
                    break
                default:
                    res.status(500).json({message:`Unexpected Server Error!`})
                    break
            }
        }
    }
    async deleteImage(req:Request, res: Response):Promise<void>{
        try{
            const imageID = req.body.imageID
            if(!imageID){
                res.status(400).json({message: `Missing image ID!`})
            }
            
            if(await this.imageService.deleteImage(imageID)){
                res.status(204).json({message:`Successfully deleted image!`})
            }else{
                res.status(404).json({message:`Couldn't find image with id: ${imageID}`})
                return
            }
            if(!(await deleteImage(imageID))){
                res.status(400).json({message:`Delete on Cloudinary image has failed!`})
                return;
            }
        }catch(err){
            switch(err.message){
                case "IMAGE_NOT_FOUND":
                    res.status(404).json({message:`Couldn't find image with id: ${req.body.imageID}`})
                    break
                case "FOREIGN_KEY_ERROR":
                    res.status(409).json({message: "Cannot delete: Foreign key constraint violation"})
                    break;
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message:`SQL syntax invalid!`})
                    break;
                default:
                    res.status(500).json({message:`Unexpected Server Error!`})
                    break;
            }
        }
    }
}