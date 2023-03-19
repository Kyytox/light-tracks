import React, { useState, useEffect } from "react";
import axios from "axios";

import { backendUrl } from "../../Globals/GlobalVariables";
import { useLocation } from "react-router-dom";

import { Avatar } from "@mui/material";

function PageUser() {
    const location = useLocation();
    const idUserUrl = location.pathname.split("/")[2];

    const [userInfos, setUserInfos] = useState([]);

    useEffect(() => {
        // get user info with get axios on getUserById
        axios
            .get(backendUrl + "/getUserById", {
                params: { idUser: idUserUrl },
            })
            .then((response) => {
                setUserInfos(response.data[0]);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    console.log("userInfos", userInfos);

    return (
        <div>
            <div>PageUser</div>
            <Avatar alt="Avatar" src={userInfos.u_avatar} />
            <p>{userInfos.u_username}</p>
            <p>{userInfos.u_name_country}</p>
            <p>bio: {userInfos.u_bio}</p>
        </div>
    );
}

export default PageUser;
