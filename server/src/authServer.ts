import express, {Express, Request, Response} from 'express';

import cors from 'cors'
const authApp: Express = express();

authApp.use(cors());
authApp.use(express.json());
/**
 * Request to see if API is running
 */
authApp.get("/", (req : Request, res: Response)=>{
    res.status(200).send('Auth Server is up and running');
})
/**
 * Router for users Table
 */



export  {authApp}