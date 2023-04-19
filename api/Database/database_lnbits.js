import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Pool } = pkg;

const poolLnbits = new Pool({
    host: process.env.DATABASE_HOST_LNBITS,
    port: process.env.DATABASE_PORT_LNBITS,
    user: process.env.DATABASE_USERNAME_LNBITS,
    password: process.env.DATABASE_PASSWORD_LNBITS,
    database: process.env.DATABASE_LNBITS,
});

export default poolLnbits;
