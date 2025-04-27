import { Pool, ResultSetHeader } from "mysql2/promise";
import { Booking } from "../types/Booking.type.js";
import { getInsertQuery, getUpdateQuery } from "../util/queryPrep.js";

export class BookingService{
    private pool
    constructor(pool :Pool){
        this.pool = pool
    }

    async getAllBookingToVIN(vin: string): Promise<Booking[]>{
        try{
            const [rows] : [Booking[]]= await this.pool.execute(`SELECT * FROM BOOKING WHERE vin = ?`, [vin])
           
            return rows
        }catch(err){
           
            switch(err.code){
                case "ER_PARSE_ERROR":
                    console.error('SQL syntax error in DELETE query:', err.message);
                    throw new Error("SQL_SYNTAX_ERROR");
                default:
                    console.error(err);
                    throw new Error("SERVER_ERROR");
            }
        
        }
    }
    async getAllBookingsToAccount(accountID: number): Promise<Booking[]>{
        try{
            const [rows]: [Booking[]] = await this.pool.execute(`SELECT * FROM BOOKING WHERE accountID = ?`, [accountID])
            
            return rows
        }catch(err){
            
            switch(err.code){
                case "ER_PARSE_ERROR":
                    console.error('SQL syntax error in DELETE query:', err.message);
                    throw new Error("SQL_SYNTAX_ERROR");
                default:
                    console.error(err);
                    throw new Error("SERVER_ERROR");
            }
        }
    }
    async getAllBookingsToOwner(ownerID: number): Promise<Booking[]>{
        try{
            const [rows]: [Booking[]] = await this.pool.execute(`SELECT * FROM BOOKING WHERE vin IN (SELECT vin FROM RV WHERE ownerID = ?)`, [ownerID])
            
            return rows
        }catch(err){
           
            switch(err.code){
                case "ER_PARSE_ERROR":
                    console.error('SQL syntax error in DELETE query:', err.message);
                    throw new Error("SQL_SYNTAX_ERROR");
                default:
                    console.error(err);
                    throw new Error("SERVER_ERROR");
            }
        }
    }
    async getBooking(bookingID: number): Promise<Booking>{
        try{
            const [rows] = await this.pool.execute(`SELECT * FROM BOOKING WHERE bookingID = ?`, [bookingID]) 
            const booking = rows[0]
            
            return booking
        }catch(err){
           
            switch(err.code){
                case "ER_PARSE_ERROR":
                    console.error('SQL syntax error in DELETE query:', err.message);
                    throw new Error("SQL_SYNTAX_ERROR");
                default:
                    console.error(err);
                    throw new Error("SERVER_ERROR");
            }
            
        }
    }
    async insertBooking(bookingData: Partial<Booking>):Promise<boolean>{
        try{
            const [result] = await this.pool.execute(getInsertQuery(bookingData, 'BOOKING'), Object.values(bookingData)) as [ResultSetHeader]
            return result.affectedRows > 0
        }catch(err){
            switch(err.code){
                case "ER_BAD_FIELD_ERROR":
                    console.error('Unknown field in update query:', err.message);
                throw new Error("INVALID_FIELD");
                case "ER_DUP_ENTRY":
                    console.error('Duplicate booking error:', err.message);
                    throw new Error("DUPLICATE_ENTRY");
                case "ER_BAD_NULL_ERROR":
                    console.error('Missing required field:', err.message);
                    throw new Error("MISSING_FIELD");
                case "ER_NO_REFERENCED_ROW_2":
                    console.error('Foreign key constraint fails:', err.message);
                throw new Error("FOREIGN_KEY_ERROR");
                case "ER_PARSE_ERROR":
                    console.error('SQL syntax error in DELETE query:', err.message);
                    throw new Error("SQL_SYNTAX_ERROR");
                default:
                    console.error('Unexpected DB error:', err);
                    throw new Error("SERVER_ERROR");
            }
        }
    }
    async updateBooking(bookingData: Partial<Booking>, bookingID: number):Promise<boolean>{
        delete bookingData["vin"]
        try{
            const [result] = await this.pool.execute(getUpdateQuery(bookingData,`BOOKING`, `bookingID`), [...Object.values(bookingData), bookingID]) as [ResultSetHeader]
            return result.affectedRows > 0
        }catch(err){
            switch(err.code){
                case "ER_BAD_FIELD_ERROR":
                    console.error('Unknown field in update query:', err.message);
                throw new Error("INVALID_FIELD");
                case "ER_BAD_NULL_ERROR":
                    console.error('Missing required field:', err.message);
                    throw new Error("MISSING_FIELD");
                case "ER_NO_REFERENCED_ROW_2":
                    console.error('Foreign key constraint fails:', err.message);
                    throw new Error("FOREIGN_KEY_ERROR");
                case "ER_PARSE_ERROR":
                    console.error('SQL syntax error in DELETE query:', err.message);
                    throw new Error("SQL_SYNTAX_ERROR");
                default:
                    console.error('Unexpected DB error:', err);
                    throw new Error("SERVER_ERROR");
            }
        }
    }
    async deleteBooking(bookingID: number):Promise<boolean>{
        try{
            const [result] = await this.pool.execute(`DELETE FROM BOOKING WHERE bookingID = ?`, [bookingID]) as [ResultSetHeader]
            return result.affectedRows > 0
        }catch(err){
            switch(err.code){
                case "ER_ROW_IS_REFERENCED":
                    console.error('Cannot delete Booking: Foreign key constraint violation', err.message);
                    throw new Error("FOREIGN_KEY_ERROR");
                case "ER_PARSE_ERROR":
                    console.error('SQL syntax error in DELETE query:', err.message);
                    throw new Error("SQL_SYNTAX_ERROR");
                default:
                    console.error('Unexpected DB error:', err);
                    throw new Error("SERVER_ERROR");
            }
        }
    }
}