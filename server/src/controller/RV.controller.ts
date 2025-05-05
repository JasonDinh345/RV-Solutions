import { RVService } from "../service/RV.service.js";
import { Request, Response } from 'express';
import { RVwImage } from "../types/RV.type.js";
export class RVController{
    private rvService: RVService

    constructor(rvService: RVService){
        this.rvService = rvService
    }

    async getAllRV(req:Request, res: Response):Promise<void>{
        try{
            const allRVs = await this.rvService.getAllRV()
            if(allRVs.length > 0){
                res.status(200).json(allRVs)
            }else{
                res.status(404).json({message:"No RVs Found"})
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
    async insertRV(req:Request, res: Response):Promise<void>{
        try{
            const rvData = req.body
            if(!rvData){
                res.status(400).json({message: `No data sent to server!: ${rvData}`})
            }
            if(await this.rvService.insertRV(rvData)){
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
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message: `SQL syntax error!`})
                    break;
                default: 
                    res.status(500).json({message: `Server error`})
                    break
            }
        }
    }
    async updateRV(req:Request, res: Response):Promise<void>{
        try{
            const rvData = req.body.rvData
            const vin = req.params.vin
            if(!rvData || !vin){
                res.status(400).json({message:`Missing fields in RV data: ${req.body}`})
                return;
            }
            if(await this.rvService.updateRV(rvData, vin)){
                res.status(204).json({message:`Successfully updated RV`})
            }else{
                res.status(404).json({message:`Couldn't find RV`})
            }
        }catch(err){
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
    async deleteRV(req:Request, res: Response):Promise<void>{
        try{
            const vin = req.params.vin
            if(!vin){
                res.status(400).json({ message: `Missing VIN: ${vin}` });
                return
            }
            if(await this.rvService.deleteRV(vin)){
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