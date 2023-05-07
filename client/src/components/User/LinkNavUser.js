import React from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";

function LinkNavUser(props) {
    // props
    const { data } = props;

    // Location User
    const locationUser = {
        pathname: `/user/${data.p_id_user}`,
    };
    const stateLocationUser = { user: data.p_id_user };

    return (
        <Link to={locationUser} state={stateLocationUser}>
            <div className="flex flex-row items-center">
                <Avatar src={data.p_avatar} />
                <p className="ml-4">{data.p_username}</p>
            </div>
        </Link>
    );
}

export default LinkNavUser;
