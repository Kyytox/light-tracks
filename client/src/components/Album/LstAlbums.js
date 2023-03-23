import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BtnFavorisAlbum from "../Favoris/BtnFavorisAlbum";
import BtnFollow from "../Bouttons/BtnFollow";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { checkFollowed } from "../../Globals/FctsFollow";
import LinkNavUser from "../User/LinkNavUser";
import { getAxiosReqAuth } from "../../Services/AxiosGet";

function LstAlbums({ idUser, isLoggedIn, lstAlbums, changeIdAlbumPlay }) {
    const [lstFollows, setLstFollows] = useState([]);

    console.log("LstAlbums -- lstAlbums : ", lstAlbums);

    useEffect(() => {
        if (isLoggedIn) {
            const token = getLocalStorage("token");

            // get follows
            const data = { idUser: idUser };
            const response = getAxiosReqAuth("/getFollows", data, token);
            response.then((data) => {
                setLstFollows(data);
            });
        }
    }, [isLoggedIn, idUser]);

    // create a map to display
    // lst albums is an array of objects
    const LstDisplayAlbums = lstAlbums.map((album, key) => {
        // const coverPath = backendUrl + "/" + "images/logo.png";
        const coverPath =
            "https://d3s5ffas0ydxtp.cloudfront.net/" + album.a_cover_path + "/" + album.a_cover;

        //
        // Location Album
        const locationAlbum = {
            pathname: `/album/${album.a_id}`,
        };
        const stateLocationAlbum = { album: album };

        //
        // Follow
        var isFollowed = false;

        if (isLoggedIn) {
            // check if artist is followed by user
            isFollowed = checkFollowed(lstFollows, album.a_id_user);
        }

        return (
            <>
                <nav id={"album-" + album.a_id} key={album.a_id}>
                    {/* Artist */}
                    <nav id={"artist-" + album.a_id_user} key={album.a_id_user}>
                        <LinkNavUser data={album} />
                    </nav>

                    {/* Follow */}
                    <BtnFollow
                        idUser={idUser}
                        isLoggedIn={isLoggedIn}
                        idUserFollow={album.a_id_user}
                        isFollowedProp={isFollowed}
                    />

                    {/* Favoris */}
                    <BtnFavorisAlbum idUser={idUser} isLoggedIn={isLoggedIn} idAlbum={album.a_id} />

                    <button type="button" onClick={() => changeIdAlbumPlay(album.a_id)}>
                        Play
                    </button>

                    {/* Album */}
                    <Link to={locationAlbum} state={stateLocationAlbum}>
                        <div className="card" style={{ display: "flex" }}>
                            <img
                                src={coverPath}
                                className="card-img-top"
                                alt="Cover Album"
                                style={{ width: "100px", height: "100px" }}
                            />
                            <div className="card-body" style={{ display: "flex" }}>
                                <h5 className="card-title">{album.a_title}</h5>
                                <p className="card-text">{album.a_artist}</p>
                                <p className="card-text">{album.a_price}</p>
                                {/* <p className="card-text">{album.a_date_release}</p> */}
                                <p className="card-text">{album.a_styles}</p>
                                <p className="card-text">{album.a_description}</p>
                            </div>
                        </div>
                    </Link>
                </nav>
            </>
        );
    });

    return (
        <div>
            <div className="row">{LstDisplayAlbums}</div>
        </div>
    );
}

export default LstAlbums;
