import { RVService } from "../service/RV.service.js";
import { Request, Response } from 'express';
import { RV } from "../types/RV.type.js";
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

        }
    }
    async getRV(req:Request, res: Response):Promise<void>{
        try{
            const vin = req.body.vin
            if(!vin){
                res.status(400).json({message: `Missing RV VIN!`})
            }
            const RV: RV = await this.rvService.getRV(vin)

            if(RV){
                res.status(200).json(RV)
            }else{
                res.status(400).json({message: `Couldn't get RV with vin: ${vin}`})
            }
        }catch(err){
            
        }
    }
}