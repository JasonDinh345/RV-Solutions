import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { DamageReport } from "../types/DamageReport.type.js";
import { getInsertQuery, getUpdateQuery } from "../util/queryPrep.js";

export class DamageReportService{
    private pool: Pool

    constructor(pool: Pool){
        this.pool = pool
    }
    async getAllDamageReportWithAccount(accountID: number): Promise<DamageReport[]>{
        try{
            if(!accountID){
                throw new Error("INVALID_ACCOUNT")
            }
            const [rows] = await this.pool.execute<RowDataPacket[]>(`SELECT * FROM DamageReport JOIN Booking ON DamageReport.BookingID = Booking.BookingID WHERE Booking.accoundID = ?`, [accountID])
            return rows as DamageReport[];
        }catch(err){
            switch(err.code){
                case "ER_PARSE_ERROR":
                    console.error('SQL syntax error in SELECT query:', err.message);
                    throw new Error("SQL_SYNTAX_ERROR");
                default:
                    console.error(err);
                    throw new Error(err.message);
            }
        }
    }
    async getAllDamageReportWithRV(vin: string): Promise<DamageReport[]>{
        try{
            if(!vin){
                throw new Error("INVALID_RV")
            }
            const [rows] = await this.pool.execute<RowDataPacket[]>(`SELECT * FROM DamageReport JOIN Booking ON DamageReport.BookingID = Booking.BookingID WHERE Booking.vin = ?`, [vin])
            return rows as DamageReport[];
        }catch(err){
            switch(err.code){
                case "ER_PARSE_ERROR":
                    console.error('SQL syntax error in SELECT query:', err.message);
                    throw new Error("SQL_SYNTAX_ERROR");
                default:
                    console.error(err);
                    throw new Error(err.message);
            }
        }
    }
    async getAllDamageReportWithOwner(ownerID: string): Promise<DamageReport[]>{
        try{
            if(!ownerID){
                throw new Error("INVALID_ACCOUNT")
            }
            const [rows] = await this.pool.execute<RowDataPacket[]>(
                `SELECT * FROM DamageReport 
                    JOIN Booking ON DamageReport.BookingID = Booking.BookingID 
                    JOIN RV ON Booking.vin = RV.vin WHERE RV.ownerID = ?`, [ownerID])
            return rows as DamageReport[];
        }catch(err){
            switch(err.code){
                case "ER_PARSE_ERROR":
                    console.error('SQL syntax error in SELECT query:', err.message);
                    throw new Error("SQL_SYNTAX_ERROR");
                default:
                    console.error(err);
                    throw new Error(err.message);
            }
        }
        
    }
    async getDamageReport(reportID: number):Promise<DamageReport>{
        try{
            if(!reportID){
                throw new Error("INVALID_REPORT")
            }
            const [rows] = await this.pool.execute<RowDataPacket[]>(`SELECT * FROM DamageReport WHERE DamageReport.reportID = ?`, [reportID])
            if(rows.length === 0){
                return null
            }
            return rows[0] as DamageReport
        }catch(err){
            switch(err.code){
                case "ER_PARSE_ERROR":
                    console.error('SQL syntax error in SELECT query:', err.message);
                    throw new Error("SQL_SYNTAX_ERROR");
                default:
                    console.error(err);
                    throw new Error(err.message);
            }
        }
    }
    async insertDamageReport(reportData: Omit<DamageReport, 'ReportID'>):Promise<boolean>{
        try{
            const [result] = await this.pool.execute<ResultSetHeader>(getInsertQuery(reportData, "DamageReport"), Object.values(reportData))
            return result.affectedRows > 0
        }catch(err){
            switch(err.code){
                case "ER_BAD_FIELD_ERROR":
                    console.error('Unknown field in insert query:', err.message);
                throw new Error("INVALID_FIELD");
                case "ER_DUP_ENTRY":
                    console.error('Duplicate damage report:', err.message);
                    throw new Error("DUPLICATE_ENTRY");
                case "ER_BAD_NULL_ERROR":
                    console.error('Missing required field:', err.message);
                    throw new Error("MISSING_FIELD");
                case "ER_NO_REFERENCED_ROW_2":
                    console.error('Foreign key constraint fails:', err.message);
                throw new Error("FOREIGN_KEY_ERROR");
                case "ER_PARSE_ERROR":
                    console.error('SQL syntax error in DELETE query:', err.message);
                    throw new Error("SQL_SYNTAX_ERROR");
                default:
                    console.error('Unexpected DB error:', err);
                    throw new Error("SERVER_ERROR");
            }
        }
    }
    async updateDamageReport(reportData: Partial<DamageReport>, reportID: number):Promise<boolean>{
        delete reportData["bookingID"]
        try{
            if(!reportID){
                throw new Error("INVALID_REPORT")
            }
            const [result] = await this.pool.execute<ResultSetHeader>(getUpdateQuery(reportData, "DamageReport", "reportID"), [...Object.values(reportData), reportID])
            return result.affectedRows > 0
        }catch(err){
            switch(err.code){
                case "ER_BAD_FIELD_ERROR":
                    console.error('Unknown field in update query:', err.message);
                throw new Error("INVALID_FIELD");
                case "ER_NULL_CONSTRAINT_VIOLATION":
                    console.error('Field can not be null:', err.message);
                    throw new Error("NULL_FIELD");
                case "ER_NO_REFERENCED_ROW_2":
                    console.error('Foreign key constraint fails:', err.message);
                    throw new Error("FOREIGN_KEY_ERROR");
                case "ER_PARSE_ERROR":
                    console.error('SQL syntax error in DELETE query:', err.message);
                    throw new Error("SQL_SYNTAX_ERROR");
                default:
                    console.error('Unexpected DB error:', err);
                    throw new Error(err.message);
            }
        }
    }
    async deleteDamageReport(reportID: number):Promise<boolean>{
        try{
            if(!reportID){
                throw new Error("INVALID_REPORT")
            }
            const [result] = await this.pool.execute<ResultSetHeader>(`DELETE FROM DamageReport WHERE reportID = ?`, [reportID])
            return result.affectedRows > 0
        }catch(err){
            switch(err.code){
                case "ER_ROW_IS_REFERENCED":
                    console.error('Cannot delete DamageReport: Foreign key constraint violation', err.message);
                    throw new Error("FOREIGN_KEY_ERROR");
                case "ER_PARSE_ERROR":
                    console.error('SQL syntax error in DELETE query:', err.message);
                    throw new Error("SQL_SYNTAX_ERROR");
                default:
                    console.error('Unexpected DB error:', err);
                    throw new Error(err.message);
            }
        }
    }
    
}