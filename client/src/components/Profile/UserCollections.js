import React, { useState, useEffect, useContext } from "react";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { AuthContext } from "../../Services/AuthContext";
import LstCollection from "./LstCollection";
import { getAxiosReqAuth } from "../../Services/AxiosGet";

// display all collections of user (album buyed)
function UserCollections({ setLstTracksPlay }) {
    const { isLoggedIn } = useContext(AuthContext);
    const idUser = getLocalStorage("id");
    const [lstCollections, setLstCollections] = useState([]);

    useEffect(() => {
        const token = getLocalStorage("token");

        // call /getCollections with axios post
        console.log("UserCollections -- /getCollection");
        const data = { idUser: idUser };
        const response = getAxiosReqAuth("/getCollection", data, token);
        response.then((data) => {
            setLstCollections(data);
        });
    }, []);

    // change idAlbumPlay and charge tracks
    const changeIdAlbumPlay = (idAlbum) => {
        // get tracks in lstAlbums with idAlbum
        const lstTracks = lstCollections.filter((album) => album.a_id === idAlbum)[0].tracks;
        lstTracks.forEach((track) => {
            track.t_id_album = idAlbum;
            track.id_user = parseInt(idUser);
        });
        setLstTracksPlay(lstTracks);
    };

    console.log("UserCollections -- lstCollections = ", lstCollections);

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <LstCollection lstAlbums={lstCollections} changeIdAlbumPlay={changeIdAlbumPlay} />
                </div>
            ) : (
                <div>u need to be logged in to see your collections</div>
            )}
        </div>
    );
}

export default UserCollections;
