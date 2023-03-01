import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

export default pool;
