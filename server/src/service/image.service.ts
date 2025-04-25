import { Pool, ResultSetHeader } from "mysql2";
import { Image } from "../types/Image.type.js";
import { getInsertQuery, getUpdateQuery } from "../util/queryPrep.js";
export class ImageService{
    private pool

    constructor(pool : Pool){
        this.pool = pool
    }

    async insertImage(imageData: Partial<Image>, rvVin: string): Promise<number>{
        try{
            const [result] = await this.pool.execute(getInsertQuery({...imageData, rvVin: rvVin} , "image"), [...Object.values(imageData), rvVin]) as [ResultSetHeader]
            const insertId = result.insertId;
            if(!insertId){
                throw new Error("FAILED_UPLOAD")
            }
            return insertId
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
    async updateImage(imageData: Partial<Image>, rvVin: string):Promise<boolean>{
 
        try{
            const [result] = await this.pool.execute(
                getUpdateQuery(imageData, `image`, `rvVin`),[...Object.values(imageData), rvVin]
            ) as [ResultSetHeader]
            return result.affectedRows > 0
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
    async deleteImage(rvVin: string):Promise<boolean>{
        try{
            const [result] = await this.pool.execute(
                `DELETE FROM Image WHERE rvVin = ?`, [rvVin]
            ) as [ResultSetHeader]
            if (result.affectedRows === 0) {
                console.error('Image not found referencing RV with vin:', rvVin);
                throw new Error("IMAGE_NOT_FOUND");
              }
          
            return true;
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
