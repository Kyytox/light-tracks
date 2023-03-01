import React, { useState } from "react";

import FavoriteIcon from "@mui/icons-material/Favorite";
import { addFavoris, removeFavoris } from "../../Globals/GlobalFunctions";
import { colorsFav } from "../../Globals/Colors";
// use location
import { useLocation } from "react-router-dom";

function BtnFavorisAlbum({ idUser, isLoggedIn, idAlbum }) {
    const location = useLocation();
    const [favorisAlbum, setFavorisAlbum] = useState(location.pathname.includes("wantlist"));

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
            {isLoggedIn && (
                <FavoriteIcon
                    id={`fav-album-${idAlbum}`}
                    sx={{
                        color: favorisAlbum ? colorsFav.primary : colorsFav.secondary,
                    }}
                    onClick={() => toggleFavoriAlbum(idAlbum)}
                />
            )}
        </div>
    );
}

export default BtnFavorisAlbum;
