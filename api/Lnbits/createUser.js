import pool from "../Database/database.js";
import poolLnbits from "../Database/database_lnbits.js";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

// create user and iniial wallet in lnbits
export const createUserLnbits = async (idUser, username, password) => {
    console.log("createUserLnbits");
    const data = {
        admin_id: process.env.LNBITS_USER_ID,
        user_name: username,
        wallet_name: username + "-wallet",
        email: "",
        password: password,
    };

    await axios
        .post("http://127.0.0.1:5000/usermanager/api/v1/users", data, {
            headers: {
                "X-Api-Key": process.env.LNBITS_ADMIN_KEY,
                "Content-type": "application/json",
            },
        })
        .then((response) => {
            console.log(response.data);
            console.log(response.status);
            updateBdUserLnbits(idUser, response.data);
        })
        .catch((error) => {
            console.log(error);
        });
};

// Update data User Lnbits in BD
export const updateBdUserLnbits = (idUser, data) => {
    console.log("updateBdUserLnbits");
    const idLnbits = data.id;

    pool.query("UPDATE users SET u_id_lnbits = ($1) WHERE u_id = ($2)", [idLnbits, idUser], (err, result) => {
        if (err) {
            console.error("Error executing INSERT INTO:", err);
        } else {
            console.log("updateBdUserLnbits -- Succes");
            activeExtensionsLnbits(data);
        }
    });
};

// Active Extension LNURLP / LNURLW / Split Payements
export const activeExtensionsLnbits = async (data) => {
    console.log("activeExtensionsLnbits");
    const idLnbits = data.id;
    console.log("idLnbits", idLnbits);

    // active extension in table extensions
    poolLnbits.query(
        `INSERT INTO extensions ("user", extension, active) 
        VALUES ($1, 'splitpayments', true), 
        ($1, 'withdraw', true)`,
        [idLnbits],
        (err, result) => {
            if (err) {
                console.error("Error executing INSERT INTO:", err);
            } else {
                console.log("activeExtensionsLnbits -- Succes");
                insertWalletSplitPayments(data);
            }
        }
    );
};

// insert LightWaves in splitPayments of wallet of user created
export const insertWalletSplitPayments = async (data) => {
    console.log("insertWalletSplitPayments");
    const idLnbits = data.id;
    const idWallet = process.env.LNBITS_WALLET_ID;
    const adminKey = data.wallets[0].adminkey;

    console.log("adminKey", adminKey);

    // active extension in table extensions
    const dataAPI = {
        targets: [
            {
                wallet: idWallet,
                alias: "LightWaves",
                percent: 5,
            },
        ],
    };

    await axios
        .put("http://127.0.0.1:5000/splitpayments/api/v1/targets", dataAPI, {
            headers: {
                "X-Api-Key": adminKey,
                "Content-type": "application/json",
            },
        })
        .then((response) => {
            console.log(response.data);
            console.log("insertWalletSplitPayments -- Succes");
        })
        .catch((error) => {
            console.log(error);
        });
};
