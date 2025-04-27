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
            if(!accountData.email || !accountData.password){
                throw new Error("INVALID_FIELDS")
            }
            const [rows] = await this.pool.query("SELECT * FROM account WHERE email = ?",[accountData.email]);
            const account = rows[0];
            if(!account){
                throw new Error("INVALID_USER")
            }
            try{
                if(await bcrypt.compare(accountData.password, account.password)){
                    return account
                }
                throw new Error("INCORRECT_PASSWORD")
            }catch(err){
                console.error("Authentication error: ", err.message)
                if(err.message == "INCORRECT_PASSWORD"){
                    throw new Error("INCORRECT_PASSWORD")
                }
                throw new Error("SERVER_ERROR")
            }
        }
        /**
         * Adds the newly generated refresh token in the db
         * @param refreshToken, token to generate a new access token
         */
        async addRefreshToken(refreshToken: RefreshToken): Promise<void>{
            
            await this.pool.execute(getInsertQuery(refreshToken, "refreshToken"),[Object.values(refreshToken)])
        }
        /**
         * Checks if the refresh token is valid or not
         * @param refreshToken , token to generate a new access token
         * @returns true if in the db, false if not
         */
        async verifyRefreshToken(refreshToken: Partial<RefreshToken>): Promise<boolean>{
            if(!refreshToken){
                throw new Error("INVALID_TOKEN")
            }
            const [result] = await this.pool.execute("SELECT * FROM refreshToken WHERE token = ?", [refreshToken.token])
            return result[0] ? true : false
        }
        /**
         * Removes the refresh token from the db
         * Unauthenticates the refresh token
         * @param refreshToken , token to generate a new access token
         * @returns true if delete, false if else
         */
        /** Delete a refresh token by its raw value */
        async deleteRefreshToken(refreshToken: Partial<RefreshToken>): Promise<boolean> {
        if (!refreshToken) {
        throw new Error("INVALID_TOKEN");
        }

        const [result] = await this.pool.execute<ResultSetHeader>(
            'DELETE FROM refreshToken WHERE token = ?',[refreshToken.token]);

        return result.affectedRows > 0;
        }
}