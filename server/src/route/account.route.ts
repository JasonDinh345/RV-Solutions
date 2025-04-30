import {Router} from 'express';
import pool from '../util/db.js';
import { AccountService } from '../service/account.service.js';
import { AccountController } from '../controller/account.controller.js';
const accountRouter: Router = Router();
const accountService: AccountService = new AccountService(pool)
const accountController: AccountController = new AccountController(accountService)

accountRouter.get("/protected", accountController.authenticateToken.bind(accountController), accountController.getAccount.bind(accountController))

accountRouter.post("/", accountController.insertAccount.bind(accountController))

accountRouter.patch("/protected", accountController.authenticateToken.bind(accountController), accountController.updateAccount.bind(accountController))

accountRouter.delete("/protected", accountController.authenticateToken.bind(accountController), accountController.deleteAccount.bind(accountController))

export default accountRouter