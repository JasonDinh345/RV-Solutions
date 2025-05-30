import { Router } from "express";
import { DamageReportService } from "../service/damageReport.service.js";
import pool from "../util/db.js";
import { DamageReportController } from "../controller/damageReport.controller.js";

const damageReportRouter: Router = Router();
const damageReportService:DamageReportService = new DamageReportService(pool)
const damageReportController:DamageReportController = new DamageReportController(damageReportService)
/** GET request to get all reports where an account is at fault for */
damageReportRouter.get("/account/:accountID", damageReportController.getAllDamageReportWithAccount.bind(damageReportController))
/** GET request to get all reports relating to a VIN */
damageReportRouter.get("/RV/:vin", damageReportController.getAllDamageReportWithRV.bind(damageReportController))
/** GET request to get a report*/
damageReportRouter.get("/:reportID", damageReportController.getDamageReportwRV.bind(damageReportController))
/** POST request to insert a report */
damageReportRouter.post("/", damageReportController.insertDamageReport.bind(damageReportController))
/** PATCH request to update a report */
damageReportRouter.patch("/:reportID", damageReportController.updateDamageReport.bind(damageReportController))
/** DELETE request to delete a report */
damageReportRouter.delete("/:reportID", damageReportController.deleteDamageReport.bind(damageReportController))

export default damageReportRouter