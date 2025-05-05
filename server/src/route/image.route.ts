import { Router } from "express";
import { ImageService } from "../service/image.service.js";
import pool from "../util/db.js";
import { ImageController } from "../controller/image.controller.js";

const imageRouter = Router();

const imageService:ImageService = new ImageService(pool)
const imageController: ImageController = new ImageController(imageService)

imageRouter.post("/", imageController.uploadImage.bind(imageController))

imageRouter.patch("/:imageID", imageController.updateImage.bind(imageController))

imageRouter.delete("/:imageID", imageController.deleteImage.bind(imageController))

export default imageRouter