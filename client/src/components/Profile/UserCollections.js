import React, { useState, useEffect, useContext } from "react";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { AuthContext } from "../../Services/AuthContext";
import LstCollection from "./LstCollection";
import { getAxiosReqAuth } from "../../Services/AxiosGet";

import JSZip from "jszip";
import axios from "axios";

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
                    setLstCollections(response);
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

    const createZipFile = async (urls) => {
        const zip = new JSZip();
        const promises = urls.map(async (url) => {
            console.log("createZipFile -- url: ", url);
            const response = await axios.get(url, { responseType: "blob" });
            const fileName = Math.random().toString(36).substring(7) + ".wav";
            zip.file(fileName, response.data);
            console.log("createZipFile -- zip: ", zip);
        });
        await Promise.all(promises);
        return zip.generateAsync({ type: "blob" });
    };

    // download album
    const downloadAlbum = async (idAlbum) => {
        // console.log("downloadAlbum -- idAlbum: ", idAlbum);
        await checkToken();
        const token = getLocalStorage("token");
        const data = { idUser: idUser, idAlbum: idAlbum };
        try {
            console.log("downloadAlbum -- /downloadAlbum");
            const response = await getAxiosReqAuth("/downloadAlbum", data, token);
            console.log("downloadAlbum -- response: ", response);
            try {
                const urls = response;
                console.log("urls: ", urls);
                const zip = await createZipFile(urls);
                console.log("zip: ", zip);
                await downloadZipFile(zip);
            } catch (error) {
                console.log("Error downloading album:", error);
            }
        } catch (error) {
            console.log("Error fetching data from server: ", error);
        }
    };

    const downloadZipFile = async (zip) => {
        const blob = new Blob([zip], { type: "application/zip" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Album.zip";
        link.click();
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
