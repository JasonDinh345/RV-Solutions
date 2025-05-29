import { BookingService } from "../service/booking,service.js";
import { Request, Response } from 'express';
import { Booking, BookingwRV } from "../types/Booking.type.js";

export class BookingController{
    private bookingService : BookingService

    constructor(bookingService: BookingService){
        this.bookingService = bookingService
    }
     /**
     * Retrives and sends all bookings linked to a RV
     * @param req request from the user
     * @param res response from the the backend
     */
    async getAllBookingToVIN(req:Request, res: Response):Promise<void>{
        try{
            const vin = req.params.vin
            if(!vin){
                throw new Error("INVALID_VIN")
            }
            const bookings : Partial<Booking>[] = await this.bookingService.getAllBookingToVIN(vin)
            if(bookings.length > 0){
                res.status(200).json(bookings)
            }else{
                res.status(404).json({message: `No booking found with given VIN: ${vin}`})
            }
        }catch(err){
            switch(err.message){
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message: `SQL syntax error!`})
                    break;
                default:
                    res.status(500).json({message: `Server error occured!`})
                    break;
            }
        }
    }
    /**
     * Retrives and sends all bookings linked to an account
     * @param req request from the user
     * @param res response from the the backend
     */
    async getAllBookingsToAccount(req:Request, res: Response):Promise<void>{
        try{
            const accountID = Number(req.params.accountID)
            if(!accountID){
                throw new Error("INVALID_ACCOUNT")
            }
            const bookings : Partial<Booking>[] = await this.bookingService.getAllBookingsToAccount(accountID)
            if(bookings.length > 0){
                res.status(200).json(bookings)
            }else{
                res.status(404).json({message: `No booking found with given accountID: ${accountID}`})
            }
        }catch(err){
            switch(err.message){
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message: `SQL syntax error!`})
                    break;
                default:
                    res.status(500).json({message: `Server error occured!`})
                    break;
            }
        }
    }
    /**
     * Retrives and send a HTML table of all bookings linked to an account
     * @param req request from the user
     * @param res response from the the backend
     */
    async getAllBookingsToAccountHTML(req:Request, res: Response):Promise<void>{
        try{
            const accountID = Number(req.params.accountID)
            if(!accountID){
                throw new Error("INVALID_ACCOUNT")
            }
            const bookings = await this.bookingService.getAllBookingsToAccountHTML(accountID)
        
          
                res.status(200).send(bookings)
           
                
           
        }catch(err){
            switch(err.message){
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message: `SQL syntax error!`})
                    break;
                default:
                    res.status(500).json({message: `Server error occured!`})
                    break;
            }
        }
    }
    
   /**
     * Retrives and send a given booking
     * @param req request from the user
     * @param res response from the the backend
     */
    async getBooking(req:Request, res: Response):Promise<void>{
        try{
            const bookingID = Number(req.params.bookingID)
            const booking: BookingwRV = await this.bookingService.getBookingDetails(bookingID)
            
            if(booking){
                res.status(200).json(booking)
            }else{
                res.status(404).json({message: `No booking found with ID: ${bookingID}`})
            }
        }catch(err){
            switch(err.message){
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message: `SQL syntax error!`})
                    break;
                default:
                    res.status(500).json({message: `Server error occured!`})
                    break;
            }
        }
    }
    /**
     * Retrives data and send the response of the insertion
     * @param req request from the user
     * @param res response from the the backend
     */
    async insertBooking(req:Request, res: Response):Promise<void>{
        try{
            const bookingData = req.body
            if(await this.bookingService.insertBooking(bookingData)){
                res.status(201).json({message: "Successfully inserted booking!"})
            }else{
                res.status(400).json({message:"Couldn't insert booking into database!"})
            }
        }catch(err){
            switch(err.message){
                case "INVALID_FIELD":
                    res.status(400).json({message:`Unknown fields in Booking data: ${req.body}`})
                    break;
                case "MISSING_FIELD":
                    res.status(400).json({message:`Missing fields in Booking data: ${req.body}`})
                    break;
                case "FOREIGN_KEY_ERROR":
                    res.status(409).json({message:`Foreign key error!`})
                    break;
                case "DUPLICATE_ENTRY":
                    res.status(409).json({message: `Booking already exists with ID`})
                    break;
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message: `SQL syntax error!`})
                    break;
                default:
                    res.status(500).json({message: `Server error occured!`})
                    break;
            }
        }
    }
    /**
     * Retrives data and send the response of the update
     * @param req request from the user
     * @param res response from the the backend
     */
    async updateBooking(req:Request, res: Response):Promise<void>{
        try{
            const bookingData = req.body.bookingData
            const bookingID = req.body.bookingID
            if(await this.bookingService.updateBooking(bookingData, bookingID)){
                res.status(204).json({message: "Successfully updated booking!"})
            }else{
                res.status(404).json({message: `Couldn't find booking with ID: ${bookingID}`})
            }
        }catch(err){
            switch(err.message){
                case "INVALID_FIELD":
                    res.status(400).json({message:`Unknown fields in RV data: ${req.body}`})
                    break;
                case "NULL_FIELD":
                    res.status(400).json({message:`Field can not be null!: ${req.body}`})
                    break;
                case "FOREIGN_KEY_ERROR":
                    res.status(409).json({message:`Foreign key error!`})
                    break;
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message: `SQL syntax error!`})
                    break;
                default:
                    res.status(500).json({message: `Server error occured!`})
                    break;
            }
        }
    }
    /**
     * Retrives data and send the response of the deletion
     * @param req request from the user
     * @param res response from the the backend
     */
    async deleteBooking(req:Request, res: Response):Promise<void>{
        try{
            const bookingID = req.body.bookingID
            if(await this.bookingService.deleteBooking(bookingID)){
                res.status(204).json({message: `Successfully deleted booking!`})
            }else{
                res.status(404).json({message: `Couldn't find booking with ID: ${bookingID}`}) 
            }
        }catch(err){
            switch(err.message){
                case "FOREIGN_KEY_ERROR":
                    res.status(409).json({message:`Foreign key error!`})
                    break;
                case "SQL_SYNTAX_ERROR":
                    res.status(500).json({message: `SQL syntax error!`})
                    break;
                default:
                    res.status(500).json({message: `Server error occured!`})
                    break;
            }
        }
    }
}