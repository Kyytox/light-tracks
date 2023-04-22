import dotenv from "dotenv";
import axios from "axios";

import { getInfosUserLnbits } from "./getInfosUser.js";

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
