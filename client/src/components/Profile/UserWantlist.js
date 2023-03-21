import React, { useState, useEffect, useContext } from "react";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import LstAlbums from "../Album/LstAlbums";
import { AuthContext } from "../../Services/AuthContext";
import { getAxiosReqAuth } from "../../Services/AxiosGet";

function UserWantlist() {
    const { isLoggedIn } = useContext(AuthContext);
    const [lstFavoris, setLstFavoris] = useState([]);
    const idUser = getLocalStorage("id");

    // get favoris
    useEffect(() => {
        const token = getLocalStorage("token");
        const data = { idUser: idUser };
        const response = getAxiosReqAuth("/getFavoris", data, token);
        response.then((data) => {
            setLstFavoris(data);
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
