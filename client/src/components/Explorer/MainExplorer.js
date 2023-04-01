import React, { useState, useEffect, useContext } from "react";
import LstAlbums from "../Album/LstAlbums";
import { AuthContext } from "../../Services/AuthContext";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { getAxiosReq, getAxiosReqAuth } from "../../Services/AxiosGet";
import PlayerAudio from "../PlayerAudio/PlayerAudio";
import MainSearch from "../Search/MainSearch";

function MainExplorer() {
    const { idUser, isLoggedIn, checkToken } = useContext(AuthContext);
    const [lstAlbums, setLstAlbums] = useState([]);
    const date = new Date();

    const [lstTracksPlay, setLstTracksPlay] = useState([]);

    // get albums and sales favoris
    useEffect(() => {
        checkToken();

        const token = getLocalStorage("token");
        const data = { date: date, idUser: idUser };

        console.log("MainExplorer -- " + (isLoggedIn ? "/getAlbumsSalesFavoris" : "/getAlbums"));

        const response = isLoggedIn
            ? getAxiosReqAuth("/getAlbumsSalesFavoris", data, token)
            : getAxiosReq("/getAlbums", data);

        response.then((res) => {
            setLstAlbums(res);
        });
    }, [checkToken]);

    // // change idAlbumPlay and charge tracks
    const changeIdAlbumPlay = (idAlbum) => {
        const album = lstAlbums.find((album) => album.a_id === idAlbum);
        if (!album) return;

        const lstTracks = album.tracks.map((track) => {
            track.t_id_album = idAlbum;
            track.id_user = parseInt(idUser);
            // var cptPlay = 0;

            // if (idUser) {
            //     // find cptPlay in album.user_song_played
            //     cptPlay = album.user_song_played.find(
            //         (trackCptPlay) => trackCptPlay.usp_id_album_track === track.t_id_album_track
            //     );
            // }

            // // insert cptPlay in track else cptPlay = 0
            // track.t_cpt_play = cptPlay ? cptPlay.usp_cpt_play : 0;

            return track;
        });

        setLstTracksPlay(lstTracks);
    };

    console.log("MainExplorer -- lstAlbums = ", lstAlbums);

    return (
        <div>
            <h1>Explorer</h1>

            {/* Search Inputs */}
            <MainSearch setLstAlbums={setLstAlbums} />

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
