import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { Avatar } from "@mui/material";
import { getAxiosReq } from "../../Services/AxiosGet";

function PageUser() {
    const location = useLocation();
    const idUserUrl = location.pathname.split("/")[2];

    const [userInfos, setUserInfos] = useState([]);

    useEffect(() => {
        // get user info with get axios on getUserById
        const data = { idUser: idUserUrl };
        const response = getAxiosReq("/getUserById", data);
        response.then((data) => {
            setUserInfos(data[0]);
        });
    }, []);

    console.log("userInfos", userInfos);

    return (
        <div>
            <div>PageUser</div>
            <Avatar alt="Avatar" src={userInfos.p_avatar} />
            <p>{userInfos.p_username}</p>
            <p>{userInfos.p_name_country}</p>
            <p>bio: {userInfos.p_bio}</p>
        </div>
    );
}

export default PageUser;
