import { Router } from "express";
import pool from "../util/db.js";
import { RVService } from "../service/RV.service.js";
import { RVController } from "../controller/RV.controller.js";
const rvRouter: Router = Router(); 
const rvService: RVService = new RVService(pool)
const rvController: RVController = new RVController(rvService)

rvRouter.get("/", rvController.getAllRV.bind(rvController))

rvRouter.get("/:vin", rvController.getRV.bind(rvController))

rvRouter.post("/", rvController.insertRV.bind(rvController))

rvRouter.patch("/:vin", rvController.updateRV.bind(rvController))

rvRouter.delete("/:vin", rvController.deleteRV.bind(rvController))

export default rvRouter