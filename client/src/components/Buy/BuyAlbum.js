import React, { useState, useEffect, useContext } from "react";
import { Button } from "@mui/material";
import { AuthContext } from "../../Services/AuthContext";
import { getAxiosReq, getAxiosReqAuth } from "../../Services/AxiosGet";
import { postAxiosReqAuth } from "../../Services/AxiosPost";
import { getLocalStorage } from "../../Globals/GlobalFunctions";

function BuyAlbum({ idAlbum, price, setLstTracksPlay }) {
    const { isLoggedIn, checkToken } = useContext(AuthContext);
    const idUser = getLocalStorage("id");

    // const ClickBuyAlbum = async (idAlbum, idTrack, idTrackAlbum, price) => {
    //     await checkToken();
    //     const token = getLocalStorage("token");

    //     // create const data with infosAlbum
    //     const data = {
    //         idUser: idUser,
    //         idAlbum: idAlbum,
    //     };

    //     if (isLoggedIn) {
    //         console.log("PageAlbum -> /buyAlbum");
    //         try {
    //             const response = await postAxiosReqAuth("/buyAlbum", data, token);
    //             console.log("response", response);
    //             setInfosInvoice({
    //                 payementHash: response.payementHash,
    //                 payementRequest: response.payementRequest,
    //             });

    //             verifyInvoice(idAlbum, idTrack, idTrackAlbum, price, response.invoiceKey, response.payementHash);
    //             if (response.data.success) {
    //                 console.log("response");
    //             }
    //         } catch (error) {
    //             console.log("error", error);
    //         }
    //     }
    // };

    // // add album to Sales
    // const AddAlbumToSales = async (idAlbum, idTrack, idTrackAlbum, price, invoiceKey, payementHash) => {
    //     await checkToken();
    //     const token = getLocalStorage("token");

    //     // create const data with infosAlbum
    //     const data = {
    //         idUser: idUser,
    //         idAlbum: idAlbum,
    //         idTrack: idTrack,
    //         idTrackAlbum: idTrackAlbum,
    //         price: price,
    //         invoiceKey: invoiceKey,
    //         payementHash: payementHash,
    //     };

    //     if (isLoggedIn) {
    //         console.log("PageAlbum -> /addAlbumToSales");
    //         try {
    //             const response = await postAxiosReqAuth("/addAlbumToSales", data, token);
    //             console.log("response", response);
    //             if (response.succes) {
    //                 console.log("response");
    //                 window.location.reload();
    //             }
    //         } catch (error) {
    //             console.log("error", error);
    //         }
    //     }
    // };

    return (
        <div>
            <Button
                variant="contained"
                // onClick={() => ClickBuyAlbum(infosAlbum.a_id, null, null, infosAlbum.a_price)}
            >
                Buy
            </Button>
        </div>
    );
}

export default BuyAlbum;
