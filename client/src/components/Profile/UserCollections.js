import React, { useState, useEffect, useContext } from "react";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { AuthContext } from "../../Services/AuthContext";
import LstCollection from "./LstCollection";
import { getAxiosReqAuth } from "../../Services/AxiosGet";

// display all collections of user (album buyed)
function UserCollections({ setLstTracksPlay }) {
    const { isLoggedIn, checkToken } = useContext(AuthContext);
    const idUser = getLocalStorage("id");
    const [lstCollections, setLstCollections] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await checkToken();
            const token = getLocalStorage("token");
            if (isLoggedIn) {
                try {
                    const data = { idUser: idUser };
                    console.log("UserCollections -- /getCollection");
                    const response = await getAxiosReqAuth("/getCollection", data, token);
                    setLstCollections(response.data);
                } catch (error) {
                    console.log("Error fetching data from server: ", error);
                }
            }
        };

        fetchData();
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

    // download album
    const downloadAlbum = async (idAlbum) => {
        console.log("downloadAlbum -- idAlbum: ", idAlbum);
        await checkToken();
        const token = getLocalStorage("token");
        const data = { idUser: idUser, idAlbum: idAlbum };
        try {
            console.log("downloadAlbum -- /downloadAlbum");
            const response = await getAxiosReqAuth("/downloadAlbum", data, token, {
                responseType: "blob",
            });
            console.log("downloadAlbum -- response: ", response);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "file.zip");
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.log("Error fetching data from server: ", error);
        }
    };

    console.log("UserCollections -- lstCollections = ", lstCollections);

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <LstCollection
                        lstAlbums={lstCollections}
                        changeIdAlbumPlay={changeIdAlbumPlay}
                        downloadAlbum={downloadAlbum}
                    />
                </div>
            ) : (
                <div>u need to be logged in to see your collections</div>
            )}
        </div>
    );
}

export default UserCollections;
