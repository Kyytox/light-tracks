import React, { useState } from "react";

import { backendUrl } from "../../Globals/GlobalVariables";
import axios from "axios";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { Button } from "@mui/material";


function BtnFollow({ idUser, isLoggedIn, idUserFollow}) {

    const Follow = (idUserFollow) => {
        const data = {
            idUser: idUser,
            idUserFollow: idUserFollow
        };

        const token = getLocalStorage("token");

        // Delete album
        axios
            .post(backendUrl + "/follow", data, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                console.log("response", response);
            }
            )
            .catch((error) => {
                console.error(error);
            }
            );
    };
    

    return (
        <div className="btn-follow">
            {isLoggedIn && (
                <Button
                    id={`follow-${idUserFollow}`}
                    onClick={() => Follow(idUserFollow)}
                />
            )}
        </div>
    );
}

export default BtnFollow;
