import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";

// functions
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { AuthContext } from "../../Services/AuthContext";
import { getAxiosReq, getAxiosReqAuth } from "../../Services/AxiosGet";

// Button Components
import BtnFavorisAlbum from "../Favoris/BtnFavorisAlbum";
import BtnFollow from "../Bouttons/BtnFollow";
import BtnBuyItem from "../Bouttons/BtnBuy";
import BtnDownload from "../DownloadFiles/BtnDownload";

// Player Components
import PlayerAudio from "../PlayerAudio/PlayerAudio";

// QrCode Components
import QrCode from "../QrCode/QrCode";

function PageAlbum() {
    // nfos User
    const { isLoggedIn, checkToken } = useContext(AuthContext);
    const idUser = getLocalStorage("id");

    // get infos Album from params url
    const location = useLocation();
    const infosAlbum = location.state?.album;
    console.log("PageAlbum -> infosAlbum", infosAlbum);

    // states
    const [lstTracks, setLstTracks] = useState([]);
    const [lstStyles, setLstStyles] = useState([]);
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

    // create a map to display all tracks
    const LstDisplayTracks = lstTracks.map((track, key) => {
        console.log("track", track);
        const infosBuyItem = {
            idAlbum: infosAlbum.a_id,
            idTrack: track.t_id,
            idTrackAlbum: track.t_id_album_track,
            price: track.t_price,
        };

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

                        {isLoggedIn && !track.top_sale_track && !track.top_sale_album && track.a_top_price && (
                            <>
                                <BtnBuyItem
                                    item="Track"
                                    infosBuyItem={infosBuyItem}
                                    setInfosInvoice={setInfosInvoice}
                                />
                            </>
                        )}
                    </div>
                </div>
            </>
        );
    });

    return (
        <div>
            {/* display QrCode if payementRequest */}
            {infosInvoice.payementRequest && <QrCode infosInvoice={infosInvoice} />}

            {/* display infos Album */}
            <h1>Album : {infosAlbum.a_title}</h1>
            <h2>Artist : {infosAlbum.a_artist}</h2>

            {/* display BtnFollow if user is logged in */}
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
            {isLoggedIn && (
                <>
                    {infosAlbum.top_sale_album || infosAlbum.a_top_free ? (
                        <>{infosAlbum.a_top_free && <BtnDownload idAlbum={infosAlbum.a_id} />}</>
                    ) : (
                        <>
                            <BtnBuyItem
                                item="Album"
                                infosBuyItem={{
                                    idAlbum: infosAlbum.a_id,
                                    idTrack: null,
                                    idTrackAlbum: null,
                                    price: infosAlbum.a_price,
                                }}
                                setInfosInvoice={setInfosInvoice}
                            />
                            <BtnFavorisAlbum
                                idUser={idUser}
                                idAlbum={infosAlbum.a_id}
                                topFav={infosAlbum.top_favoris_album}
                            />
                        </>
                    )}
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
