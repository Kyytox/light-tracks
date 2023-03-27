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
            console.log(data);
            setUserInfos(data[0]);
        });
    }, []);

    // console.log(userInfos);

    return (
        <div>
            <div>PageUser</div>
            <Avatar alt="Avatar" src={userInfos.p_avatar} />
            <p>{userInfos.p_username}</p>
            <p>
                {userInfos.p_code_country ? (
                    <img
                        loading="lazy"
                        width="20"
                        src={`https://flagcdn.com/w20/${userInfos.p_code_country.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w40/${userInfos.p_code_country.toLowerCase()}.png 2x`}
                        alt="country flag"
                    />
                ) : (
                    "no country"
                )}
                &ensp;
                {userInfos.p_name_country}
            </p>
            <p>bio: {userInfos.p_bio}</p>
        </div>
    );
}

export default PageUser;
