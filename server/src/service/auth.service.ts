import { Pool, ResultSetHeader } from "mysql2/promise";
import bcrypt from 'bcrypt'
import { Account } from "../types/Account.type.js";
import { RefreshToken } from "../types/RefreshToken.type.js";
import { getInsertQuery } from "../util/queryPrep.js";
export class AuthService{
    
    private pool : Pool

    constructor(pool: Pool){
        this.pool = pool;
    }
    /**
         * Authenticatates account if correct pass and email
         * @param accountData, fields to be authenticated 
         * @returns an AuthResult(boolean, message?, account?) to see if the authetication 
         * passed or not, passes the account if successful
         */
        async authenticateUser(accountData: Partial<Account>): Promise<Account>{
            if(!accountData.Email || !accountData.Password){
                throw new Error("NULL_FIELDS")
            }
            const [rows] = await this.pool.execute("SELECT * FROM account WHERE email = ?",[accountData.Email]);
            const account = rows[0];
            if(!account){
                throw new Error("INVALID_USER")
            }
            try{
                if(await bcrypt.compare(accountData.Password, account.Password)){
                    return account
                }
                throw new Error("INCORRECT_PASSWORD")
            }catch(err){
                console.error("Authentication error: ", err.message)
                throw new Error(err.message)
            }
        }
   
        /**
         * Adds the newly generated refresh token in the db
         * @param refreshToken, token to generate a new access token
         */
        async addRefreshToken(refreshTokenData: RefreshToken): Promise<boolean>{
            
            try{
                const [result] = await this.pool.execute<ResultSetHeader>(getInsertQuery(refreshTokenData, "refreshToken"), Object.values(refreshTokenData))
                return result.affectedRows > 0
            }catch(err){
                switch(err.code){
                    case "ER_DUP_ENTRY":
                        console.error('Duplicate user with refresh token error:', err.message);
                        throw new Error("DUPLICATE_ENTRY");
                    case "ER_PARSE_ERROR":
                        console.error('SQL syntax error in DELETE query:', err.message);
                        throw new Error("SQL_SYNTAX_ERROR");
                    default:
                        console.error('Unexpected DB error:', err);
                        throw new Error("SERVER_ERROR");
                }
            }
        }
        /**
         * Checks if the refresh token is valid or not
         * @param refreshToken , token to generate a new access token
         * @returns true if in the db, false if not
         */
        async verifyRefreshToken(refreshToken: string): Promise<boolean>{
            try{
                if(!refreshToken){
                    throw new Error("INVALID_TOKEN")
                }
                
                const [rows] = await this.pool.execute("SELECT * FROM refreshToken WHERE token = ?", [refreshToken])
                if ((rows as any[]).length === 0) {
                    throw new Error("UNKNOWN_TOKEN");
                }
                return true
            }catch(err){
                console.error(err)
                throw new Error(err.message)
            }
        }
        /**
         * Removes the refresh token from the db
         * Unauthenticates the refresh token
         * @param refreshToken , token to generate a new access token
         * @returns true if delete, false if else
         */
        /** Delete a refresh token by its raw value */
        async deleteRefreshToken(refreshToken: string): Promise<boolean> {
            try{
                if (!refreshToken) {
                    throw new Error("INVALID_TOKEN");
                    }
            
                    const [result] = await this.pool.execute<ResultSetHeader>(
                        'DELETE FROM refreshToken WHERE token = ?',[refreshToken]);
            
                    return result.affectedRows > 0;
            }catch(err){
                switch(err.code){
                    case "ER_ROW_IS_REFERENCED":
                        console.error('Cannot delete: Foreign key constraint violation', err.message);
                        throw new Error("FOREIGN_KEY_ERROR");
                    case "ER_PARSE_ERROR":
                        console.error('SQL syntax error in DELETE query:', err.message);
                        throw new Error("SQL_SYNTAX_ERROR");
                    default:
                        console.error(err)
                        throw new Error(err.message)
                }
            }
        }
}