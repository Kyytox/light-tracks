import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../Services/AuthContext";

import { Button } from "@mui/material";

import { getAxiosReqAuth } from "../../Services/AxiosGet";
import { getLocalStorage } from "../../Globals/GlobalFunctions";

function BtnWithdraw() {
    const { isLoggedIn, checkToken } = useContext(AuthContext);
    const idUser = getLocalStorage("id");

    const handleClick = async () => {
        await checkToken();
        const token = getLocalStorage("token");

        // data send
        const data = { idUser: idUser };

        if (isLoggedIn) {
            try {
                console.log("BtnWithdraw -- /withdraw");
                const response = await getAxiosReqAuth("/withdraw", data, token);
                console.log("BtnWithdraw -- /withdraw -- response: ", response);
            } catch (error) {
                console.log("Error fetching data from server: ", error);
            }
        }
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleClick}>
                Withdraw
            </Button>
        </div>
    );
}

export default BtnWithdraw;
