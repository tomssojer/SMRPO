import mysql2 from "mysql2";

const db = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'smrpo',
  port: 3306
});

export default db;