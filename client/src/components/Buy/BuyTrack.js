import React, { useState, useEffect, useContext } from "react";
import { Button } from "@mui/material";
import { AuthContext } from "../../Services/AuthContext";
import { getAxiosReq, getAxiosReqAuth } from "../../Services/AxiosGet";
import { postAxiosReqAuth } from "../../Services/AxiosPost";
import { getLocalStorage } from "../../Globals/GlobalFunctions";

function BuyTrack({ idAlbum, price, setLstTracksPlay }) {
    const { isLoggedIn, checkToken } = useContext(AuthContext);
    const idUser = getLocalStorage("id");

    // // buy Track
    // const ClickBuyTrack = async (idAlbum, idTrack, idTrackAlbum, price) => {
    //     await checkToken();
    //     const token = getLocalStorage("token");

    //     // create const data with infosAlbum
    //     const data = {
    //         idUser: idUser,
    //         idAlbum: idAlbum,
    //         idTrack: idTrack,
    //     };

    //     if (isLoggedIn) {
    //         console.log("PageAlbum -> /buyTrack");
    //         try {
    //             const response = await postAxiosReqAuth("/buyTrack", data, token);
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
    // // add Track to Sales
    // const AddTrackToSales = async (idAlbum, idTrack, idTrackAlbum, price, invoiceKey, payementHash) => {
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
    //         console.log("PageAlbum -> /addTrackToSales");
    //         try {
    //             const response = await postAxiosReqAuth("/addTrackToSales", data, token);
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
                // onClick={() => ClickBuyTrack(infosAlbum.a_id, track.t_id, track.t_id_album_track, track.t_price)}
            >
                Buy
            </Button>
        </div>
    );
}

export default BuyTrack;
