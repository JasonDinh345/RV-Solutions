import {Router} from 'express';
import pool from '../util/db.js';
import { AuthController } from '../controller/auth.controller.js';
import { AuthService } from '../service/auth.service.js';
/** Router for auth */
const authRouter: Router = Router();

const authModel: AuthService = new AuthService(pool)
const authController: AuthController = new AuthController(authModel)
/**
 * POST request to login a user using access tokens
 */
authRouter.post("/login", authController.authenticateUser.bind(authController))
/**
 * POST request to generate a new token using a refresh token
 */
authRouter.post("/token", authController.getNewToken.bind(authController))
/**
 * DELETE request that logouts a user by unauthenticating its refresh token
 */
authRouter.delete("/logout", authController.deleteRefreshToken.bind(authController))
export default authRouter