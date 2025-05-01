import { Router } from "express";
import { DamageReportService } from "../service/damageReport.service.js";
import pool from "../util/db.js";
import { DamageReportController } from "../controller/damageReport.controller.js";

const damageReportRouter: Router = Router();
const damageReportService:DamageReportService = new DamageReportService(pool)
const damageReportController:DamageReportController = new DamageReportController(damageReportService)

damageReportRouter.get("/account/:accountID", damageReportController.getAllDamageReportWithAccount.bind(damageReportController))

damageReportRouter.get("/RV/:vin", damageReportController.getAllDamageReportWithRV.bind(damageReportController))

damageReportRouter.get("/owner/:ownerID", damageReportController.getAllDamageReportWithOwner.bind(damageReportController))

damageReportRouter.get("/:reportID", damageReportController.getDamageReport.bind(damageReportController))

damageReportRouter.post("/", damageReportController.insertDamageReport.bind(damageReportController))

damageReportRouter.patch("/:reportID", damageReportController.updateDamageReport.bind(damageReportController))

damageReportRouter.delete("/:reportID", damageReportController.deleteDamageReport.bind(damageReportController))

export default damageReportRouter