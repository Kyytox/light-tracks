import React from "react";

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { backendUrl } from "../../Globals/GlobalVariables";
import axios from "axios";
import { getLocalStorage } from "../../Globals/GlobalFunctions";


function BtnDeleteAlbum({ idUser, isLoggedIn, idAlbum, idAlbumUser, coverPath}) {

    const deleteAlbum = (idAlbum) => {
        const data = {
            idUser: idUser,
            idAlbum: idAlbum,
            idAlbumUser: idAlbumUser,
            coverPath: coverPath,
        };

        const token = getLocalStorage("token");

        // Delete album
        axios
            .post(backendUrl + "/deleteAlbum", data, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                console.log("response", response);
            }
            )
            .catch((error) => {
                console.error(error);
            }
            );
    };
    

    return (
        <div className="btn-del-album">
            {isLoggedIn && (
                <DeleteForeverIcon
                    id={`del-album-${idAlbum}`}
                    onClick={() => deleteAlbum(idAlbum)}
                />
            )}
        </div>
    );
}

export default BtnDeleteAlbum;
