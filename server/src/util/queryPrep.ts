

export function getKeys(object: any): string {
    const keys = Object.keys(object);
    return keys.join(',');  // Joins all keys with a comma
}
export function createPlaceholders(object:any):string{
  return new Array(Object.keys(object).length).fill('?').join(',')
}
export function createClause(object: any):string{
  const keys = Object.keys(object);
  return keys.map(key => `${key} = ?`).join(', ');
}
export function getInsertQuery(object:any, tableName: string): string{
  const keys = getKeys(object)
  const placeholders = createPlaceholders(object)

  return `INSERT INTO ${tableName} (${keys}) VALUES (${placeholders})`;
}
export function getUpdateQuery(object:any, tableName: string, identifier: any): string{
  delete object[identifier]
  const clause = createClause(object)

  return `UPDATE ${tableName} SET (${clause}) WHERE ${identifier} = ?`;
}