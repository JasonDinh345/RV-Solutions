import { BookingService } from "../service/booking,service.js";
import { Request, Response } from 'express';
import { Booking } from "../types/Booking.type.js";

export class BookingController{
    private bookingService : BookingService

    constructor(bookingService: BookingService){
        this.bookingService = bookingService
    }

    async getAllBookingToVIN(req:Request, res: Response):Promise<void>{
        try{
            const vin = req.body.vin
            if(!vin){
                throw new Error("INVALID_VIN")
            }
            const bookings : Booking[] = await this.bookingService.getAllBookingToVIN(vin)
            if(bookings.length > 0){
                res.status(200).json(bookings)
            }else{
                res.status(404).json({message: `No booking found with given VIN: ${vin}`})
            }
        }catch(err){

        }
    }
    async getAllBookingsToAccount(req:Request, res: Response):Promise<void>{
        try{
            const accountID = req.body.accountID
            if(!accountID){
                throw new Error("INVALID_ACCOUNT")
            }
            const bookings : Booking[] = await this.bookingService.getAllBookingToVIN(accountID)
            if(bookings.length > 0){
                res.status(200).json(bookings)
            }else{
                res.status(404).json({message: `No booking found with given accountID: ${accountID}`})
            }
        }catch(err){

        }
    }
    async getAllBookingsToOwner(req:Request, res: Response):Promise<void>{
        try{
            const ownerID = req.body.ownerID
            if(!ownerID){
                throw new Error("INVALID_OWNER")
            }
            const bookings : Booking[] = await this.bookingService.getAllBookingToVIN(ownerID)
            if(bookings.length > 0){
                res.status(200).json(bookings)
            }else{
                res.status(404).json({message: `No booking found with an RV with ownerID: ${ownerID}`})
            }
        }catch(err){

        }
    }
}