import React, { useContext } from "react";
import JSZip from "jszip";
import axios from "axios";

import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { AuthContext } from "../../Services/AuthContext";
import { getAxiosReqAuth } from "../../Services/AxiosGet";

const BtnDownload = ({ idAlbum }) => {
    const { isLoggedIn, checkToken } = useContext(AuthContext);
    const idUser = getLocalStorage("id");

    // download album
    const downloadAlbum = async (idAlbum) => {
        await checkToken();
        const token = getLocalStorage("token");
        const data = { idUser: idUser, idAlbum: idAlbum };

        if (isLoggedIn) {
            try {
                console.log("downloadAlbum -- /downloadAlbum");
                const response = await getAxiosReqAuth("/downloadAlbum", data, token);
                console.log("downloadAlbum -- response: ", response);
                try {
                    const dataDownload = response;
                    const zip = await createZipFile(dataDownload);
                    await downloadZipFile(dataDownload, zip);
                } catch (error) {
                    console.log("Error downloading album:", error);
                }
            } catch (error) {
                console.log("Error fetching data from server: ", error);
            }
        }
    };

    const createZipFile = async (dataDownload) => {
        console.log("DownloadFiles -- createZipFile");
        const zip = new JSZip();
        const promises = dataDownload.map(async (data) => {
            const response = await axios.get(data.url, { responseType: "blob" });
            const fileName = data.filename + ".wav";
            zip.file(fileName, response.data);
        });
        await Promise.all(promises);
        return zip.generateAsync({ type: "blob" });
    };

    const downloadZipFile = async (dataDownload, zip) => {
        console.log("DownloadFiles -- downloadZipFile");
        const blob = new Blob([zip], { type: "application/zip" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = dataDownload[0].titleAlbum + " - " + dataDownload[0].artistAlbum + ".zip";
        link.click();
    };

    return (
        <button type="button" onClick={() => downloadAlbum(idAlbum)}>
            Download
        </button>
    );
};

export default BtnDownload;
