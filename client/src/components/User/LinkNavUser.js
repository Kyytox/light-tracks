import React from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";

function LinkNavUser(props) {
    // props
    const { data } = props;
    console.log("LinkNavUser - data", data);

    // Location User
    const locationUser = {
        pathname: `/user/${data.u_id}`,
    };
    const stateLocationUser = { user: data.u_id };

    return (
        <div>
            <Link to={locationUser} state={stateLocationUser}>
                <Avatar alt="Remy Sharp" src={data.u_avatar} />
                <p>{data.u_username}</p>
            </Link>
        </div>
    );
}

export default LinkNavUser;
