import { AccountService } from "../service/account.service.js";
import { Request, Response, NextFunction } from 'express';
import { Account } from "../types/Account.type.js";
import jwt from "jsonwebtoken"

declare global {
    namespace Express {
      interface Request {
        account?: Partial<Account>; // or 'account: Account' if it's always set
      }
    }
  }
export class AccountController{
    
    private accountService;

    constructor(accountService: AccountService) {
        this.accountService = accountService
    }
     /**
     * Middleware to authenicate the current accessToken
     * @param req, Request containing the token, adds a email to the request if authenticated
     * @param res, Sends 400s codes if error is found, else used in other requests
     * @param next continues to other requests
     */
     authenticateToken(req:Request, res: Response, next: NextFunction): Promise<void>{
        const accessToken = req.cookies.accessToken;
        
        if(!accessToken){
            res.status(403).json("Token cannot be null or undefined")
            return;
        }
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err:Error, account: Partial<Account>)=>{
            if(err){
                res.status(403).json({message:"Token can't be verified"})
                return;
            }
            req.account = account
            next()
        })
    }
    async getAccount(req:Request, res: Response):Promise<void>{
        try{
            const account = await this.accountService.getAccount(req.account.email)
            if(!account){
                res.status(404).json({message:`Couldn't find account with email: ${req.account.email}`})
            }else{
                res.status(200).json(account)
            }
        }catch(err){
            switch(err.message){
                case "INVALID_USER":
                    res.status(404).json({message:`Couldn't find account with email: ${req.account.email}`})
                    break
                default:
                    res.status(500).json({message:`Unexpected Server Error!`})
                    break
            }
        }
    }
    async insertAccount(req:Request, res: Response):Promise<void>{
        try{
            const accountData: Partial<Account> = req.body;

            if(await this.accountService.insertAccount(accountData)){
                res.status(201).json({message:`Sucessfully created account!`})
            }else{
                res.status(400).json({message:`Couldn't create account with data: ${JSON.stringify(accountData)}`})
            }
        }catch(err){
            switch(err.message){
                case "DUPLICATE_ENTRY":
                    res.status(409).json({ message: `Email already exists: ${req.body.email}` });
                    break;
                case "MISSING_FIELD":
                    res.status(400).json({ message: `Missing fields: ${JSON.stringify(req.body)}` });
                    break;
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message:`SQL syntax invalid!`})
                    break
                default:
                    res.status(500).json({message:`Unexpected Server Error!`})
                    break
            }
        }
    }
    async updateAccount(req:Request, res: Response):Promise<void>{
        try{
            const accountData: Partial<Account> = req.body
            if(await this.accountService.updateAccount(accountData, req.account.email)){
                res.status(204).json({message:`Sucessfully updated account!`})
            }else{
                res.status(400).json({message:`Couldn't update account with data: ${JSON.stringify(accountData)}`})
            }
        }catch(err){
            switch(err.message){
                case "INVALID_USER":
                    res.status(404).json({ message: `Unknown account with email: ${req.body.email}` });
                    break;
                case "DUPLICATE_ENTRY":
                    res.status(409).json({ message: `Email already exists: ${req.body.email}` });
                    break;
                case "INVALID_FIELD":
                    res.status(400).json({ message: `Unknown field in update query: ${JSON.stringify(req.body)}` });
                    break;
                case "FOREIGN_KEY_ERROR":
                    res.status(409).json({ message: `Foreign key constraint fails!`});
                    break;
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message:`SQL syntax invalid!`})
                    break
                default:
                    res.status(500).json({message:`Unexpected Server Error!`})
                    break
            }
        }
    }
    async deleteAccount(req:Request, res: Response):Promise<void>{
        try{
            if(await this.accountService.deleteAccount(req.account.email)){
                res.status(204).json({message:`Sucessfully deleted account!`})
            }else{
                res.status(400).json({message:`Couldn't delete account with email: ${req.account.email}`})
            }
        }catch(err){
            switch(err.message){
                case "INVALID_USER":
                    res.status(404).json({message:`Couldn't find account with email: ${req.account.email}`})
                    break
                case "FOREIGN_KEY_ERROR":
                    res.status(409).json({message: "Cannot delete: Foreign key constraint violation"})
                    break;
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message:`SQL syntax invalid!`})
                    break;
                default:
                    res.status(500).json({message:`Unexpected Server Error!`})
                    break;
            }
        }
    }
}