import { Pool, RowDataPacket } from "mysql2/promise";
import { Image } from "../types/Image.type.js";
/**
 * Service layer for the Image table
 */
export class ImageService{
    private pool: Pool;
    
    constructor(pool: Pool){
        this.pool = pool;
    }
    /**
     * Gets 8 random images from the image table
     * @returns an array of image tuples
     */
    async getRandomImages():Promise<Image[]>{
        try{
            const [rows] = await this.pool.execute<RowDataPacket[]>(
            `SELECT * FROM Image ORDER BY RAND() LIMIT 8`)
            return rows as Image[];
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
}