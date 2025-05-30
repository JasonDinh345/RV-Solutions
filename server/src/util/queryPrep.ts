import { SearchOptions } from "../types/RV.type.js";

/**
 * Preps an object to be inserted into a table
 * @param object object to be inserted into a table
 * @returns a string containing all keys of an object seperated by a comma
 */
export function getKeys(object: any): string {
    const keys = Object.keys(object);
    return keys.join(',');  
}
/**
 * Prepares the placeholders for insertion statements
 * @param object object to be inserted 
 * @returns a string preparing the placeholders for a query
 */
export function createPlaceholders(object:any):string{
  return new Array(Object.keys(object).length).fill('?').join(',')
}
/**
 * Prepares the set clause for an update query
 * @param object an object with fields to update on a tuple
 * @returns the prepared set clause
 */
export function createSetClause(object: any):string{
  const keys = Object.keys(object);
  return keys.map(key => `${key} = ?`).join(', ');
}
/**
 * Prepares an insertion query based on a object and table
 * @param object object to be inserted 
 * @param tableName name of the table
 * @returns an insertion query based on the object and table
 */
export function getInsertQuery(object:any, tableName: string): string{
  const keys = getKeys(object)
  const placeholders = createPlaceholders(object)

  return `INSERT INTO ${tableName} (${keys}) VALUES (${placeholders})`;
}
/**
 * Prepares an update query based on an object and table
 * @param object an object with fields to update on a tuple
 * @param tableName name of the table
 * @param identifier 
 * @returns 
 */
export function getUpdateQuery(object:any, tableName: string, identifier: any): string{
  delete object[identifier]
  const clause = createSetClause(object)

  return `UPDATE ${tableName} SET ${clause} WHERE ${identifier} = ?`;
}
export function getAddWhereClause(searchOptions:Partial<SearchOptions>){
  
  let clause = "";
  const values: any[] = [];

  if(searchOptions){
    if (searchOptions.AccountID && searchOptions.AccountID !== "") {
      clause += " AND RV.OwnerID != ?";
      values.push(String(searchOptions.AccountID));
    }
    if (searchOptions.City && searchOptions.City !== "") {
      clause += " AND RV.City LIKE ?";
      values.push(`%${searchOptions.City}%`);
    }

    if (searchOptions.State && searchOptions.State !== "") {
      clause += " AND RV.State = ?";
      values.push(searchOptions.State);
    }

    if (searchOptions.SizeClass && searchOptions.SizeClass !== "") {
      clause += " AND RV.SizeClass = ?";
      values.push(searchOptions.SizeClass);
    }
  }
  return {clause, values}
}