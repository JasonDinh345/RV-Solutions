import { Pool, ResultSetHeader } from "mysql2/promise";
import bcrypt from 'bcrypt'
import { User } from "../types/User.type.js";
import { RefreshToken } from "../types/RefreshToken.type.js";
export class AuthService{
    
    private pool : Pool

    constructor(pool: Pool){
        this.pool = pool;
    }
    /**
         * Authenticatates user if correct pass and username
         * @param userData, fields to be authenticated 
         * @returns an AuthResult(boolean, message?, user?) to see if the authetication 
         * passed or not, passes the user if successful
         */
        async authenticateUser(userData: Partial<User>): Promise<User>{
            if(!userData.email || !userData.password){
                throw new Error("INVALID_FIELDS")
            }
            const [rows] = await this.pool.query("SELECT * FROM users WHERE email = ?",[userData.email]);
            const user = rows[0];
            if(!user){
                throw new Error("INVALID_USER")
            }
            try{
                if(await bcrypt.compare(userData.password, user.password)){
                    return user
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
        async addRefreshToken(refreshToken: Partial<RefreshToken>): Promise<void>{
            await this.pool.execute("INSERT INTO refresh_tokens (refresh_token) VALUES ?",[refreshToken])
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
            const [result] = await this.pool.execute("SELECT * FROM refresh_tokens WHERE refresh_token = ?", [refreshToken])
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
            'DELETE FROM refresh_tokens WHERE refresh_token = ?',[refreshToken]);

        return result.affectedRows > 0;
        }
}