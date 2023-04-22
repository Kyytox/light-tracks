import pool from "../Database/database.js";
import poolLnbits from "../Database/database_lnbits.js";
import dotenv from "dotenv";
import axios from "axios";

// Hash crypto js
import crypto from "crypto-js";

dotenv.config();

// get infos User Lnbits
export const getInfosUserLnbits = async (idUser) => {
    console.log("getInfosUserLnbits");

    try {
        const result = await pool.query("SELECT u_id_lnbits FROM users WHERE u_id = ($1)", [idUser]);
        const idLnbits = result.rows[0].u_id_lnbits;
        return getInKeyWallet(idLnbits);
    } catch (err) {
        console.error("Error executing INSERT INTO:", err);
    }
};

// get inkey wallet
export const getInKeyWallet = async (idLnbits) => {
    console.log("getBalanceWallet");
    console.log("idLnbits: ", idLnbits);

    // decrypt idLnbits
    const idLnbitsDecrypt = crypto.AES.decrypt(idLnbits, process.env.KEY_ENCRYPTION).toString(crypto.enc.Utf8);
    console.log("idLnbitsDecrypt: ", idLnbitsDecrypt);

    // get invoiceKey - adminKey wallet
    try {
        const result = await poolLnbits.query("SELECT * FROM wallets w WHERE w.user = ($1)", [idLnbitsDecrypt]);
        const invoiceKey = result.rows[0].inkey;
        const adminKey = result.rows[0].adminkey;
        return { invoiceKey: invoiceKey, adminKey: adminKey };
    } catch (err) {
        console.error("Error executing INSERT INTO:", err);
    }
};
