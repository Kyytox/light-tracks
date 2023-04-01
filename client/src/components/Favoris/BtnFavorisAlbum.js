import React, { useState } from "react";

import FavoriteIcon from "@mui/icons-material/Favorite";
import { addFavoris, removeFavoris } from "../../Globals/GlobalFunctions";
import { colorsFav } from "../../Globals/Colors";

function BtnFavorisAlbum({ idUser, idAlbum, topFav }) {
    const [favorisAlbum, setFavorisAlbum] = useState(topFav);

    const toggleFavoriAlbum = (idAlbum) => {
        setFavorisAlbum(!favorisAlbum);

        const data = {
            idUser: idUser,
            idAlbum: idAlbum,
            idTrack: null,
        };

        // call addFavoris or removeFavoris
        if (favorisAlbum) {
            removeFavoris(data);
        } else {
            addFavoris(data);
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
