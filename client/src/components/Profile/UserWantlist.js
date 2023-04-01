import React, { useState, useEffect, useContext } from "react";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import LstAlbums from "../Album/LstAlbums";
import { AuthContext } from "../../Services/AuthContext";
import { getAxiosReqAuth } from "../../Services/AxiosGet";

function UserWantlist({ setLstTracksPlay }) {
    const { isLoggedIn, checkToken } = useContext(AuthContext);
    const [lstFavoris, setLstFavoris] = useState([]);
    const idUser = getLocalStorage("id");

    console.log("UserWantlist -- lstFavoris = ", lstFavoris);

    // get favoris
    useEffect(() => {
        checkToken();

        if (isLoggedIn) {
            console.log("UserWantlist -- /getFavoris");
            const token = getLocalStorage("token");
            const data = { idUser: idUser };
            const response = getAxiosReqAuth("/getFavoris", data, token);
            response.then((data) => {
                setLstFavoris(data);
            });
        }
    }, []);

    // // change idAlbumPlay and charge tracks
    const changeIdAlbumPlay = (idAlbum) => {
        const album = lstFavoris.find((album) => album.a_id === idAlbum);
        if (!album) return;

        const lstTracks = album.tracks.map((track) => {
            track.t_id_album = idAlbum;
            track.id_user = parseInt(idUser);

            return track;
        });

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
