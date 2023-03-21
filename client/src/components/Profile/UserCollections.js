import React, { useState, useEffect, useContext } from "react";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { AuthContext } from "../../Services/AuthContext";
import LstCollection from "./LstCollection";
import { getAxiosReqAuth } from "../../Services/AxiosGet";

// display all collections of user (album buyed)
function UserCollections() {
    const { isLoggedIn } = useContext(AuthContext);
    const idUser = getLocalStorage("id");
    const [lstCollections, setLstCollections] = useState([]);

    useEffect(() => {
        const token = getLocalStorage("token");

        // call /getCollections with axios post
        const data = { idUser: idUser };
        const response = getAxiosReqAuth("/getCollection", data, token);
        response.then((data) => {
            setLstCollections(data);
        });
    }, []);

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <LstCollection
                        idUser={idUser}
                        isLoggedIn={isLoggedIn}
                        lstAlbums={lstCollections}
                    />
                </div>
            ) : (
                <div>u need to be logged in to see your collections</div>
            )}
        </div>
    );
}

export default UserCollections;
