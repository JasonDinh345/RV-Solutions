import mysql, {Pool} from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default pool;