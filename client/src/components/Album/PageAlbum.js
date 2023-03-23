import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../../Globals/GlobalVariables";
import { Button } from "@mui/material";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { AuthContext } from "../../Services/AuthContext";
import BtnFavoris from "../Favoris/BtnFavorisAlbum";
import BtnFollow from "../Bouttons/BtnFollow";
import { checkFollowed } from "../../Globals/FctsFollow";
import { getAxiosReq, getAxiosReqAuth } from "../../Services/AxiosGet";
import PlayerAudio from "../PlayerAudio/PlayerAudio";

function PageAlbum() {
    const { isLoggedIn, checkToken } = useContext(AuthContext);
    const { id } = useParams();
    const location = useLocation();
    const infosAlbum = location.state?.album;
    const [lstTracks, setLstTracks] = useState([]);
    const idUser = getLocalStorage("id");
    const [isFollowed, setIsFollowed] = useState(false);

    // get tracks
    useEffect(() => {
        checkToken();

        const data = { id: id };
        const response = getAxiosReq("/getTracks", data);
        response.then((data) => {
            setLstTracks(data);
        });
    }, [checkToken]);

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

    const ClickBuyAlbum = async (idAlbum, idTrack, idTrackAlbum, price) => {
        // create const data with infosAlbum
        const data = {
            idUser: idUser,
            idAlbum: idAlbum,
            idTrack: idTrack,
            idTrackAlbum: idTrackAlbum,
            price: price,
        };

        // call /buyAlbum with axios post
        axios
            .post(backendUrl + "/buyAlbum", data)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // create a map to display all tracks
    const LstDisplayTracks = lstTracks.map((track, key) => {
        return (
            <>
                <div className="card" key={track.t_id}>
                    <div className="card-body" style={{ display: "flex" }}>
                        <h5 className="card-title">{track.t_title}</h5>
                        <p className="card-text">{track.t_artist}</p>
                        <p className="card-text">{track.t_price}</p>
                        <p className="card-text">{track.t_date_release}</p>
                        <p className="card-text">{track.t_nb_listen}</p>
                        <p className="card-text">{track.t_lyrics}</p>
                        <audio controls>
                            <source
                                src={
                                    "https://d3s5ffas0ydxtp.cloudfront.net/" +
                                    track.t_file_path +
                                    "/" +
                                    track.t_file_name_mp3
                                }
                                type="audio/mpeg"
                            />
                        </audio>
                        {isLoggedIn && (
                            <>
                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        ClickBuyAlbum(
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
                src={
                    "https://d3s5ffas0ydxtp.cloudfront.net/" +
                    infosAlbum.a_cover_path +
                    "/" +
                    infosAlbum.a_cover
                }
                className="card-img-top"
                alt="Cover Album"
                style={{ width: "100px", height: "100px" }}
            />
            <h3>Price : {infosAlbum.a_price}</h3>
            {isLoggedIn && (
                <>
                    <Button
                        variant="contained"
                        onClick={() =>
                            ClickBuyAlbum(infosAlbum.a_id, null, null, infosAlbum.a_price)
                        }
                    >
                        Buy
                    </Button>
                    <BtnFavoris idUser={idUser} isLoggedIn={isLoggedIn} idAlbum={infosAlbum.a_id} />
                </>
            )}
            <h4>Id : {infosAlbum.a_id}</h4>
            <p>descr : {infosAlbum.a_description}</p>
            <p>Styles : {infosAlbum.a_styles}</p>
            {/* <PlayerAudio playList={playList} /> */}

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
