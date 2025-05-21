import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Account } from "../types/Account.type.js";
import { getInsertQuery, getUpdateQuery } from "../util/queryPrep.js";
import bcrypt from 'bcrypt'
export class AccountService{
    private pool :Pool;

    constructor(pool: Pool){
        this.pool = pool 
    }
    async getAccount(AccountID: number):Promise<Account>{
    
        try{
            const [rows] = await this.pool.execute<RowDataPacket[]>("SELECT * FROM Account WHERE AccountID = ?", [AccountID]);

            // Check if any rows were returned
            if (rows.length === 0) {
            throw new Error("ACCOUNT_NOT_FOUND"); // Account doesn't exist
            }

            return rows[0] as Account; // Return the first account if it exists
        }catch(err){
            console.error("Unexpected server error has occured!")
            throw new Error("SERVER_ERROR")
        }
    }
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