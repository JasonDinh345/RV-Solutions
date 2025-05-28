import { Router } from "express";
import { ImageController } from "../controller/image.controller.js";
import { ImageService } from "../service/image.service.js";
import pool from "../util/db.js";

const imageRouter: Router = Router();
const imageService = new ImageService(pool)
const imageController: ImageController = new ImageController(imageService);

imageRouter.get("/", imageController.getRandomImages.bind(imageController))

export default imageRouter;