import React, { useState, useEffect, useContext } from "react";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import LstAlbums from "../Album/LstAlbums";
import { AuthContext } from "../../Services/AuthContext";
import { getAxiosReqAuth } from "../../Services/AxiosGet";

function UserWantlist({ setLstTracksPlay }) {
    const { isLoggedIn } = useContext(AuthContext);
    const [lstFavoris, setLstFavoris] = useState([]);
    const idUser = getLocalStorage("id");

    console.log("UserWantlist -- idUser", idUser);

    // get favoris
    useEffect(() => {
        const token = getLocalStorage("token");
        const data = { idUser: idUser };
        const response = getAxiosReqAuth("/getFavoris", data, token);
        response.then((data) => {
            setLstFavoris(data);
        });
    }, []);

    // change idAlbumPlay and charge tracks
    const changeIdAlbumPlay = (idAlbum) => {
        // get tracks in lstAlbums with idAlbum
        const lstTracks = lstFavoris.filter((album) => album.a_id === idAlbum)[0].tracks;
        console.log("UserWantlist -- lstFavoris", lstFavoris);
        setLstTracksPlay(lstTracks);
    };

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <LstAlbums
                        idUser={idUser}
                        isLoggedIn={isLoggedIn}
                        lstAlbums={lstFavoris}
                        changeIdAlbumPlay={changeIdAlbumPlay}
                    />
                </div>
            ) : (
                <div>u need to be logged in to see your collections</div>
            )}
        </div>
    );
}

export default UserWantlist;
