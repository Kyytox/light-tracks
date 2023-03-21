import React from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";

function LinkNavUser(props) {
    // props
    const { data } = props;
    console.log("LinkNavUser - data", data);

    // Location User
    const locationUser = {
        pathname: `/user/${data.p_id_user}`,
    };
    const stateLocationUser = { user: data.p_id_user };

    return (
        <div>
            <Link to={locationUser} state={stateLocationUser}>
                <Avatar alt="Remy Sharp" src={data.p_avatar} />
                <p>{data.p_username}</p>
            </Link>
        </div>
    );
}

export default LinkNavUser;
