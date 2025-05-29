import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Account } from "../types/Account.type.js";
import { getInsertQuery, getUpdateQuery } from "../util/queryPrep.js";
import bcrypt from 'bcrypt'
/**
 * Service layer for the Account Table
 */
export class AccountService{
    private pool :Pool;

    constructor(pool: Pool){
        this.pool = pool 
    }
    /**
     * Gets all account columns, the num of RVs currently hosting
     * and the num of bookings made from a given user
     * @param AccountID ID relating to an account
     * @returns an object with the specified columns
     */
    async getAccount(AccountID: number):Promise<Account>{
    
        try{
            const [rows] = await this.pool.execute<RowDataPacket[]>(`
                SELECT a.*, COUNT(DISTINCT r.VIN) AS "TotalRVCount", COUNT(DISTINCT b.BookingID) AS "TotalBookingCount" 
                FROM Account a 
                JOIN RV r ON a.AccountID = r.OwnerID 
                JOIN Booking b on a.AccountID = b.AccountID
                WHERE a.AccountID = ?`, [AccountID]);

            // Check if any rows were returned
            if (rows.length === 0) {
            throw new Error("ACCOUNT_NOT_FOUND"); // Account doesn't exist
            }

            return rows[0] as Account; // Return the first account if it exists
        }catch(err){
            console.log(err)
            console.error("Unexpected server error has occured!")
            throw new Error("SERVER_ERROR")
        }
    }
    /**
     * Inserts an account into the table
     * @param accountData object to be inserted
     * @returns a boolean if the insertion went through
     */
    async insertAccount(accountData: Omit<Account, 'AccountID'>): Promise<boolean>{
        
        const hashedPass = await bcrypt.hash(accountData.Password!, 10)
        accountData.Password = hashedPass;
        try{
            const [result] = await this.pool.execute<ResultSetHeader>(getInsertQuery(accountData, "Account"),Object.values(accountData));

            return result.affectedRows > 0;
        }catch(err){
            if (err.code === 'ER_DUP_ENTRY') {
                console.error('Duplicate entry error:', err.message);
                throw new Error("DUPLICATE_ENTRY");
              } else if (err.code === 'ER_BAD_NULL_ERROR') {
                console.error('Missing required field:', err.message);
                throw new Error("MISSING_FIELD");
              } else if (err.code === 'ER_PARSE_ERROR') {
                console.error('SQL syntax error:', err.message);
                throw new Error("SQL_SYNTAX_ERROR");
              }
            console.error('Unexpected DB error:', err);
            throw new Error("SERVER_ERROR");  
        }
    }
    /**
     * Updates a tuple in the table
     * @param accountData an object with the updated fields
     * @param AccountID ID relating to an account
     * @returns a boolean if the update went through
     */
    async updateAccount(accountData: Partial<Account>, AccountID: number):Promise<boolean>{
        
        if(accountData.Password){
            const hashedPass = await bcrypt.hash(accountData.Password, 10)
            accountData.Password = hashedPass;
        }
       
        try{
            const [result] = await this.pool.execute<ResultSetHeader>(getUpdateQuery(accountData, 'account', 'AccountID'), [...Object.values(accountData), AccountID])
           
            return result.affectedRows > 0
        }catch(err){
            switch(err.code){
                case "ER_BAD_FIELD_ERROR":
                    console.error('Unknown field in update query:', err.message);
                    throw new Error("INVALID_FIELD");
                case "ER_DUP_ENTRY":
                    console.error('Email already exists:', err.message);
                    throw new Error("DUPLICATE_ENTRY");
                case "ER_NO_REFERENCED_ROW_2":
                    console.error('Foreign key constraint fails:', err.message);
                    throw new Error("FOREIGN_KEY_ERROR");
                case "ER_PARSE_ERROR":
                    console.error('SQL syntax error:', err.message);
                    throw new Error("SQL_SYNTAX_ERROR");
                default:
                    console.error(err);
                    throw new Error("SERVER_ERROR");

            }
            
        }
    }
    /**
     * Deletes a tuple from the table
     * @param AccountID an ID relating to an account 
     * @returns a boolean if the deletion went through
     */
    async deleteAccount(AccountID: number): Promise<boolean>{
        try{
            const [result] = await this.pool.execute<ResultSetHeader>(`DELETE FROM account WHERE AccountID = ?`, [AccountID])
            return result.affectedRows > 0
        }catch(err){
            if (err.code === 'ER_ROW_IS_REFERENCED') {
                console.error('Cannot delete: Foreign key constraint violation', err.message);
                throw new Error("FOREIGN_KEY_ERROR");
              } else if (err.code === 'ER_PARSE_ERROR') {
                console.error('SQL syntax error in DELETE query:', err.message);
                throw new Error("SQL_SYNTAX_ERROR");
              }
            console.error('Unexpected error while deleting RV:', err);
            throw new Error("SERVER_ERROR");
        }
    }
}