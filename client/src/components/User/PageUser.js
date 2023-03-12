import React, { useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../Globals/GlobalVariables";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
// import { getFollows, checkFollowed } from "../../Globals/FctsFollow";
import { useLocation } from "react-router-dom";


function PageUser() {
    const idUser = getLocalStorage("id");
    const token = getLocalStorage("token");

    const location = useLocation();
    const idUserUrl = location.pathname.split("/")[2];

    useEffect(() => {
        // get user info with get axios on getUserById
        axios
            .get(backendUrl + "/getUserById", {
                params: { idUser: idUserUrl },
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
            




    return (
        <div>
            <div>PageUser</div>
            <div>idUser: {idUserUrl}</div>
        </div>
    );
}

export default PageUser;