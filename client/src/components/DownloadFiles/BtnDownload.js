import React from "react";

import DownloadAlbum from "./DownloadAlbum";

const BtnDownload = ({ idAlbum }) => {
    return (
        <button type="button" onClick={() => DownloadAlbum.downloadAlbum(idAlbum)}>
            Download
        </button>
    );
};

export default BtnDownload;
