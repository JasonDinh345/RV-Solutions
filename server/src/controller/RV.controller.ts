import { RVService } from "../service/RV.service.js";
import { Request, Response } from 'express';
import { RVwImage } from "../types/RV.type.js";
import fileUpload from "express-fileupload";
import { uploadBlob } from "../util/imageUpload.js";
export class RVController{
    private rvService: RVService

    constructor(rvService: RVService){
        this.rvService = rvService
    }
    /**
     * Retrives and send "all" RVS
     * @param req request from the user
     * @param res response from the the backend
     */
    async getAllRV(req:Request, res: Response):Promise<void>{
        try{
            
            const searchOptions = {...req.query}
           
            const allRVs = await this.rvService.getAllRV(searchOptions)
            if(allRVs.length > 0){
                res.status(200).json(allRVs)
            }else{
                res.status(404).json({message:"No RVs Found"})
            }
        }catch(err){
            console.log(err)
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
    /**
     * Retrives and send "all" RVS relating to an owner
     * @param req request from the user
     * @param res response from the the backend
     */
    async getAllRVwOwner(req:Request, res: Response):Promise<void>{
        try{
            const ownerID : number = Number(req.params.ownerID)
            const allRVs = await this.rvService.getAllRVwOwner(ownerID)
            if(allRVs.length > 0){
                res.status(200).json(allRVs)
            }else{
                res.status(404).json({message:"No RVs Found"})
            }
        }catch(err){
            switch(err.message){
                case "INVALID_ID":
                    res.status(400).json({message: `Invalid ID`})
                    break
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message: `SQL syntax error!`})
                    break;
                default:
                    res.status(500).json({message: `Server error occured!`})
                    break;
            }
        }
    }
    /**
     * Retrives and send a given RV
     * @param req request from the user
     * @param res response from the the backend
     */
    async getRV(req:Request, res: Response):Promise<void>{
        try{
            const vin = req.params.vin
            if(!vin){
                res.status(400).json({message: `Missing RV VIN!`})
            }
            const RV: RVwImage = await this.rvService.getRV(vin)

            if(RV){
                res.status(200).json(RV)
            }else{
                res.status(404).json({message: `Couldn't get RV with vin: ${vin}`})
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
    /**
     * Retrives data from the end-user and sends the response of the insertion
     * @param req request from the user
     * @param res response from the the backend
     */
    async insertRV(req:Request, res: Response):Promise<void>{
        try{
            if(!req.files){
                throw new Error("INVALID_REQUEST")
            }
            
            const rvData = JSON.parse(req.body.RV)
           
            const imageData = req.files.img as fileUpload.UploadedFile
            const imageURLData = await uploadBlob(imageData.data)
          
            if(!rvData){
                res.status(400).json({message: `No data sent to server!: ${rvData}`})
            }
            if(await this.rvService.insertRVwImage(rvData, imageURLData)){
                res.status(201).json({message:`Sucessfully created RV!`})
            }else{
                res.status(400).json({message: `Could't insert RV with data: ${rvData}`}) 
            }
            
        }catch(err){
            switch(err.message){
                case "MISSING_FIELD":
                    res.status(400).json({message:`Missing fields in RV data: ${req.body}`})
                    break;
                case "DUPLICATE_ENTRY":
                    res.status(409).json({message: `RV already exists with VIN: ${req.body.vin}`})
                    break;
                case "INSERT_FAILED":
                    res.status(400).json({message: `Part of the transaction has failed`})
                    break;
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message: `SQL syntax error!`})
                    break;
                default: 
                    res.status(500).json({message: `Server error`})
                    break
            }
        }
    }
    /**
     * Retrives data from the end-user and sends the response of the update
     * @param req request from the user
     * @param res response from the the backend
     */
    async updateRV(req:Request, res: Response):Promise<void>{
        try{
            
    
            
            const rvData = JSON.parse(req.body.RV)
            console.log(rvData)
            
          
            
            const vin = req.params.vin
            const imageID = req.params.imageID
            if(!rvData || !vin){
                res.status(400).json({message:`Missing fields in RV data: ${req.body}`})
                return;
            }
            let result;
            if(!req.files){
                result = await this.rvService.updateRV(rvData, vin)
            }else{
                const imageData = req.files.img as fileUpload.UploadedFile
                const imageURLData = await uploadBlob(imageData.data)
                result = await this.rvService.updateRVwImage(rvData, imageURLData, vin,imageID)
            }
            if(result){
                res.status(204).json({message:`Successfully updated RV`})
            }else{
                res.status(404).json({message:`Couldn't find RV`})
            }
        }catch(err){
            console.log(err)
            switch(err.message){
                case "INVALID_FIELD":
                    res.status(400).json({ message: `Unknown field in update query: ${req.body}` });
                    break;
                case "MISSING_FIELD":
                    res.status(400).json({message: `Given fields can't be null!: ${req.body}`})
                    break;
                case "FOREIGN_KEY_ERROR":
                    res.status(409).json({message: `Owner doesn't exist with ID: ${req.body.rvData.ownerID}`})
                default:
                    res.status(500).json({message: `Server error`})
                    break
            }
        }
    }
    /**
     * Retrives data from the end-user and sends the response of the deletion
     * @param req request from the user
     * @param res response from the the backend
     */
    async deleteRV(req:Request, res: Response):Promise<void>{
        try{
            const  {vin, imageID} = req.params
            
            if(!vin){
                res.status(400).json({ message: `Missing VIN: ${vin}` });
                return
            }else if(!imageID){
                 res.status(400).json({ message: `Missing ImageID: ${imageID}` });
                return
            }
            const result = await this.rvService.deleteRV(vin, imageID)
           
            if(result){
                res.status(204).json({message: `Successfully deleted RV`})
            }else{
                res.status(404).json({message:`Couldn't find RV with VIN: ${vin}`})
            }
        }catch(err){
            switch(err.message){
                case "FOREIGN_KEY_ERROR":
                    res.status(409).json({message: `Foreign key constraint!`})
                    break
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message: `SQL syntax error!`})
                    break
                default:
                    res.status(500).json({message: `Server error`})
                    break
            }
        }
    }
}