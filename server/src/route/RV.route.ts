import { Router } from "express";
import pool from "../util/db.js";
import { RVService } from "../service/RV.service.js";
import { RVController } from "../controller/RV.controller.js";
const rvRouter: Router = Router(); 
const rvService: RVService = new RVService(pool)
const rvController: RVController = new RVController(rvService)
/** GET request for all RVS */
rvRouter.get("/", rvController.getAllRV.bind(rvController))
/** GET request for all RVS relating to the owner*/
rvRouter.get("/owner/:ownerID", rvController.getAllRVwOwner.bind(rvController))
/** GET request for a RV */
rvRouter.get("/:vin", rvController.getRV.bind(rvController))
/** POST request for to add RV*/
rvRouter.post("/", rvController.insertRV.bind(rvController))
/** PATCH request for to update RV */
rvRouter.patch("/:vin/:imageID", rvController.updateRV.bind(rvController))
/** DELETE request for to delete RV */
rvRouter.delete("/:vin/:imageID", rvController.deleteRV.bind(rvController))

export default rvRouter