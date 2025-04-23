import { AuthService } from "../service/auth.service.js";
import jwt from 'jsonwebtoken'
import { User } from "../types/User.type.js";
import { Request, Response } from 'express';
export class AuthController{

    private authService;

    constructor(authService: AuthService){
        this.authService = authService
    }

    /**
     * Checks if the given username and password are valid
     * If valid, generates an access and refresh token
     * @param req, contains given fields
     * @param res, sends the tokens
     */
    async authenticateUser(req: Request, res: Response ): Promise<void>{
        try{
            const user: User = await this.authService.authenticateUser(req.body)
            if(!user){
                res.status(400).json({message: "Authorization Failed"})
            }
            const accessToken = this.generateAccessToken({email: user.email})
            const refreshToken = jwt.sign({email: user.email}, process.env.REFRESH_TOKEN_SECRET)
            await this.authService.addRefreshToken(refreshToken)
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // true in prod (HTTPS)
                sameSite: 'strict',
                maxAge: 3600000 // 1 hour
              });
            res.status(201).json({accessToken: accessToken, refreshToken: refreshToken})
        }catch(err){
            console.error(err)
            switch(err.message){
                case "INVALID_FIELDS":
                    res.status(400).json({message: "Username and password cannot be null"})
                    break;
                case "INVALID_USER":
                    res.status(404).json({message: "User with given username can't be found"})
                    break;
                case "INCORRECT_PASSWORD":
                    res.status(401).json({message: "Invalid password"})
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
        const refreshToken: string = req.body.token
        try{
            if(await this.authService.verifyRefreshToken(refreshToken)){
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err :Error, user: Partial<User>)=>{
                    if(err){
                        res.status(403).json({message:"Refresh token is not valid"})
                        return;
                    }
                    const accessToken = this.generateAccessToken({email: user.email})
                    res.cookie('accessToken', accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production', // true in prod (HTTPS)
                        sameSite: 'strict',
                        maxAge: 3600000 // 1 hour
                      });
                    res.status(201).json({accessToken: accessToken})
                })
            }else{
                res.status(403).json({message:"Refresh token is not valid"})
            }
        }catch(err){
            console.error(err)
            switch(err.message){
                
                case 'INVALID_TOKEN':
                    res.status(401).json({message: "Refresh token can't be null or undefined"})
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
            const hasDeleted: boolean = await this.authService.deleteRefreshToken(req.body.token)
            if(hasDeleted){
                res.clearCookie('accessToken');
                res.status(204).json({message: "Deleted Token"})
            }else{
                res.status(404).json({message: "Token Not Found"})
            }

        }catch(err){
            res.status(500).json({message: "Unexpected Server error has occured"})
        }
    }
    /**
     * Generates an access token based on the user's email
     * @param user, user with only email
     * @returns an new access token
     */
    generateAccessToken(user: Partial<User>): string{
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15min'})
    }
}