import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { RV, RVwImage, SearchOptions } from "../types/RV.type.js";
import { getAddWhereClause, getInsertQuery, getUpdateQuery } from "../util/queryPrep.js";
import { Image } from "../types/Image.type.js";
import { withTransaction } from "../util/db.js";
import { deleteImage } from "../util/imageUpload.js";
/**
 * Service layer for RV table
 */
export class RVService{
    private pool: Pool;
    
    constructor(pool : Pool){
        this.pool = pool;
    }
    /**
     * Gets all RVs and their related images if they are available 
     * but also excludes account that have 3 or more unpaid reports and RVs that 
     * the current account own
     * @returns an array of RV objects with their images 
     */
    async getAllRV(searchOptions:Partial<SearchOptions>):Promise<RVwImage[]>{
        try{
          let query = `
          SELECT RV.*, 
          Image.smallImageURL AS "imageURL"
          FROM RV
          JOIN Image ON RV.vin = Image.vin
          WHERE RV.isAvailable = true
            AND RV.ownerID NOT IN (
             SELECT AccountID
              FROM DamageReport
              JOIN Booking b ON DamageReport.BookingID = b.BookingID
              WHERE IsPaid = false
              GROUP BY b.AccountID
              HAVING COUNT(reportID) >= 3
            )
          `
          const { clause, values } = getAddWhereClause(searchOptions);
          query += clause;
          query += ` LIMIT 100;`;
          const [rows] = await this.pool.query<RowDataPacket[]>(query, values);
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
    /**
     * Gets all RVs that an account owns
     * @param ownerID the accountID that relates to the owner of desired RVs
     * @returns an array of RV objects with their images relating to an owner
     */
    async getAllRVwOwner(ownerID: number):Promise<RVwImage[]>{
      if(!ownerID || ownerID < 0){
        throw new Error("INVALID_ID");
      }
        try{
          const [rows] = await this.pool.execute<RowDataPacket[]>(`
            SELECT RV.*, 
            Image.smallImageURL AS "ImageURL", 
            Image.ImageID FROM RV JOIN Image ON RV.vin = Image.vin 
            WHERE RV.ownerID = ?`
            ,[ownerID] );
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
    /**
     * Gets data on an RV and its image
     * @param vin vin relating to an RV
     * @returns an RV relating to the vin
     */
    async getRV(vin : String):Promise<RVwImage>{
        try{
          const [rows] = await this.pool.execute<RowDataPacket[]>(`
            SELECT RV.*, 
            Image.imageURL AS "ImageURL", 
            Image.ImageID FROM RV JOIN Image ON RV.vin = Image.vin
             WHERE RV.vin = ?`
             , [vin])

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
    /**
     * Inserts an RV into the table based on the given data
     * @param RV the RV data recieved from the user
     * @param ImageData the image data recieved from Cloudiary after uploading
     * the user's image to its libary
     * @returns a boolean stating if the insertion went smoothly or not
     */
    async insertRVwImage(RV: RV, ImageData: Partial<Image>): Promise<boolean> {
     
      try{
        await withTransaction(this.pool, async(conn)=>{
        const [rvResult] = await conn.execute<ResultSetHeader>(getInsertQuery(RV, 'RV'), Object.values(RV));
     
        if(rvResult.affectedRows > 0){
          const [imageResult] = await conn.execute<ResultSetHeader>(getInsertQuery({...ImageData, VIN: RV.VIN}, 'Image'), Object.values({...ImageData, VIN: RV.VIN}));
          if(imageResult.affectedRows !== 1){
            throw new Error('INSERT_FAILED');
          }
        }else{
            throw new Error('INSERT_FAILED');
        }
      })
      return true;
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
            throw new Error(err.message);
        }
    }
    /**
     * Updates an RV tuple on the table
     * @param rvData fields to be updated 
     * @param VIN VIN correlating to the RV to be updated 
     * @returns a boolean stating if the update went smoothly or not
     */
    async updateRV(rvData: Partial<RV>, VIN: string): Promise<boolean>{

        try{
            const [result] = await this.pool.execute<ResultSetHeader>(getUpdateQuery(rvData, 'RV', 'VIN'), [...Object.values(rvData), VIN])
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
    /**
     * Updates an RV and its image in a transaction 
     * @param rvData RV fields to be updates 
     * @param imageData image to be updated 
     * @param VIN vin correlating to a RV to be updated 
     * @param imageID imageID relating to the image tuple to be updated 
     * @returns a boolean stating if the update went smoothly or not
     */
    async updateRVwImage(rvData: Partial<RV>, imageData:Partial<Image>, VIN: string, imageID: string): Promise<boolean>{
      try{
        const result = await withTransaction(this.pool, async(conn)=>{
          const [rvResult] = await this.pool.execute<ResultSetHeader>(getUpdateQuery(rvData, 'RV', 'VIN'), [...Object.values(rvData), VIN])
          if(rvResult.affectedRows >0){
            const updatedImageData = {...imageData, UploadDate: Date.now()}
            const [imageResult] = await conn.execute<ResultSetHeader>(getUpdateQuery(updatedImageData, 'Image', "VIN"), Object.values({...updatedImageData, VIN: VIN}));
            if(imageResult.affectedRows !== 1 ){
              throw new Error('INSERT_FAILED');
            }
          }else{
              throw new Error('INSERT_FAILED');
          }
        const deleteResult = await deleteImage(imageID)
        return deleteResult;
        })
        return result
      }catch(err){

      }
    }
    /**
     * Deletes a RV from the table
     * @param VIN vin relating to the RV 
     * @param imageID imageID to be deleted from the Cloudinary libary
     * @returns a boolean stating if the deletion went smoothly or not
     */
    async deleteRV(VIN: string, imageID: string):Promise<boolean>{
        try{
            const result = await withTransaction(this.pool, async(conn)=>{
              const [deleteRVResult] = await conn.execute<ResultSetHeader>("DELETE FROM RV WHERE VIN = ?",[VIN])
              if(deleteRVResult.affectedRows){
                return await deleteImage(imageID)

              }
              return false;
            })
             return result;
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