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

    // // change idAlbumPlay and charge tracks
    const changeIdAlbumPlay = (idAlbum) => {
        const album = lstAlbums.find((album) => album.a_id === idAlbum);
        if (!album) return;

        const lstTracks = album.tracks.map((track) => {
            track.t_id_album = idAlbum;
            track.id_user = parseInt(idUser);

            // find cptPlay in album.user_song_played
            const cptPlay = album.user_song_played.find(
                (trackCptPlay) => trackCptPlay.usp_id_album_track === track.t_id_album_track
            );

            // insert cptPlay in track else cptPlay = 0
            track.t_cpt_play = cptPlay ? cptPlay.usp_cpt_play : 0;

            return track;
        });

        setLstTracksPlay(lstTracks);
    };

    // change btnFavoris
    useLayoutEffect(() => {
        if (lstAlbums.length > 0 && lstSalesFavoris.length > 0) {
            changeBtnFavoris(lstSalesFavoris);
        }
    }, [lstAlbums, lstSalesFavoris]);

    console.log("MainExplorer -- lstAlbums = ", lstAlbums);

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
