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

    return (
        <div>
            <div>PageUser</div>
            <Avatar alt="Avatar" src={userInfos.p_avatar} />
            <p>{userInfos.p_username}</p>
            <p>
                <img
                    loading="lazy"
                    width="20"
                    src={`https://flagcdn.com/w20/${userInfos.p_code_country.toLowerCase()}.png`}
                    srcSet={`https://flagcdn.com/w40/${userInfos.p_code_country.toLowerCase()}.png 2x`}
                    alt="country flag"
                />
                &ensp;{userInfos.p_name_country}
            </p>
            <p>bio: {userInfos.p_bio}</p>
        </div>
    );
}

export default PageUser;
