import React, { useState, useContext } from "react";
import { AuthContext } from "../../Services/AuthContext";
import { getAxiosReq } from "../../Services/AxiosGet";
import { postAxiosReqAuth } from "../../Services/AxiosPost";
import { getLocalStorage } from "../../Globals/GlobalFunctions";

// Material UI Components
import { TextField, Button } from "@mui/material";

function BtnBuyItem({ item, infosBuyItem, setInfosInvoice }) {
    const { isLoggedIn, checkToken } = useContext(AuthContext);
    const idUser = getLocalStorage("id");

    const [topCustomPrice, setTopCustomPrice] = useState(false);
    const [priceCustom, setPriceCustom] = useState({
        value: 0,
        error: false,
        helperText: "",
    });

    const apiBuyItem = "/buy" + item;
    const apiAddItem = "/add" + item + "ToSales";

    // Click buy Item
    const ClickBuy = async (infosBuyItem) => {
        await checkToken();
        const token = getLocalStorage("token");

        // create const data with infosAlbum
        const dataItem = {
            idUser: idUser,
            idAlbum: infosBuyItem.idAlbum,
            idTrack: infosBuyItem.idTrack,
            idTrackAlbum: infosBuyItem.idTrackAlbum,
            price: infosBuyItem.price,
        };

        if (isLoggedIn) {
            console.log("PageAlbum -> " + apiBuyItem);
            try {
                const response = await postAxiosReqAuth(apiBuyItem, dataItem, token);
                console.log("response", response);

                if (response.top_free) {
                    console.log("Album Add to Sales");
                } else if (response.top_custom_price) {
                    console.log("top_custom_price");
                    setTopCustomPrice(response.top_custom_price);
                } else {
                    // update infosInvoice
                    setInfosInvoice({
                        payementHash: response.payementHash,
                        payementRequest: response.payementRequest,
                    });

                    await verifyInvoice(dataItem, response.invoiceKey, response.payementHash);
                }
            } catch (error) {
                console.log("error", error);
            }
        }
    };

    // add Track to Sales
    const AddItemToSales = async (dataItem) => {
        await checkToken();
        const token = getLocalStorage("token");

        if (isLoggedIn) {
            console.log("PageAlbum -> " + apiAddItem);
            try {
                const response = await postAxiosReqAuth(apiAddItem, dataItem, token);
                console.log("response", response);
                if (response.success) {
                    console.log("response");
                    window.location.reload();
                }
            } catch (error) {
                console.log("error", error);
            }
        }
    };

    const verifyInvoice = async (dataItem, invoiceKey, payementHash) => {
        // add invoiceKey and payementHash to data
        dataItem.invoiceKey = invoiceKey;
        dataItem.payementHash = payementHash;

        console.log("PageAlbum -> /verifyInvoice");
        // Set up a loop that will execute the API call every 10 seconds
        const intervalId = setInterval(async () => {
            try {
                const repTopPayement = await getAxiosReq("/verifyInvoice", dataItem);
                console.log("repTopPayement", repTopPayement);

                if (repTopPayement) {
                    console.log("verify Invoice success");
                    clearInterval(intervalId); // Stop the loop.

                    // add Item to Sales
                    AddItemToSales(dataItem, invoiceKey, payementHash);
                }
            } catch (error) {
                console.log("error", error);
            }
        }, 10000); // 10 seconds
    };

    // call invoice with custom price
    const callInvoiceCustomPrice = async () => {
        if (priceCustom.value > 0.5) {
            console.log("On peut créer une invoice avec le prix custom");

            await checkToken();
            const token = getLocalStorage("token");

            // create const data with infosAlbum
            const dataItem = {
                idUser: idUser,
                idAlbum: infosBuyItem.idAlbum,
                idTrack: infosBuyItem.idTrack,
                idTrackAlbum: infosBuyItem.idTrackAlbum,
                price: priceCustom.value,
            };

            if (isLoggedIn) {
                console.log("PageAlbum -> /createInvoiceCustomPrice");
                try {
                    const response = await postAxiosReqAuth("/createInvoiceCustomPrice", dataItem, token);
                    console.log("response", response);

                    // update infosInvoice
                    setInfosInvoice({
                        payementHash: response.payementHash,
                        payementRequest: response.payementRequest,
                    });

                    await verifyInvoice(dataItem, response.invoiceKey, response.payementHash);
                } catch (error) {
                    console.log("error", error);
                }
            }
        } else {
            // update priceCustom with error
            setPriceCustom({
                value: priceCustom.value,
                error: true,
                helperText: "Price must be greater than 0.5",
            });
        }
    };

    return (
        <div>
            {/* display textInput if top_custom_price */}
            {(topCustomPrice && (
                <div>
                    {/* update priceCustom when user type in textInput */}
                    <TextField
                        id="outlined-basic"
                        label="Price Custom"
                        variant="outlined"
                        type="number"
                        value={priceCustom.value}
                        onChange={(e) => setPriceCustom({ value: e.target.value, error: false, helperText: "" })}
                        error={priceCustom.error}
                        helperText={priceCustom.helperText || "> 0.5 sats"}
                    />
                    <Button variant="contained" onClick={callInvoiceCustomPrice} disabled={priceCustom.value <= 0.5}>
                        Buy for {priceCustom.value} sats
                    </Button>
                </div>
            )) || (
                <Button variant="contained" onClick={() => ClickBuy(infosBuyItem)}>
                    Buy
                </Button>
            )}
        </div>
    );
}

export default BtnBuyItem;
