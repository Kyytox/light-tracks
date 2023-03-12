import React, { useState, useEffect, useContext } from "react";
import { backendUrl } from "../../Globals/GlobalVariables";
import axios from "axios";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { AuthContext } from "../../Services/AuthContext";
import LstMyAlbums from "./LstMyAlbums";

// created by display all Albums created by user (album buyed)
function UserMyAlbums() {
    const { isLoggedIn } = useContext(AuthContext);
    const idUser = getLocalStorage("id");
    const [lstMyAlbums, setLstMyAlbums] = useState([]);

    useEffect(() => {
        const token = getLocalStorage("token");

        // call /getMyAlbums with axios post
        axios
            .get(backendUrl + "/getMyAlbums", {
                params: { idUser: idUser },
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setLstMyAlbums(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [idUser]);

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <LstMyAlbums idUser={idUser} isLoggedIn={isLoggedIn} lstAlbums={lstMyAlbums} />
                </div>
            ) : (
                <div>u need to be logged in to see your collections</div>
            )}
        </div>
    );
}

export default UserMyAlbums;
