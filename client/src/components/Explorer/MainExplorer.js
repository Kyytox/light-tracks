import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import LstAlbums from "../Album/LstAlbums";
import { AuthContext } from "../../Services/AuthContext";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { changeBtnFavoris } from "../../Globals/GlobalFunctions";
import { getAxiosReq, getAxiosReqAuth } from "../../Services/AxiosGet";

function MainExplorer() {
    const [lstAlbums, setLstAlbums] = useState([]);
    const [lstSalesFavoris, setLstSalesFavoris] = useState([]);
    const date = new Date();
    const { idUser, isLoggedIn, checkToken } = useContext(AuthContext);

    // get albums and sales favoris
    useEffect(() => {
        checkToken();

        // get albums
        const data = { date: date };
        const response = getAxiosReq("/getAlbums", data);
        response.then((data) => {
            setLstAlbums(data);
        });

        // get sales favoris
        if (isLoggedIn) {
            const token = getLocalStorage("token");
            const data = { idUser: idUser };
            const response = getAxiosReqAuth("/getSalesFavoris", data, token);
            response.then((data) => {
                setLstSalesFavoris(data);
            });
        }
    }, [checkToken]);

    // change btnFavoris
    useLayoutEffect(() => {
        if (lstAlbums.length > 0 && lstSalesFavoris.length > 0) {
            changeBtnFavoris(lstSalesFavoris);
        }
    }, [lstAlbums, lstSalesFavoris]);

    console.log("lstAlbums", lstAlbums);

    return (
        <div>
            <h1>Explorer</h1>
            <LstAlbums idUser={idUser} isLoggedIn={isLoggedIn} lstAlbums={lstAlbums} />
        </div>
    );
}

export default MainExplorer;
