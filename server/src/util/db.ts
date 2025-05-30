import mysql, {Pool, PoolConnection} from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
/**
 * Connection to the db
 */
const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
/**
 * Middleware to do queries with a transaction
 * @param pool the connection to the db
 * @param fn queries to be made
 * @returns a generic promise
 */
export async function withTransaction<T>(
  pool: Pool,
  fn: (conn: PoolConnection) => Promise<T>
): Promise<T> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
export default pool;