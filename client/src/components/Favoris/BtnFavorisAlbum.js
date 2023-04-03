import React, { useState, useContext } from "react";

import FavoriteIcon from "@mui/icons-material/Favorite";
import { colorsFav } from "../../Globals/Colors";
import { AuthContext } from "../../Services/AuthContext";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { postAxiosReqAuth } from "../../Services/AxiosPost";

function BtnFavorisAlbum({ idUser, idAlbum, topFav }) {
    const { isLoggedIn, checkToken } = useContext(AuthContext);
    const [favorisAlbum, setFavorisAlbum] = useState(topFav);

    const toggleFavoriAlbum = async (idAlbum) => {
        await checkToken();
        const token = getLocalStorage("token");

        if (isLoggedIn) {
            setFavorisAlbum(!favorisAlbum);

            const data = {
                idUser: idUser,
                idAlbum: idAlbum,
                idTrack: null,
            };

            try {
                // call addFavoris or removeFavoris
                if (favorisAlbum) {
                    await postAxiosReqAuth("/deleteFavoris", data, token);
                } else {
                    await postAxiosReqAuth("/addFavoris", data, token);
                }
            } catch (error) {
                console.log("Error fetching data from server: ", error);
            }
        }
    };

    return (
        <div className="btn-fav">
            <FavoriteIcon
                id={`fav-album-${idAlbum}`}
                sx={{
                    color: favorisAlbum ? colorsFav.primary : colorsFav.secondary,
                }}
                onClick={() => toggleFavoriAlbum(idAlbum)}
            />
        </div>
    );
}

export default BtnFavorisAlbum;
