import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { RV, RVwImage } from "../types/RV.type.js";
import { getInsertQuery, getUpdateQuery } from "../util/queryPrep.js";

export class RVService{
    private pool: Pool;
    
    constructor(pool : Pool){
        this.pool = pool;
    }
    
    async getAllRV():Promise<RVwImage[]>{
        try{
          const [rows] = await this.pool.query<RowDataPacket[]>(`SELECT RV.*, Image.smallImageURL AS "imageURL" FROM RV JOIN Image ON RV.vin = Image.vin WHERE RV.isAvailable = true`);
          return rows as RVwImage[] ;
        }catch(err){
          switch(err.code){
            case "ER_PARSE_ERROR":
                console.error('SQL syntax error in DELETE query:', err.message);
                throw new Error("SQL_SYNTAX_ERROR");
            default:
                console.error(err);
                throw new Error("SERVER_ERROR");
          }
        }
    }
    async getAllRVwOwner(ownerID: number):Promise<RVwImage[]>{
      if(!ownerID || ownerID < 0){
        throw new Error("INVALID_ID");
      }
        try{
          const [rows] = await this.pool.execute<RowDataPacket[]>(`SELECT RV.*, Image.smallImageURL AS "imageURL" FROM RV JOIN Image ON RV.vin = Image.vin WHERE RV.ownerID = ?`,[ownerID] );
          return rows as RVwImage[] ;
        }catch(err){
          switch(err.code){
            case "ER_PARSE_ERROR":
                console.error('SQL syntax error in DELETE query:', err.message);
                throw new Error("SQL_SYNTAX_ERROR");
            default:
                console.error(err);
                throw new Error(err.message);
          }
        }
    }
    async getRV(vin : String):Promise<RVwImage>{
        try{
          const [rows] = await this.pool.execute<RowDataPacket[]>(`SELECT RV.*, Image.imageURL AS "imageURL" FROM RV JOIN Image ON RV.vin = Image.vin WHERE RV.vin = ?`, [vin])

          return rows[0] as RVwImage;
        }catch(err){
          switch(err.code){
            case "ER_PARSE_ERROR":
                console.error('SQL syntax error in DELETE query:', err.message);
                throw new Error("SQL_SYNTAX_ERROR");
            default:
                console.error(err);
                throw new Error("SERVER_ERROR");
        }
        }
    }
    async insertRV(RV: RV): Promise<boolean> {
        try {
          const [result] = await this.pool.execute<ResultSetHeader>(getInsertQuery(RV, 'RV'), Object.values(RV));
      
         
          return result.affectedRows > 0;
        } catch (err) {
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
    async updateRV(rvData: Partial<RV>, vin: string): Promise<boolean>{

        try{
            const [result] = await this.pool.execute<ResultSetHeader>(getUpdateQuery(rvData, 'RV', 'vin'), [...Object.values(rvData), vin])
            return result.affectedRows > 0;
        }catch(err){
          switch(err.code){
            case "ER_BAD_FIELD_ERROR":
                console.error('Unknown field in update query:', err.message);
            throw new Error("INVALID_FIELD");
            case "ER_NULL_CONSTRAINT_VIOLATION ":
                console.error('Missing required field:', err.message);
                throw new Error("MISSING_FIELD");
            case "ER_NO_REFERENCED_ROW_2":
                console.error('Foreign key constraint fails:', err.message);
                throw new Error("FOREIGN_KEY_ERROR");
            default:
                console.error('Unexpected DB error:', err);
                throw new Error("SERVER_ERROR");
        }
        }
    }
    async deleteRV(vin: String):Promise<boolean>{
        try{
            const [result] = await this.pool.execute<ResultSetHeader>('DELETE FROM RV WHERE vin = ?', [vin]);
          
            return result.affectedRows > 0;
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