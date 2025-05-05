import { Pool, ResultSetHeader } from "mysql2/promise";
import { Image } from "../types/Image.type.js";
import { getInsertQuery, getUpdateQuery } from "../util/queryPrep.js";
export class ImageService{
    private pool : Pool

    constructor(pool : Pool){
        this.pool = pool
    }

    async insertImage(imageData: Partial<Image>, vin: string): Promise<boolean>{
        try{
            const [result] = await this.pool.execute<ResultSetHeader>(getInsertQuery({...imageData, vin: vin} , "image"), [...Object.values(imageData), vin])
            
            return result.affectedRows > 0
        }catch(err){
            if (err.code === 'ER_DUP_ENTRY') {
                console.error('Duplicate entry error:', err.message);
                throw new Error("DUPLICATE_ENTRY");
              } else if (err.code === 'ER_BAD_NULL_ERROR') {
                console.error('Missing required field:', err.message);
                throw new Error("MISSING_FIELD");
              } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                console.error('Foreign key constraint fails:', err.message);
                throw new Error("FOREIGN_KEY_ERROR");
              }else if (err.code === 'ER_PARSE_ERROR') {
                console.error('SQL syntax error:', err.message);
                throw new Error("SQL_SYNTAX_ERROR");
              }
            console.error('Unexpected DB error:', err);
            throw new Error("SERVER_ERROR");
        }
    }
    async updateImage(imageData: Partial<Image>, vin: string):Promise<boolean>{
 
        try{
            const [result] = await this.pool.execute<ResultSetHeader>(getUpdateQuery(imageData, `image`, `vin`),[...Object.values(imageData), vin])
            return result.affectedRows > 0
        }catch(err){
            if (err.code === 'ER_BAD_FIELD_ERROR') {
                console.error('Unknown field in update query:', err.message);
                throw new Error("INVALID_FIELD");
              } else if (err.code === 'ER_NULL_CONSTRAINT_VIOLATION') {
                console.error('Field can not be null!', err.message);
                throw new Error("NULL_FIELD");
              } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                console.error('Foreign key constraint fails:', err.message);
                throw new Error("FOREIGN_KEY_ERROR");
              }
            console.error(err);
            throw new Error("SERVER_ERROR");
        }
    }
    async deleteImage(vin: string):Promise<boolean>{
        try{
            const [result] = await this.pool.execute<ResultSetHeader>(`DELETE FROM Image WHERE vin = ?`, [vin]) 
          
            return result.affectedRows >0;
        }catch(err){
            if (err.code === 'ER_ROW_IS_REFERENCED') {
                console.error('Cannot delete Image: Foreign key constraint violation', err.message);
                throw new Error("FOREIGN_KEY_ERROR");
              } else if (err.code === 'ER_PARSE_ERROR') {
                console.error('SQL syntax error in DELETE query:', err.message);
                throw new Error("SQL_SYNTAX_ERROR");
              }
            console.error('Unexpected error while deleting image:', err);
            throw new Error("SERVER_ERROR");
        }
    }
}
