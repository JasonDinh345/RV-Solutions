import { Pool } from "mysql2/promise";
import { User } from "../types/User.type.js";
import bcrypt from 'bcrypt'
export class UserService{
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
}