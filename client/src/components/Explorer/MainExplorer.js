import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import LstAlbums from "../Album/LstAlbums";
import { AuthContext } from "../../Services/AuthContext";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { changeBtnFavoris } from "../../Globals/GlobalFunctions";
import { getAxiosReq, getAxiosReqAuth } from "../../Services/AxiosGet";
import PlayerAudio from "../PlayerAudio/PlayerAudio";

function MainExplorer() {
    const [lstAlbums, setLstAlbums] = useState([]);
    const [lstSalesFavoris, setLstSalesFavoris] = useState([]);
    const date = new Date();
    const { idUser, isLoggedIn, checkToken } = useContext(AuthContext);

    // const [idAlbumPlay, setIdAlbumPlay] = useState(0);
    const [lstTracksPlay, setLstTracksPlay] = useState([]);

    // get albums and sales favoris
    useEffect(() => {
        checkToken();

        // get albums
        const data = { date: date };
        const response = getAxiosReq("/getAlbums", data);
        response.then((data) => {
            setLstAlbums(data);
        });

        // get sales favoris
        if (isLoggedIn) {
            const token = getLocalStorage("token");
            const data = { idUser: idUser };
            const response = getAxiosReqAuth("/getSalesFavoris", data, token);
            response.then((data) => {
                setLstSalesFavoris(data);
            });
        }
    }, [checkToken]);

    // change idAlbumPlay and charge tracks
    const changeIdAlbumPlay = (idAlbum) => {
        // setIdAlbumPlay(idAlbum);

        // get tracks in lstAlbums with idAlbum
        const lstTracks = lstAlbums.filter((album) => album.a_id === idAlbum)[0].tracks;
        setLstTracksPlay(lstTracks);
    };

    // change btnFavoris
    useLayoutEffect(() => {
        if (lstAlbums.length > 0 && lstSalesFavoris.length > 0) {
            changeBtnFavoris(lstSalesFavoris);
        }
    }, [lstAlbums, lstSalesFavoris]);

    console.log("MainExplorer -- lstTracks", lstTracksPlay);

    return (
        <div>
            <h1>Explorer</h1>

            {/* PlayerAudio */}
            {lstTracksPlay.length > 0 && <PlayerAudio playlist={lstTracksPlay} />}

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

export default MainExplorer;
