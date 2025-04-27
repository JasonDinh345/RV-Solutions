import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { RV, RVwImage } from "../types/RV.type.js";
import { getInsertQuery, getUpdateQuery } from "../util/queryPrep.js";

export class RVService{
    private pool;
    
    constructor(pool : Pool){
        this.pool = pool;
    }
    
    async getAllRV():Promise<RVwImage[]>{
        const [rows] = await this.pool.query(`SELECT RV.*, Image.smallImageURL AS "imageURL" FROM RV JOIN Image ON RV.vin = Image.rvVin`);
        return rows;
    }
    async getRV(vin : String):Promise<RVwImage>{
        const [rows] = await this.pool.execute(`SELECT RV.*, Image.imageURL AS "imageURL" FROM RV JOIN Image ON RV.vin = Image.rvVin WHERE vin = ?`, [vin])
        const RV = rows[0];
        if (!RV) {
            console.error('VIN not found:', vin);
            throw new Error("VIN_NOT_FOUND");
          }
      
        return RV;
    }
    async insertRV(RV: Partial<RV>): Promise<boolean> {
        try {
          const [result] = await this.pool.execute(getInsertQuery(RV, 'RV'), Object.values(RV)) as [ResultSetHeader];
      
         
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
            const [result] = await this.pool.execute(getUpdateQuery(rvData, 'RV', 'vin'), [...Object.values(rvData), vin])
            return result.affectedRows > 0;
        }catch(err){
          switch(err.code){
            case "ER_BAD_FIELD_ERROR":
                console.error('Unknown field in update query:', err.message);
            throw new Error("INVALID_FIELD");
            case "ER_BAD_NULL_ERROR":
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
            const [result] = await this.pool.execute('DELETE FROM RV WHERE vin = ?', [vin]) as [ResultSetHeader];
              
              
            if (result.affectedRows === 0) {
                console.error('VIN not found:', vin);
                throw new Error("VIN_NOT_FOUND");
              }
          
            return true;
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