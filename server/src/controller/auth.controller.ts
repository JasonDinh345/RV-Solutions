import { AuthService } from "../service/auth.service.js";
import jwt from 'jsonwebtoken'
import { Account } from "../types/Account.type.js";
import { Request, Response } from 'express';

export class AuthController{

    private authService;

    constructor(authService: AuthService){
        this.authService = authService
    }
    
    /**
     * Checks if the given email and password are valid
     * If valid, generates an access and refresh token
     * @param req, contains given fields
     * @param res, sends the tokens
     */
    async authenticateUser(req: Request, res: Response ): Promise<void>{
        try{
            const account: Account = await this.authService.authenticateUser(req.body)
            if(!account){
                res.status(401).json({message: "Authorization Failed"})
            }
            const accessToken = this.generateAccessToken({Email: account.Email})
            const refreshToken:string = jwt.sign({Email: account.Email}, process.env.REFRESH_TOKEN_SECRET)
            if(!(await this.authService.addRefreshToken({token: refreshToken, accountID: account.AccountID}))){
                throw new Error("ACCOUNT_NOT_FOUND")
            }
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true, // Makes the cookie inaccessible to JavaScript (prevents XSS attacks)
                secure: process.env.PROJECT_STATUS === 'production', // Ensures cookies are only sent over HTTPS in production
                sameSite: 'strict', // Prevents CSRF attacks
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration (in milliseconds)
              });
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.PROJECT_STATUS === 'production', // true in prod (HTTPS)
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
              });
            res.status(201).json({account:account})
        }catch(err){
            console.error(err)
            switch(err.message){
                case "NULL_FIELDS":
                    res.status(400).json({message: "Email and password cannot be null"})
                    break;
                case "ACCOUNT_NOT_FOUND":
                    res.status(404).json({message: "Account with given username can't be found"})
                    break;
                case "INCORRECT_PASSWORD":
                    res.status(401).json({message: "Invalid password"})
                    break;
                case "DUPLICATE_ENTRY":
                    res.status(409).json({message: 'User already has a refresh token!'})
                    break;
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message: 'SQL syntax error!'})
                    break;
                default:
                    res.status(500).json({message: "Unexpected Server error has occured"})
                    break;
            }
           
        }
        
    }
    /**
     * Generates a new access token from the refresh token
     * @param req contains the refresh token
     * @param res sends the new access token if valid
     */
    async getNewToken(req: Request, res: Response): Promise<void>{
        console.log("Cookies:", req.cookies);
        const refreshToken = req.cookies.refreshToken
        console.log(refreshToken)
        if(!refreshToken){
            throw new Error("INVALID_TOKEN")
        }
        try{
            if(await this.authService.verifyRefreshToken(refreshToken)){
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err :Error, account: Partial<Account>)=>{
                    if(err){
                        res.status(401).json({message:"Refresh token is not valid"})
                        return;
                    }
                    const accessToken = this.generateAccessToken({Email: account.Email})
                    res.cookie('accessToken', accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production', // true in prod (HTTPS)
                        sameSite: 'strict',
                        maxAge: 15 * 60 * 1000
                      });
                    res.status(201).json({accessToken: accessToken})
                })
            }else{
                res.status(403).json({message:"Refresh token is not valid"})
            }
        }catch(err){
            console.error(err)
            switch(err.message){
                case "UNKNOWN_TOKEN":
                    res.status(404).json({message: "Refresh token unknown in database"})
                    break;
                case 'INVALID_TOKEN':
                    res.status(400).json({message: "Refresh token can't be null or undefined"})
                    break;
                
                default:
                    res.status(500).json({message: "Unexpected Server error has occured"})
            }
        }
    }
    /**
     * Deletes the refresh token to unauthenticate it 
     * @param req containing the refresh token
     * @param res message containing the result
     */
    async deleteRefreshToken(req: Request, res: Response): Promise<void>{
        try{
            const hasDeleted: boolean = await this.authService.deleteRefreshToken(req.cookies.refreshToken)
            if(hasDeleted){
                res.clearCookie('accessToken');
                res.clearCookie('refreshToken', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // true for HTTPS in production
                    sameSite: 'strict',
                  });
                res.status(204).json({message: "Deleted Token"})
            }else{
                res.status(404).json({message: "Token Not Found"})
            }

        }catch(err){
            res.status(500).json({message: "Unexpected Server error has occured"})
        }
    }
    /**
     * Generates an access token based on the account's email
     * @param account, account with only email
     * @returns an new access token
     */
    generateAccessToken(account: Partial<Account>): string{
        return jwt.sign(account, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15min'})
    }


    
}