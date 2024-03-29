import React, { useState, useEffect, useContext } from "react";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { AuthContext } from "../../Services/AuthContext";
import LstMyAlbums from "./LstMyAlbums";
import { getAxiosReqAuth } from "../../Services/AxiosGet";

// created by display all Albums created by user (album buyed)
function UserMyAlbums() {
    const { isLoggedIn, checkToken } = useContext(AuthContext);
    const idUser = getLocalStorage("id");
    const [lstMyAlbums, setLstMyAlbums] = useState([]);

    useEffect(() => {
        checkToken();

        if (isLoggedIn) {
            const token = getLocalStorage("token");

            // get my albums
            console.log("UserMyAlbums -- /getMyAlbums");
            const data = { idUser: idUser };
            const response = getAxiosReqAuth("/getMyAlbums", data, token);
            response.then((data) => {
                setLstMyAlbums(data);
            });
        }
    }, [idUser]);

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <LstMyAlbums idUser={idUser} isLoggedIn={isLoggedIn} lstAlbums={lstMyAlbums} />
                </div>
            ) : (
                <div>u need to be logged in to see your collections</div>
            )}
        </div>
    );
}

export default UserMyAlbums;
