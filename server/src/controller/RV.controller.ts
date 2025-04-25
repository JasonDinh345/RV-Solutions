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
            res.status(200).json(allRVs)
        }catch(err){
            res.status(500).json({message: `Server error occured!`})
        }
    }
    async getRV(req:Request, res: Response):Promise<void>{
        try{
            const vin = req.body.vin
            if(!vin){
                res.status(400).json({message: `Missing RV VIN!`})
            }
            const RV: RVwImage = await this.rvService.getRV(vin)

            if(RV){
                res.status(200).json(RV)
            }else{
                res.status(400).json({message: `Couldn't get RV with vin: ${vin}`})
            }
        }catch(err){
            switch(err.message){
                case("VIN_NOT_FOUND"):
                    res.status(404).json({message: `RV doesn't exist with vin: ${req.body.vin}`})
                default:
                    res.status(500).json({message:`Unexpected Server Error!`})
                    break
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
            const vin = req.body.vin
            if(!rvData || !vin){
                res.status(400).json({message:`Missing fields in RV data: ${req.body}`})
                return;
            }
            if(await this.rvService.updateRV(rvData, vin)){
                res.status(204).json({message:`Successfully updated RV`})
            }else{
                res.status(400).json({message:`Couldn't update RV`})
            }
        }catch(err){
            switch(err.message){
                case "INVALID_FIELD":
                    res.status(400).json({ message: `Unknown field in update query: ${req.body}` });
                    break;
                case "DATA_TOO_LONG":
                    res.status(400).json({message: `Data for a field too long: ${req.body}`})
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
            const vin = req.body.vin
            if(!vin){
                res.status(400).json({ message: `Missing VIN: ${vin}` });
                return
            }
            if(await this.rvService.deleteRV(vin)){
                res.status(204).json({message: `Successfully deleted RV`})
            }else{
                res.status(400).json({message:`Couldn't delete RV with VIN: ${vin}`})
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