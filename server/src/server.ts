import express, {Express, Request, Response} from 'express';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import dotenv from 'dotenv'
import authRouter from './route/auth.route.js';
import bookingRouter from './route/booking.route.js';
import accountRouter from './route/account.route.js';
import rvRouter from './route/RV.route.js';

import damageReportRouter from './route/damageReport.route.js';
import path from 'path';
import imageRouter from './route/image.route.js';

const app: Express = express();
dotenv.config()
app.use(cors({
    origin: "http://localhost:5173",  // ✅ must be explicit, not "*"
    credentials: true,                // ✅ allows cookies to be sent
  }));
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
/**
 * Request to see if API is running
 */
app.get("/", (req : Request, res: Response)=>{
    res.status(200).sendFile(path.join(process.cwd(), 'public', 'home.html'));
})
/** Router for auth router */
app.use('/auth', authRouter);
/** Router for account router */
app.use('/account', accountRouter)
/** Router for RV router */
app.use('/RV', rvRouter)
/** Router for booking router */
app.use('/booking', bookingRouter)
/** Router for image router */
app.use("/image", imageRouter)
/** Router for damage report router */
app.use('/damageReport', damageReportRouter)


app.listen(1231,()=>{
    console.log("Server running!")
})
