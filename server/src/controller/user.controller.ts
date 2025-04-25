import { UserService } from "../service/user.service.js";
import { Request, Response, NextFunction } from 'express';
import { User } from "../types/User.type.js";
import jwt from "jsonwebtoken"

declare global {
    namespace Express {
      interface Request {
        user?: Partial<User>; // or 'user: User' if it's always set
      }
    }
  }
export class UserController{
    
    private userService;

    constructor(userService: UserService) {
        this.userService = userService
    }
     /**
     * Middleware to authenicate the current accessToken
     * @param req, Request containing the token, adds a username to the request if authenticated
     * @param res, Sends 400s codes if error is found, else used in other requests
     * @param next continues to other requests
     */
     authenticateToken(req:Request, res: Response, next: NextFunction): Promise<void>{
        const accessToken = req.cookies.accessToken;
        
        if(!accessToken){
            res.status(403).json("Token cannot be null or undefined")
            return;
        }
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err:Error, user: Partial<User>)=>{
            if(err){
                res.status(403).json({message:"Token can't be verified"})
                return;
            }
            req.user = user
            next()
        })
    }
    async getUser(req:Request, res: Response):Promise<void>{
        try{
            const user = await this.userService.getUser(req.user.email)
            if(!user){
                res.status(404).json({message:`Couldn't find user with email: ${req.user.email}`})
            }else{
                res.status(200).json(user)
            }
        }catch(err){
            switch(err.message){
                case "INVALID_USER":
                    res.status(404).json({message:`Couldn't find user with email: ${req.user.email}`})
                    break
                default:
                    res.status(500).json({message:`Unexpected Server Error!`})
                    break
            }
        }
    }
    async insertUser(req:Request, res: Response):Promise<void>{
        try{
            const userData: Partial<User> = req.body;

            if(await this.userService.insertUser(userData)){
                res.status(201).json({message:`Sucessfully created user!`})
            }else{
                res.status(400).json({message:`Couldn't create user with data: ${JSON.stringify(userData)}`})
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
    async updateUser(req:Request, res: Response):Promise<void>{
        try{
            const userData: Partial<User> = req.body
            if(await this.userService.updateUser(userData, req.user.email)){
                res.status(204).json({message:`Sucessfully updated user!`})
            }else{
                res.status(400).json({message:`Couldn't update user with data: ${JSON.stringify(userData)}`})
            }
        }catch(err){
            switch(err.message){
                case "INVALID_USER":
                    res.status(404).json({ message: `Unknown user with email: ${req.body.email}` });
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
    async deleteUser(req:Request, res: Response):Promise<void>{
        try{
            if(await this.userService.deleteUser(req.user.email)){
                res.status(204).json({message:`Sucessfully deleted user!`})
            }else{
                res.status(400).json({message:`Couldn't delete user with email: ${req.user.email}`})
            }
        }catch(err){
            switch(err.message){
                case "INVALID_USER":
                    res.status(404).json({message:`Couldn't find user with email: ${req.user.email}`})
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