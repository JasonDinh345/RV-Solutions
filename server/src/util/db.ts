import mysql, {Pool} from 'mysql2/promise';

const pool: Pool = mysql.createPool({
  host: '',
  user: '',
  password: '',
  database: '',
});

export default pool;