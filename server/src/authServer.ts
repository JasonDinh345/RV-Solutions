import express, {Express, Request, Response} from 'express';
import authRouter from './route/auth.route.js';
import cors from 'cors'
import cookieParser from 'cookie-parser'
const authApp: Express = express();

authApp.use(cors());
authApp.use(express.json());
authApp.use(cookieParser());
/**
 * Request to see if API is running
 */
authApp.get("/", (req : Request, res: Response)=>{
    res.status(200).send('Auth Server is up and running');
})
/**
 * Router for users Table
 */
authApp.use('/auth', authRouter);



export  {authApp}