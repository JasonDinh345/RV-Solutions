import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Booking, BookingwRV } from "../types/Booking.type.js";
import { getInsertQuery, getUpdateQuery } from "../util/queryPrep.js";
/**
 * Service layer for the Booking table
 */
export class BookingService{
    private pool: Pool
    constructor(pool :Pool){
        this.pool = pool
    }
    /**
     * Gets all BookingID, their start and end date, and the account who rented
     * the RV relating to a RV 
     * @param vin a vin relating to a RV
     * @returns an array of objects with the specified columns
     */
    async getAllBookingToVIN(vin: string): Promise<Partial<Booking>[]>{
        try{
            const [rows] = await this.pool.execute<RowDataPacket[]>(`
                SELECT BookingID, StartDate, EndDate, a.Name 
                FROM BOOKING
                JOIN Account a ON Booking.AccountID = a.AccountID 
                WHERE vin = ?`, [vin]);
            return rows as Partial<Booking>[];
        }catch(err){
           
            switch(err.code){
                case "ER_PARSE_ERROR":
                    console.error('SQL syntax error in SELECT query:', err.message);
                    throw new Error("SQL_SYNTAX_ERROR");
                default:
                    console.error(err);
                    throw new Error("SERVER_ERROR");
            }
        
        }
    }
    /**
     * Gets all BookingID that an account has rented
     * @param accountID an ID relating to an account
     * @returns an array of objects with their BookingID
     */
    async getAllBookingsToAccount(accountID: number): Promise<Partial<Booking>[]>{
        try{
            const [rows] = await this.pool.execute<RowDataPacket[]>(`SELECT BookingID FROM BOOKING WHERE accountID = ?`, [accountID])
            
            return rows as Partial<Booking>[];
        }catch(err){
            
            switch(err.code){
                case "ER_PARSE_ERROR":
                    console.error('SQL syntax error in SELECT query:', err.message);
                    throw new Error("SQL_SYNTAX_ERROR");
                default:
                    console.error(err);
                    throw new Error("SERVER_ERROR");
            }
        }
    }
    /**
     * Gets all booking data, the make and model of the RV, and
     * the relating image to the RV based on all booking an account
     * as purchased and puts it all in a HTML table
     * @param accountID an ID relating to an account
     * @returns a HTML table displaying the data
     */
    async getAllBookingsToAccountHTML(accountID: number): Promise<any>{
        try{
            const [rows] = await this.pool.execute<RowDataPacket[]>(`
                SELECT b.*,
                r.Make,
                r.Model,
                i.SmallImageURL AS ImageURL
                FROM BOOKING b 
                JOIN RV r ON r.VIN = b.VIN
                JOIN Image i on i.VIN = r.VIN 
                WHERE b.AccountID = ?
                ORDER BY b.StartDate ASC`, [accountID])
            let html =``;
            
            if (rows.length === 0) {
                html += `<p>No results found.</p>`;
            } else {    
                html = 
                `<table class="accountTable">
                    <thead>
                        <tr>
                            <th>RV</th>
                            <th>Model</th>
                            <th>Make</th>
                            <th>Status</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Total Cost</th>
                        </tr>
                    </thead>
                    <tbody>`
                rows.forEach(bookingData =>{
                    html += `
                    <tr>
                        <td class="tableImage"><img src=${bookingData.ImageURL} ></img></td>
                        <td>${bookingData.Make}</td>
                        <td>${bookingData.Model}</td>
                        <td>${bookingData.Status}</td>
                        <td>${bookingData.StartDate}</td>
                        <td>${bookingData.EndDate}</td>
                        <td>${bookingData.TotalCost}</td>
                    </tr>
                    `
                })
                html += `
                </tbody>
                </table>
                `;
            }
            return html
        }catch(err){
            console.log(err)
            switch(err.code){
                case "ER_PARSE_ERROR":
                    console.error('SQL syntax error in SELECT query:', err.message);
                    throw new Error("SQL_SYNTAX_ERROR");
                default:
                    console.error(err);
                    throw new Error("SERVER_ERROR");
            }
        }
    }
    /**
     * Gets the booking tuple, the make and model of the RV, and
     * the relating image to the RV based on a booking 
     * @param bookingID ID relating to a tuple
     * @returns an object with the specified columns
     */
    async getBookingDetails(bookingID: number): Promise<BookingwRV>{
        try{
            const [rows] = await this.pool.execute<RowDataPacket[]>(`
                SELECT b.*,
                r.Make,
                r.Model,
                i.SmallImageURL AS ImageURL
                FROM BOOKING b 
                JOIN RV r ON r.VIN = b.VIN
                JOIN Image i on i.VIN = r.VIN
                WHERE bookingID = ?`, 
                [bookingID]) 
            if (rows.length === 0) {
                return null; 
            }
            const booking = rows[0] as BookingwRV
            
            return booking 
        }catch(err){
           
            switch(err.code){
                case "ER_PARSE_ERROR":
                    console.error('SQL syntax error in SELECT query:', err.message);
                    throw new Error("SQL_SYNTAX_ERROR");
                default:
                    console.error(err);
                    throw new Error("SERVER_ERROR");
            }
            
        }
    }
    /**
     * Inserts an object into the table
     * @param bookingData object to be inserted
     * @returns a boolean stating if the insertion went through
     */
    async insertBooking(bookingData: Omit<Booking,'BookingID'>):Promise<boolean>{
        try{
            const [result] = await this.pool.execute<ResultSetHeader>(getInsertQuery(bookingData, 'BOOKING'), Object.values(bookingData)) 
            return result.affectedRows > 0
        }catch(err){
            switch(err.code){
                case "ER_BAD_FIELD_ERROR":
                    console.error('Unknown field in insert query:', err.message);
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
                    console.error('SQL syntax error in UPDATE query:', err.message);
                    throw new Error("SQL_SYNTAX_ERROR");
                default:
                    console.error('Unexpected DB error:', err);
                    throw new Error("SERVER_ERROR");
            }
        }
    }
    /**
     * Updates a tuple based on a object
     * @param bookingData object with the updated fields
     * @param bookingID ID relating to a tuple
     * @returns a boolean statng if the update went through
     */
    async updateBooking(bookingData: Partial<Booking>, bookingID: number):Promise<boolean>{
        delete bookingData["vin"]
        try{
            const [result] = await this.pool.execute<ResultSetHeader>(getUpdateQuery(bookingData,`BOOKING`, `bookingID`), [...Object.values(bookingData), bookingID])
            return result.affectedRows > 0
        }catch(err){
            switch(err.code){
                case "ER_BAD_FIELD_ERROR":
                    console.error('Unknown field in update query:', err.message);
                throw new Error("INVALID_FIELD");
                case "ER_NULL_CONSTRAINT_VIOLATION":
                    console.error('Field can not be null:', err.message);
                    throw new Error("NULL_FIELD");
                case "ER_NO_REFERENCED_ROW_2":
                    console.error('Foreign key constraint fails:', err.message);
                    throw new Error("FOREIGN_KEY_ERROR");
                case "ER_PARSE_ERROR":
                    console.error('SQL syntax error in UPDATE query:', err.message);
                    throw new Error("SQL_SYNTAX_ERROR");
                default:
                    console.error('Unexpected DB error:', err);
                    throw new Error("SERVER_ERROR");
            }
        }
    }
    /**
     * Deletes a tuple from the table
     * @param bookingID ID relating to a tuple
     * @returns a boolean statng if the deletion went through
     */
    async deleteBooking(bookingID: number):Promise<boolean>{
        try{
            const [result] = await this.pool.execute<ResultSetHeader>(`DELETE FROM BOOKING WHERE bookingID = ?`, [bookingID]) 
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