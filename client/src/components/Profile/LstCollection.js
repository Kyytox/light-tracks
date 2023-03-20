import React from "react";
import { Link } from "react-router-dom";
import LinkNavUser from "../User/LinkNavUser";

function LstCollection({ idUser, isLoggedIn, lstAlbums }) {
    // create a map to display
    // lst albums is an array of objects
    const LstDisplayAlbums = lstAlbums.map((album, key) => {
        // const coverPath = backendUrl + "/" + "images/logo.png";
        const coverPath =
            "https://d3s5ffas0ydxtp.cloudfront.net/" + album.a_cover_path + "/" + album.a_cover;
        const location = {
            pathname: `/album/${album.a_id}`,
        };
        const stateLocation = { album: album };

        return (
            <>
                <nav id={"album-" + album.a_id} key={album.a_id}>
                    {/* Artist */}
                    <nav id={"artist-" + album.a_id_user} key={album.a_id_user}>
                        <LinkNavUser data={album} />
                    </nav>

                    {/* Album */}
                    <Link to={location} state={stateLocation}>
                        <div className="card">
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
                                <p className="card-text">{album.a_date_release}</p>
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

export default LstCollection;
