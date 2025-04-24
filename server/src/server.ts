import express, {Express, Request, Response} from 'express';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import fileUpload from 'express-fileupload'
const app: Express = express();

app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
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