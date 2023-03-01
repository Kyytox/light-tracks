import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../Globals/GlobalVariables";
import LstAlbums from "../Album/LstAlbums";
import { AuthContext } from "../../Services/AuthContext";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { changeBtnFavoris } from "../../Globals/GlobalFunctions";

function MainExplorer() {
    const [lstAlbums, setLstAlbums] = useState([]);
    const [lstSalesFavoris, setLstSalesFavoris] = useState([]);
    const date = new Date();
    const { idUser, isLoggedIn, checkToken } = useContext(AuthContext);

    // use useeffect to get all albums
    // call /getAlbums with axios post
    useEffect(() => {
        checkToken();
        axios
            .get(backendUrl + "/getAlbums", { params: { date: date } })
            .then((response) => {
                setLstAlbums(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

        if (isLoggedIn) {
            const token = getLocalStorage("token");
            axios
                .get(backendUrl + "/getSalesFavoris", { params: { idUser: idUser }, headers: { Authorization: `Bearer ${token}` } })
                .then((response) => {
                    console.log("response", response.data);
                    setLstSalesFavoris(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [checkToken]);

    // change btnFavoris
    useLayoutEffect(() => {
        if (lstSalesFavoris.length === 0) return;
        changeBtnFavoris(lstSalesFavoris);
    }, [lstAlbums]);

    return (
        <div>
            <h1>Explorer</h1>
            <LstAlbums idUser={idUser} isLoggedIn={isLoggedIn} lstAlbums={lstAlbums} />
        </div>
    );
}

export default MainExplorer;
