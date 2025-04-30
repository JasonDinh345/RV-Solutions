import express, {Express, Request, Response} from 'express';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import dotenv from 'dotenv'
import authRouter from './route/auth.route.js';
import bookingRouter from './route/booking.route.js';
import accountRouter from './route/account.route.js';
import rvRouter from './route/RV.route.js';
import imageRouter from './route/image.route.js';
import damageReportRouter from './route/damageReport.route.js';
const app: Express = express();
dotenv.config()
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
app.use('/auth', authRouter);
app.use('/account', accountRouter)
app.use('/RV', rvRouter)
app.use('/image', imageRouter)
app.use('/booking', bookingRouter)
app.use('/damageReport', damageReportRouter)

app.listen(4000,()=>{
    console.log("Server running!")
})
