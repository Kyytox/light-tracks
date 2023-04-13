import pool from "../Database/database.js";
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
        }
    });
};

// Active Extension LNURLP / LNURLW / Split Payements
export const activeExtensionsLnbits = async (data) => {};
