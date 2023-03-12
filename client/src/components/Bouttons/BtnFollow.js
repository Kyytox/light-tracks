import React, {useState} from "react";

import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { Button } from "@mui/material";
import { followUser, unfollowUser } from "../../Globals/FctsFollow";


function BtnFollow({ idUser, isLoggedIn, idUserFollow}) {
    const [isFollowed, setIsFollowed] = useState(false);

    const toggleFollow = () => {
        setIsFollowed(!isFollowed);

        console.log("isFollowed", isFollowed);

        const data = {
            idUser: idUser,
            idUserFollow: idUserFollow
        };

        const token = getLocalStorage("token");

        // call addFavoris or removeFavoris
        if (isFollowed) {
            unfollowUser(data, token);
        } else {
            followUser(data, token);
        }
    };
    

    return (
        <div className="btn-follow">
            {isLoggedIn && (
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
