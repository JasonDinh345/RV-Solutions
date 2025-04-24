import express, {Express, Request, Response} from 'express';
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app: Express = express();
app.use(cors())
app.use(express.json());
app.use(cookieParser());
/**
 * Request to see if API is running
 */
app.get("/", (req : Request, res: Response)=>{
    res.status(200).send('API is up and running');
})
/**
 * Router for users Table
 */


export {app}