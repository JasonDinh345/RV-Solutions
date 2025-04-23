import { Pool, ResultSetHeader } from "mysql2/promise";
import { User } from "../types/User.type.js";

export class UserService{
    private pool;

    constructor(pool: Pool){
        this.pool = pool 
    }
    async getUser(email: string):Promise<User>{
        const [rows] = await this.pool.execute("SELECT * FROM users WHERE email = ?", [email])
        const user = rows[0];
        if (!user){
            throw new Error("INVALID_USER")
        }
        return user
    }
}