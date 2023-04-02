import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../../Globals/GlobalVariables";
import { Button } from "@mui/material";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { AuthContext } from "../../Services/AuthContext";
import BtnFavorisAlbum from "../Favoris/BtnFavorisAlbum";
import BtnFollow from "../Bouttons/BtnFollow";
import { checkFollowed } from "../../Globals/FctsFollow";
import { getAxiosReq, getAxiosReqAuth } from "../../Services/AxiosGet";
import PlayerAudio from "../PlayerAudio/PlayerAudio";
import { postAxiosReqAuth } from "../../Services/AxiosPost";

function PageAlbum() {
    const { isLoggedIn, checkToken } = useContext(AuthContext);
    const { id } = useParams();
    const location = useLocation();
    const infosAlbum = location.state?.album;
    const [lstTracks, setLstTracks] = useState([]);
    const idUser = getLocalStorage("id");
    const [isFollowed, setIsFollowed] = useState(false);
    const [lstStyles, setLstStyles] = useState([]);
    const [topAlbumBuy, setTopAlbumBuy] = useState(false);

    // get tracks
    useEffect(() => {
        // checkToken();

        // const token = getLocalStorage("token");
        // const data = { id: id, idUser: idUser };

        // const response = isLoggedIn ? getAxiosReqAuth("/getTracksAuth", data, token) : getAxiosReq("/getTracks", data);
        // response.then((res) => {
        //     setLstTracks(res);
        //     setTopAlbumBuy(res[0].top_sale_album);

        //     const lstStyles = res[0].styles.map((style, key) => {
        //         return (
        //             <span key={key} className="">
        //                 {style.gm_name_genre} --
        //             </span>
        //         );
        //     });
        //     setLstStyles(lstStyles);
        // });

        const fetchData = async () => {
            await checkToken();
            const token = getLocalStorage("token");
            const data = { id: id, idUser: idUser };

            try {
                const response = isLoggedIn
                    ? await getAxiosReqAuth("/getTracksAuth", data, token)
                    : await getAxiosReq("/getTracks", data);
                setLstTracks(response);
                setTopAlbumBuy(response[0].top_sale_album);

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

    // chack if user follow artist
    useEffect(() => {
        if (isLoggedIn && lstTracks.length > 0) {
            const token = getLocalStorage("token");

            const data = {
                idUser: idUser,
                idUserFollow: lstTracks[0].t_id_user,
            };

            const response = getAxiosReqAuth("/getFollowsByIdUser", data, token);
            response.then((data) => {
                setIsFollowed(checkFollowed(data, lstTracks[0].t_id_user));
            });
        }
    }, [lstTracks, isLoggedIn]);

    // buy Track
    const ClickBuyTrack = async (idAlbum, idTrack, idTrackAlbum, price) => {
        await checkToken();
        const token = getLocalStorage("token");

        // create const data with infosAlbum
        const data = {
            idUser: idUser,
            idAlbum: idAlbum,
            idTrack: idTrack,
            idTrackAlbum: idTrackAlbum,
            price: price,
        };

        if (isLoggedIn) {
            console.log("PageAlbum -> /buyTrack");
            try {
                const response = await postAxiosReqAuth("/buyTrack", data, token);
                console.log("response", response);
                if (response.succes) {
                    window.location.reload();
                }
            } catch (error) {
                console.log("error", error);
            }
        }
    };

    const ClickBuyAlbum = async (idAlbum, idTrack, idTrackAlbum, price) => {
        await checkToken();
        const token = getLocalStorage("token");

        // create const data with infosAlbum
        const data = {
            idUser: idUser,
            idAlbum: idAlbum,
            idTrack: idTrack,
            idTrackAlbum: idTrackAlbum,
            price: price,
        };

        if (isLoggedIn) {
            console.log("PageAlbum -> /buyAlbum");
            try {
                const response = await postAxiosReqAuth("/buyAlbum", data, token);
                if (response.data.succes) {
                    window.location.reload();
                }
            } catch (error) {
                console.log("error", error);
            }
        }
    };

    // create a map to display all tracks
    const LstDisplayTracks = lstTracks.map((track, key) => {
        console.log("track", track);
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
                                <Button
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
                                </Button>
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
            <h1>Album : {infosAlbum.a_title}</h1>
            <h2>Artist : {infosAlbum.a_artist}</h2>
            <BtnFollow
                idUser={idUser}
                isLoggedIn={isLoggedIn}
                idUserFollow={infosAlbum.a_id_user}
                isFollowedProp={isFollowed}
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
                    <Button
                        variant="contained"
                        onClick={() => ClickBuyAlbum(infosAlbum.a_id, null, null, infosAlbum.a_price)}
                    >
                        Buy
                    </Button>
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
