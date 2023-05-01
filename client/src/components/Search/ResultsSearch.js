import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { getAxiosReq, getAxiosReqAuth } from "../../Services/AxiosGet";
import { AuthContext } from "../../Services/AuthContext";
import { getLocalStorage } from "../../Globals/GlobalFunctions";

function ResultsSearch() {
    const dataSearch = new URLSearchParams(useLocation().search).get("search");
    const { isLoggedIn, checkToken, idUser } = useContext(AuthContext);

    // list of albums to display in Explorer
    const [lstAlbums, setLstAlbums] = useState([]);

    // get albums by search
    useEffect(() => {
        const fetchData = async () => {
            await checkToken();
            const token = getLocalStorage("token");

            console.log("MainSearch -- dataSearch = ", dataSearch);

            // console.log("MainSearch -- ", isLoggedIn ? "/getSearchAuth" : "/getSearch");
            // try {
            //     const response = isLoggedIn
            //         ? await getAxiosReqAuth("/getSearchAuth", data, token)
            //         : await getAxiosReq("/getSearch", data);

            //     setLstAlbums(response);
            // } catch (error) {
            //     console.log(error);
            // }
        };

        fetchData();
    }, [checkToken]);

    return (
        <div>
            <h1>Résultats de la recherche</h1>
            {/* afficher les résultats ici */}
        </div>
    );
}

export default ResultsSearch;
