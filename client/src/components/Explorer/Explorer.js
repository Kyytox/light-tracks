import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../Services/AuthContext";

import LstAlbums from "../Album/LstAlbums";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { getAxiosReq, getAxiosReqAuth } from "../../Services/AxiosGet";

function Explorer({ option, lstAlbums, setLstAlbums, setLstTracksPlay }) {
    const { idUser, isLoggedIn, checkToken } = useContext(AuthContext);
    const date = new Date();

    // get albums and sales favoris
    useEffect(() => {
        const fetchData = async () => {
            await checkToken();
            const token = getLocalStorage("token");

            const explorerSection = isLoggedIn ? `/getAlbumsAuth${option}` : "/getAlbums";
            console.log("MainExplorer -- explorerSection = ", explorerSection);

            try {
                const data = { date: date, idUser: idUser };
                const response = isLoggedIn
                    ? getAxiosReqAuth(explorerSection, data, token)
                    : getAxiosReq(explorerSection, data);
                response.then((res) => setLstAlbums(res !== undefined ? res : []));
            } catch (error) {
                console.log("Error fetching data from server: ", error);
            }
        };

        fetchData();
    }, [checkToken]);

    // // change idAlbumPlay and charge tracks
    const changeIdAlbumPlay = (idAlbum) => {
        const album = lstAlbums.find((album) => album.a_id === idAlbum);
        if (!album) return;

        const lstTracks = album.tracks.map((track) => {
            track.t_id_album = idAlbum;
            track.id_user = parseInt(idUser);
            return track;
        });

        setLstTracksPlay(lstTracks);
    };

    console.log("MainExplorer -- lstAlbums = ", lstAlbums);

    return (
        <div>
            <h1>Explorer</h1>

            {/* LstAlbums */}
            <LstAlbums
                idUser={idUser}
                isLoggedIn={isLoggedIn}
                lstAlbums={lstAlbums}
                changeIdAlbumPlay={changeIdAlbumPlay}
            />
        </div>
    );
}

export default Explorer;
