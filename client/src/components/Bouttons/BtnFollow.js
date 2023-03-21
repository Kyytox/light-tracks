import React, { useState, useEffect } from "react";

import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { Button } from "@mui/material";
import { changeBtnFollow, followUser, unfollowUser } from "../../Globals/FctsFollow";

function BtnFollow({ idUser, isLoggedIn, idUserFollow, isFollowedProp }) {
    const [isFollowed, setIsFollowed] = useState(isFollowedProp);

    useEffect(() => {
        setIsFollowed(isFollowedProp);
    }, [isFollowedProp]);

    const toggleFollow = () => {
        setIsFollowed(!isFollowed);

        const data = {
            idUser: idUser,
            idUserFollow: idUserFollow,
        };

        const token = getLocalStorage("token");

        // call addFavoris or removeFavoris
        if (isFollowed) {
            unfollowUser(data, token);
            changeBtnFollow(idUserFollow, "Follow");
        } else {
            followUser(data, token);
            changeBtnFollow(idUserFollow, "Unfollow");
        }
    };

    return (
        <div className="btn-follow">
            {parseInt(idUser) !== idUserFollow && isLoggedIn && (
                <Button
                    id={`follow-user-${idUserFollow}`}
                    variant="contained"
                    onClick={() => toggleFollow()}
                >
                    {isFollowed ? "Unfollow" : "Follow"}
                </Button>
            )}
        </div>
    );
}

export default BtnFollow;
