import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { AuthContext } from "../../Services/AuthContext";
import BtnFavorisAlbum from "../Favoris/BtnFavorisAlbum";
import BtnFollow from "../Bouttons/BtnFollow";
import BuyTrack from "../Buy/BuyTrack";
import BuyAlbum from "../Buy/BuyAlbum";
import { getAxiosReq, getAxiosReqAuth } from "../../Services/AxiosGet";
import PlayerAudio from "../PlayerAudio/PlayerAudio";
import { postAxiosReqAuth } from "../../Services/AxiosPost";
import QRCode from "qrcode.react";

function PageAlbum() {
    // nfos User
    const { isLoggedIn, checkToken } = useContext(AuthContext);
    const idUser = getLocalStorage("id");

    // get infos Album from params url
    const location = useLocation();
    const infosAlbum = location.state?.album;
    console.log("PageAlbum -> infosAlbum", infosAlbum);

    const [lstTracks, setLstTracks] = useState([]);
    const [lstStyles, setLstStyles] = useState([]);
    const [topAlbumBuy, setTopAlbumBuy] = useState(false);

    const [infosInvoice, setInfosInvoice] = useState({
        payementHash: "",
        payementRequest: "",
    });

    // get tracks
    useEffect(() => {
        const fetchData = async () => {
            await checkToken();
            const token = getLocalStorage("token");
            const data = { id: infosAlbum.a_id, idUser: idUser };

            try {
                const response = isLoggedIn
                    ? await getAxiosReqAuth("/getTracksAuth", data, token)
                    : await getAxiosReq("/getTracks", data);

                // update lstTracks
                setLstTracks(response);
                setTopAlbumBuy(response[0].top_sale_album);

                // update lstStyles
                const lstStyles = response[0].styles.map((style, key) => {
                    return (
                        <span key={key} className="">
                            {style.gm_name_genre} --
                        </span>
                    );
                });
                setLstStyles(lstStyles);
            } catch (error) {
                console.log("error", error);
            }
        };
        fetchData();
    }, []);

    const verifyInvoice = async (idAlbum, idTrack, idTrackAlbum, price, invoiceKey, payementHash) => {
        // create const data with infosAlbum
        const data = {
            invoiceKey: invoiceKey,
            payementHash: payementHash,
        };

        console.log("data", data);

        console.log("PageAlbum -> /verifyInvoice");
        // Set up a loop that will execute the API call every 10 seconds
        const intervalId = setInterval(async () => {
            try {
                const response = await getAxiosReq("/verifyInvoice", data);
                console.log("response", response);
                if (response.success) {
                    console.log("Success! Response:", response);
                    clearInterval(intervalId); // Stop the loop.
                    // AddAlbumToSales(idAlbum, idTrack, idTrackAlbum, price, invoiceKey, payementHash);
                    // AddTrackToSales(idAlbum, idTrack, idTrackAlbum, price, invoiceKey, payementHash);
                }
            } catch (error) {
                console.log("error", error);
            }
        }, 10000); // 10 seconds
    };

    // create a map to display all tracks
    const LstDisplayTracks = lstTracks.map((track, key) => {
        return (
            <>
                <div className="card" key={track.t_id}>
                    <div className="card-body" style={{ display: "flex" }}>
                        <h5 className="card-title">{track.t_title}</h5>
                        {/* <p className="card-text">{track.t_artist}</p> */}
                        <p className="card-text">{track.t_price}</p>
                        {/* <p className="card-text">{track.t_date_release}</p>
                        <p className="card-text">{track.t_nb_listen}</p>
                        <p className="card-text">{track.t_lyrics}</p> */}

                        {isLoggedIn && !track.top_sale_track && !track.top_sale_album && (
                            <>
                                {/* <Button
                                    variant="contained"
                                    onClick={() =>
                                        ClickBuyTrack(
                                            infosAlbum.a_id,
                                            track.t_id,
                                            track.t_id_album_track,
                                            track.t_price
                                        )
                                    }
                                >
                                    Buy
                                </Button> */}
                                <BuyTrack
                                    idAlbum={infosAlbum.a_id}
                                    idTrack={track.t_id}
                                    idTrackAlbum={track.t_id_album_track}
                                    price={track.t_price}
                                    verifyInvoice={verifyInvoice}
                                />
                            </>
                        )}
                    </div>
                </div>
            </>
        );
    });

    console.log("lstTracks", lstTracks);

    return (
        <div>
            {/* if infosInvoice.payment_request is not empty, display the payment request */}
            {infosInvoice.payementRequest && (
                <div>
                    <QRCode
                        value={infosInvoice.payementRequest}
                        width="1000"
                        height="1000"
                        includeMargin={true}
                        level="L"
                        renderAs="canvas"
                    />
                    <p>Send {infosAlbum.a_price} satoshis to the address above</p>
                </div>
            )}
            <h1>Album : {infosAlbum.a_title}</h1>
            <h2>Artist : {infosAlbum.a_artist}</h2>
            <BtnFollow
                idUser={idUser}
                isLoggedIn={isLoggedIn}
                idUserFollow={infosAlbum.a_id_user}
                isFollowedProp={infosAlbum.top_follow_artist}
            />
            <img
                src={"https://d3s5ffas0ydxtp.cloudfront.net/" + infosAlbum.a_cover_path + "/" + infosAlbum.a_cover}
                className="card-img-top"
                alt="Cover Album"
                style={{ width: "100px", height: "100px" }}
            />
            <h3>Price : {infosAlbum.a_price}</h3>
            {isLoggedIn && !topAlbumBuy && (
                <>
                    {/* <Button
                        variant="contained"
                        onClick={() => ClickBuyAlbum(infosAlbum.a_id, null, null, infosAlbum.a_price)}
                    >
                        Buy
                    </Button> */}
                    <BuyAlbum
                        idAlbum={infosAlbum.a_id}
                        idTrack={null}
                        idTrackAlbum={null}
                        price={infosAlbum.a_price}
                        verifyInvoice={verifyInvoice}
                    />

                    <BtnFavorisAlbum idUser={idUser} idAlbum={infosAlbum.a_id} topFav={infosAlbum.top_favoris_album} />
                </>
            )}
            <h4>Id : {infosAlbum.a_id}</h4>
            <p>descr : {infosAlbum.a_description}</p>
            {/* <p>Styles : {infosAlbum.a_styles}</p> */}
            <p>Styles : {lstStyles}</p>

            {lstTracks.length > 0 && <PlayerAudio playlist={lstTracks} />}

            <br></br>
            <br></br>

            {LstDisplayTracks}
            <br></br>
            <br></br>
        </div>
    );
}

export default PageAlbum;
