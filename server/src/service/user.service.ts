import { Pool, ResultSetHeader } from "mysql2/promise";
import { User } from "../types/User.type.js";
import { getInsertQuery, getUpdateQuery } from "../util/queryPrep.js";

export class UserService{
    private pool;

    constructor(pool: Pool){
        this.pool = pool 
    }
    async getUser(email: string):Promise<User>{
        const [rows] = await this.pool.execute("SELECT * FROM users WHERE email = ?", [email])
        const user = rows[0];
        if (!user){
            console.error("No user with email:", email)
            throw new Error("INVALID_USER")
        }
        return user
    }
    async insertUser(userData: Partial<User>): Promise<boolean>{
        try{
            const [result] = await this.pool.execute(getInsertQuery(userData, "user"),Object.values(userData)) as [ResultSetHeader];

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
    async updateUser(userData: Partial<User>, userID: number):Promise<boolean>{
        try{
            const [result] = await this.pool.execute(getUpdateQuery(userData, 'user', 'userID'), [...Object.values(userData), userID]) as [ResultSetHeader]
            if (result.affectedRows <= 0){
                console.error("No user with id:", userID)
                throw new Error("INVALID_USER")
            }
            return true
        }catch(err){
            if (err.code === 'ER_BAD_FIELD_ERROR') {
                console.error('Unknown field in update query:', err.message);
                throw new Error("INVALID_FIELD");
              } else if (err.code === 'ER_DATA_TOO_LONG') {
                console.error('Data too long for column:', err.message);
                throw new Error("DATA_TOO_LONG");
              } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                console.error('Foreign key constraint fails:', err.message);
                throw new Error("FOREIGN_KEY_ERROR");
              }
            console.error(err);
            throw new Error("SERVER_ERROR");
        }
    }
    async deleteUser(userID: number): Promise<boolean>{
        try{
            const [result] = await this.pool.execute(`DELETE FROM user WHERE userID = ?`, [userID]) as [ResultSetHeader]
            if (result.affectedRows <= 0){
                console.error("No user with id:", userID)
                throw new Error("INVALID_USER")
            }
            return true
        }catch(err){
            if (err.code === 'ER_ROW_IS_REFERENCED') {
                console.error('Cannot delete RV: Foreign key constraint violation', err.message);
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