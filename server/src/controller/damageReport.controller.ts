import { DamageReportService } from "../service/damageReport.service.js";
import { Request, Response } from 'express';
import { DamageReport, DamageReportwRV } from "../types/DamageReport.type.js";
export class DamageReportController{
    private damageReportService: DamageReportService

    constructor(damageReportService: DamageReportService){
        this.damageReportService = damageReportService
    }

    async getAllDamageReportWithAccount(req:Request, res: Response):Promise<void>{
        try{
            const accoundID = Number(req.params.accountID);
            const damageReports: Partial<DamageReport>[] = await this.damageReportService.getAllDamageReportWithAccount(accoundID)
            if(damageReports.length === 0){
                res.status(404).json({message:`No damage reports found`})
            }else{
                res.status(200).json(damageReports)
            }
        }catch(err){
            switch(err.message){
                case "INVALID_ACCOUNT":
                    res.status(400).json({message: `Account ID can't be null`})
                    break;
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message: `SQL syntax error!`})
                    break;
                default:
                    res.status(500).json({message: `Server error occured!`})
                    break;
            }
        }
    }
    async getAllDamageReportWithRV(req:Request, res: Response):Promise<void>{
        try{
            const vin = req.params.vin;
            const damageReports: Partial<DamageReport>[] = await this.damageReportService.getAllDamageReportWithRV(vin)
            if(damageReports.length === 0){
                res.status(404).json({message:`No damage reports found`})
            }else{
                res.status(200).json(damageReports)
            }
        }catch(err){
            switch(err.message){
                case "INVALID_RV":
                    res.status(400).json({message: `VIN can't be null`})
                    break;
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message: `SQL syntax error!`})
                    break;
                default:
                    res.status(500).json({message: `Server error occured!`})
                    break;
            }
        }
    }
    async getAllDamageReportWithOwner(req:Request, res: Response):Promise<void>{
        try{
            const ownerID = req.params.ownerID;
            const damageReports: Partial<DamageReport>[] = await this.damageReportService.getAllDamageReportWithOwner(ownerID)
            if(damageReports.length === 0){
                res.status(404).json({message:`No damage reports found`})
            }else{
                res.status(200).json(damageReports)
            }
        }catch(err){
            switch(err.message){
                case "INVALID_ACCOUNT":
                    res.status(400).json({message: `Owner ID can't be null`})
                    break;
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message: `SQL syntax error!`})
                    break;
                default:
                    res.status(500).json({message: `Server error occured!`})
                    break;
            }
        }
    }
    
    async getDamageReportwRV(req:Request, res: Response):Promise<void>{
        try{
            const reportID = Number(req.params.reportID);
            const damageReport: DamageReportwRV = await this.damageReportService.getDamageReportwRV(reportID)
            if(damageReport){
                res.status(200).json(damageReport)
            }else{
                res.status(404).json({message:`No damage reports found with ID: ${reportID}`})
                
            }
        }catch(err){
            switch(err.message){
                case "INVALID_REPORT":
                    res.status(400).json({message: `Report ID can't be null`})
                    break;
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message: `SQL syntax error!`})
                    break;
                default:
                    res.status(500).json({message: `Server error occured!`})
                    break;
            }
        }
    }
    async insertDamageReport(req:Request, res: Response):Promise<void>{
        try{
            const reportData = req.body.reportData
            if(await this.damageReportService.insertDamageReport(reportData)){
                res.status(201).json({message: `Successfully inserted damage report!`})
            }else{
                res.status(400).json({message:`Couldn't insert into damage report!`})
            }
        }catch(err){
            switch(err.message){
                case "INVALID_FIELD":
                    res.status(400).json({message:`Unknown fields in DamageReport data: ${req.body}`})
                    break;
                case "MISSING_FIELD":
                    res.status(400).json({message:`Missing fields in DamageReport data: ${req.body}`})
                    break;
                case "FOREIGN_KEY_ERROR":
                    res.status(409).json({message:`Foreign key error!`})
                    break;
                case "DUPLICATE_ENTRY":
                    res.status(409).json({message: `DamageReport already exists with ID`})
                    break;
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message: `SQL syntax error!`})
                    break;
                default:
                    res.status(500).json({message: `Server error occured!`})
                    break;
            }
        }
    }
    async updateDamageReport(req:Request, res: Response):Promise<void>{
        try{
            const reportData = req.body.reportData
            const reportID = Number(req.params.reportID);
            if(await this.damageReportService.updateDamageReport(reportData, reportID)){
                res.status(204).json({message: `Successfully updated damage report!`})
            }else{
                res.status(400).json({message:`Couldn't insert into damage report!`})
            }
        }catch(err){
            switch(err.message){
                case "INVALID_REPORT":
                    res.status(400).json({message: `Report ID can't be null`})
                    break;
                case "INVALID_FIELD":
                    res.status(400).json({message:`Unknown fields in RV data: ${req.body}`})
                    break;
                case "NULL_FIELD":
                    res.status(400).json({message:`Field can not be null!: ${req.body}`})
                    break;
                case "FOREIGN_KEY_ERROR":
                    res.status(409).json({message:`Foreign key error!`})
                    break;
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message: `SQL syntax error!`})
                    break;
                default:
                    res.status(500).json({message: `Server error occured!`})
                    break;
            }
        }
    }
    async deleteDamageReport(req:Request, res: Response):Promise<void>{
        try{
            const reportID = Number(req.params.reportID);
            if(await this.damageReportService.deleteDamageReport(reportID)){
                res.status(204).json({message: `Successfully deleted damage report!`})
            }else{
                res.status(400).json({message:`Couldn't insert into damage report!`})
            }
        }catch(err){
            switch(err.message){
                case "INVALID_REPORT":
                    res.status(400).json({message: `Report ID can't be null`})
                    break;
                case "FOREIGN_KEY_ERROR":
                    res.status(409).json({message:`Foreign key error!`})
                    break;
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