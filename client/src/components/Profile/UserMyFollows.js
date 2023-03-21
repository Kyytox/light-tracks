import React, { useState, useEffect, useContext } from "react";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { AuthContext } from "../../Services/AuthContext";
import LstMyFollows from "./LstMyFollows";
import { getAxiosReqAuth } from "../../Services/AxiosGet";

function UserMyFollows() {
    const { isLoggedIn } = useContext(AuthContext);
    const [lstFollows, setLstFollows] = useState([]);
    const idUser = getLocalStorage("id");

    useEffect(() => {
        // get follows
        const token = getLocalStorage("token");
        const data = { idUser: idUser };
        const response = getAxiosReqAuth("/getFollows", data, token);
        response.then((data) => {
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
