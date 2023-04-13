import pool from "../Database/database.js";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

// LNBITS_WALLET_ID;
// LNBITS_ADMIN_KEY;
// LNBITS_INVOICE_READ_KEY;

// create user in lnbits
export const createUserLnbits = async (username, res) => {
    console.log("createUserLnbits");
    const data = {
        admin_id: process.env.LNBITS_USER_ID,
        user_name: username,
        wallet_name: username + "-wallet",
        email: "",
        password: "",
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
        })
        .catch((error) => {
            console.log(error);
        });
};
