import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Services/AuthContext";

import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { Button } from "@mui/material";
import { postAxiosReqAuth } from "../../Services/AxiosPost";

function BtnFollow({ idUser, isLoggedIn, idUserFollow, isFollowedProp }) {
    const [isFollowed, setIsFollowed] = useState(isFollowedProp);
    const { checkToken } = useContext(AuthContext);

    useEffect(() => {
        setIsFollowed(isFollowedProp);
    }, [isFollowedProp]);

    // change Btn Follow
    const changeBtnFollow = (idUserFollow, value) => {
        const lstBtnFollow = document.querySelectorAll(`#follow-user-${idUserFollow}`);
        lstBtnFollow.forEach((btnFollow) => {
            btnFollow.innerHTML = value;
        });
    };

    const toggleFollow = async () => {
        await checkToken();

        try {
            const token = getLocalStorage("token");
            const data = {
                idUser: idUser,
                idUserFollow: idUserFollow,
            };

            setIsFollowed(!isFollowed);

            // call addFavoris or removeFavoris
            if (isFollowed) {
                await postAxiosReqAuth("/unfollowUser", data, token);
                changeBtnFollow(idUserFollow, "Follow");
            } else {
                await postAxiosReqAuth("/followUser", data, token);
                changeBtnFollow(idUserFollow, "Unfollow");
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    return (
        <div className="btn-follow">
            {parseInt(idUser) !== idUserFollow && isLoggedIn && (
                <Button id={`follow-user-${idUserFollow}`} variant="contained" onClick={() => toggleFollow()}>
                    {isFollowed ? "Unfollow" : "Follow"}
                </Button>
            )}
        </div>
    );
}

export default BtnFollow;
