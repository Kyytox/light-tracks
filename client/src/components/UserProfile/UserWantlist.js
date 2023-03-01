import React, { useState, useEffect, useContext } from "react";
import { backendUrl } from "../../Globals/GlobalVariables";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import LstAlbums from "../Album/LstAlbums";
import axios from "axios";
import { AuthContext } from "../../Services/AuthContext";

function UserWantlist() {
    const { isLoggedIn } = useContext(AuthContext);
    const [lstFavoris, setLstFavoris] = useState([]);
    const idUser = getLocalStorage("id");

    useEffect(() => {
        const token = getLocalStorage("token");

        // call /getFavoris with axios post
        axios
            .get(backendUrl + "/getFavoris", {
                params: { idUser: idUser },
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setLstFavoris(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <LstAlbums idUser={idUser} isLoggedIn={isLoggedIn} lstAlbums={lstFavoris} />
                </div>
            ) : (
                <div>u need to be logged in to see your collections</div>
            )}
        </div>
    );
}

export default UserWantlist;
