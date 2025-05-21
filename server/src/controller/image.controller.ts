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
         
            const imageURLData = await uploadBlob(imageData.data)
            
            if(await this.imageService.insertImage(imageURLData, req.body.VIN)){
                res.status(201).json({message:`Sucessfully uploaded RV and Image`})
            }else{
                res.status(400).json({message: `Couldn't upload image: ${JSON.stringify(imageURLData)}`})
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
   
    async deleteImage(req:Request, res: Response):Promise<void>{
        try{
            const imageID = req.params.imageID
            if(!imageID){
                res.status(400).json({message: `Missing image ID!`})
                return;
            }
            
            if(!(await this.imageService.deleteImage(imageID))){
                 res.status(404).json({message:`Couldn't find image with id: ${imageID}`})
                return
            }
            const result = await deleteImage(imageID)
            console.log(result)
            if(!(result)){
                res.status(400).json({message:`Delete on Cloudinary image has failed!`})
                return;
            }
             res.status(204).json({message:`Successfully deleted image!`})
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