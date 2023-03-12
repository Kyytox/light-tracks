import React, { useState, useEffect, useContext } from "react";
import { backendUrl } from "../../Globals/GlobalVariables";
import axios from "axios";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { AuthContext } from "../../Services/AuthContext";
import LstCollection from "./LstCollection";

// display all collections of user (album buyed)
function UserCollections() {
    const { isLoggedIn } = useContext(AuthContext);
    const idUser = getLocalStorage("id");
    const [lstCollections, setLstCollections] = useState([]);

    useEffect(() => {
        const token = getLocalStorage("token");

        // call /getCollections with axios post
        axios
            .get(backendUrl + "/getCollection", {
                params: { idUser: idUser },
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setLstCollections(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <LstCollection idUser={idUser} isLoggedIn={isLoggedIn} lstAlbums={lstCollections} />
                </div>
            ) : (
                <div>u need to be logged in to see your collections</div>
            )}
        </div>
    );
}

export default UserCollections;
