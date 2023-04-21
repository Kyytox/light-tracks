import pool from "../Database/database.js";
import poolLnbits from "../Database/database_lnbits.js";
import dotenv from "dotenv";
import axios from "axios";

// Hash crypto js
import crypto from "crypto-js";

dotenv.config();

// function widthdraw
export const withdraw = (req, res) => {
    console.log("withdraw");

    const idUser = req.query.idUser;

    // verify idUser
    if (!isNaN(parseInt(idUser))) {
        getInfosUserLnbits(idUser);
    } else {
        res.status(401).json({ message: "idUser is not correct" });
    }
};

// get infos User Lnbits
export const getInfosUserLnbits = async (idUser, res) => {
    console.log("getInfosUserLnbits");

    pool.query("SELECT u_id_lnbits FROM users WHERE u_id = ($1)", [idUser], (err, result) => {
        if (err) {
            console.error("Error executing INSERT INTO:", err);
        } else {
            console.log("getInfosUserLnbits -- Succes");
            const idLnbits = result.rows[0].u_id_lnbits;
            getInKeyWallet(idLnbits, res);
        }
    });
};

// get inkey wallet
export const getInKeyWallet = async (idLnbits, res) => {
    console.log("getBalanceWallet");
    console.log("idLnbits: ", idLnbits);

    // decrypt idLnbits
    const idLnbitsDecrypt = crypto.AES.decrypt(idLnbits, process.env.KEY_ENCRYPTION).toString(crypto.enc.Utf8);
    console.log("idLnbitsDecrypt: ", idLnbitsDecrypt);

    // get inkey wallet
    poolLnbits.query("SELECT * FROM wallets w WHERE w.user = ($1)", [idLnbitsDecrypt], (err, result) => {
        if (err) {
            console.error("Error executing INSERT INTO:", err);
        } else {
            console.log("getInKeyWallet -- Succes");
            console.log(result);
            const inkey = result.rows[0].inkey;
            const adminKey = result.rows[0].adminkey;
            getBalanceWallet(inkey, adminKey, res);
        }
    });
};

// get balance wallet
export const getBalanceWallet = async (inkey, adminKey, res) => {
    console.log("getBalanceWallet");
    await axios
        .get("http://127.0.0.1:5000/api/v1/wallet", {
            headers: {
                "X-Api-Key": inkey,
                "Content-type": "application/json",
            },
        })
        .then((response) => {
            console.log("getBalanceWallet -- Succes");
            console.log(response.data);
            console.log(response.status);
            getLinkwithdraw(adminKey, response.data.balance, res);
        })
        .catch((error) => {
            console.log(error);
        });
};

// Withdraw
export const getLinkwithdraw = async (adminKey, amount, res) => {
    console.log("withdraw");
    const data = {
        title: "withdraw",
        min_withdrawable: 1,
        // max_withdrawable: amount / 1000,
        max_withdrawable: 5,
        uses: 1,
        wait_time: 1,
        is_unique: true,
    };

    await axios
        .post("http://127.0.0.1:5000/withdraw/api/v1/links", data, {
            headers: {
                "X-Api-Key": adminKey,
                "Content-type": "application/json",
            },
        })
        .then((response) => {
            console.log(response.data);
            console.log(response.status);
            res.status(200).json(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
};
