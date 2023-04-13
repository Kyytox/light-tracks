import React from "react";
import { Link } from "react-router-dom";
import BtnFavorisAlbum from "../Favoris/BtnFavorisAlbum";
import BtnFollow from "../Bouttons/BtnFollow";
import LinkNavUser from "../User/LinkNavUser";
import { formatDate } from "../../Globals/GlobalFunctions";

function LstAlbums({ idUser, isLoggedIn, lstAlbums, changeIdAlbumPlay }) {
    // create a map to display
    // lst albums is an array of objects
    const LstDisplayAlbums = lstAlbums.map((album, key) => {
        const coverPath = "https://d3s5ffas0ydxtp.cloudfront.net/" + album.a_cover_path + "/" + album.a_cover;

        //
        // Location Album
        const locationAlbum = {
            pathname: `/album/${album.a_id}`,
        };
        const stateLocationAlbum = { album: album };

        //
        // retrieve list of gm_name_genre in album.styles
        const lstStyles = album.styles.map((style, key) => {
            return (
                <span key={key} className="badge badge-pill badge-primary">
                    {style.gm_name_genre}
                </span>
            );
        });

        return (
            <div key={key}>
                <nav id={"album-" + album.a_id} key={album.a_id}>
                    {/* Artist */}
                    <nav id={"artist-" + album.a_id_user} key={album.a_id_user}>
                        <LinkNavUser data={album.profile_artist[0]} />
                    </nav>

                    {/* Follow */}
                    <BtnFollow
                        idUser={idUser}
                        isLoggedIn={isLoggedIn}
                        idUserFollow={album.a_id_user}
                        isFollowedProp={album.top_follow_artist}
                    />

                    {/* Favoris */}
                    {isLoggedIn && (
                        <BtnFavorisAlbum idUser={idUser} idAlbum={album.a_id} topFav={album.top_favoris_album} />
                    )}

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
                                <h5 className="card-title">{album.a_title}-- </h5>
                                <p className="card-text">{album.a_artist}-- </p>
                                <p className="card-text">{album.a_price}-- </p>
                                {/* <p className="card-text">{album.a_date_release} -- </p> */}
                                <p className="card-text">{formatDate(album.a_date_create)} -- </p>
                                {/* <p className="card-text">{album.a_styles}-- </p> */}
                                <p className="card-text">{lstStyles}-- </p>
                                <p className="card-text">{album.a_description}-- </p>
                            </div>
                        </div>
                    </Link>
                </nav>
            </div>
        );
    });

    return (
        <div>
            <div className="row">{LstDisplayAlbums}</div>
        </div>
    );
}

export default LstAlbums;
