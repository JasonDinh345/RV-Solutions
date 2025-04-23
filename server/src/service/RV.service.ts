import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { RV } from "../types/RV.type.js";
import { getInsertQuery, getUpdateQuery } from "../util/queryPrep.js";

export class UserService{
    private pool;
    
    constructor(pool : Pool){
        this.pool = pool;
    }
    
    async getAllRV():Promise<RV[]>{
        const [rows] = await this.pool.query("SELCT * FROM RV");
        return rows[0];
    }
    async getRV(vin : String):Promise<RV>{
        const [rows] = await this.pool.execute("SELECT * FROM RV WHERE vin = ?", [vin])
        const RV = rows[0];
        if(!RV){
            throw new Error("INVALID_VIN")
        }
        return RV;
    }
    async insertRV(RV: RV): Promise<boolean> {
        try {
          const [result] = await this.pool.execute(getInsertQuery(RV, 'RV'), Object.values(RV));
      
         
          return (result as any).affectedRows > 0;
        } catch (err) {
          console.error(err);
          throw new Error("SERVER_ERROR");
        }
      }
    async updateRV(rvData: Partial<RV>, vin: string): Promise<boolean>{

        try{
            const [result] = await this.pool.execute(getUpdateQuery(rvData, 'RV', 'vin'), [...Object.values(rvData), vin])
            return result.affectedRows > 0;
        }catch(err){
            console.error(err);
            throw new Error("SERVER_ERROR");
        }
    }
    async deleteRV(vin: String):Promise<boolean>{
        try{
            const [result] = await this.pool.execute('DELETE FROM RV WHERE vin = ?', [vin]) as [ResultSetHeader];
              
              
              return result.affectedRows > 0;
        }catch(err){
            throw new Error("SERVER_ERROR");
        }
    }
    
    
}