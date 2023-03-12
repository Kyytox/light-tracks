import React, { useState, useEffect, useContext } from "react";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { AuthContext } from "../../Services/AuthContext";
import { getFollows, checkFollowed } from "../../Globals/FctsFollow";
import LstMyFollows from "./LstMyFollows";


function UserMyFollows() {
    const { isLoggedIn } = useContext(AuthContext);
    const [lstFollows, setLstFollows] = useState([]);
    const idUser = getLocalStorage("id");

    useEffect(() => {
        const token = getLocalStorage("token");

        // get follows
        const rep = getFollows(idUser, token);
        rep.then((data) => {
            setLstFollows(data);
        });
    }, []);

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <LstMyFollows idUser={idUser} isLoggedIn={isLoggedIn} lstFollows={lstFollows} />
                </div>
            ) : (
                <div>u need to be logged in to see your collections</div>
            )}
        </div>
    );
}

export default UserMyFollows;
