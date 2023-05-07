import React from "react";
import { Link } from "react-router-dom";
import BtnFavorisAlbum from "../Favoris/BtnFavorisAlbum";
import BtnFollow from "../Bouttons/BtnFollow";
import LinkNavUser from "../User/LinkNavUser";
import { formatDate } from "../../Globals/GlobalFunctions";

// MUI
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

//import CSS
import "./LstAlbums.css";

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
            <Grid item xs={1} sm={2} md={3} lg={4} key={key}>
                {/* <Card sx={{ maxWidth: { xs: 345, sm: 345, md: 345, lg: 345 } }}> */}
                <Card>
                    <nav id={"album-" + album.a_id} key={album.a_id}>
                        <CardHeader
                            avatar={
                                <nav id={"artist-" + album.a_id_user} key={album.a_id_user}>
                                    <LinkNavUser data={album.profile_artist[0]} />
                                </nav>
                            }
                            action={
                                <BtnFollow
                                    idUser={idUser}
                                    isLoggedIn={isLoggedIn}
                                    idUserFollow={album.a_id_user}
                                    isFollowedProp={album.top_follow_artist}
                                />
                            }
                            sx={{ padding: "10px", marginBottom: "8px" }}
                        />

                        <CardMedia sx={{ height: 150 }} image={coverPath} title="Cover Album" />
                        <CardContent>
                            {/* Album */}
                            <Link to={locationAlbum} state={stateLocationAlbum}>
                                <div className="flex flex-col">
                                    <h3 className="card-title">{album.a_title}-- </h3>
                                    <p className="card-text">{album.a_price}-- </p>
                                    {/* <p className="card-text">{album.a_date_release} -- </p> */}
                                    <p className="card-text">{formatDate(album.a_date_create)} -- </p>
                                    {/* <p className="card-text">{album.a_styles}-- </p> */}
                                    <p className="card-text">{lstStyles}-- </p>
                                    <p className="card-text">{album.a_description}-- </p>
                                </div>
                            </Link>
                        </CardContent>
                    </nav>
                    <CardActions>
                        {/* Favoris */}
                        {isLoggedIn && (
                            <>
                                {album.top_sale_album ? (
                                    <p>Album bought</p>
                                ) : (
                                    <BtnFavorisAlbum
                                        idUser={idUser}
                                        idAlbum={album.a_id}
                                        topFav={album.top_favoris_album}
                                    />
                                )}
                            </>
                        )}
                        <button type="button" onClick={() => changeIdAlbumPlay(album.a_id)}>
                            Play
                        </button>
                    </CardActions>
                </Card>
            </Grid>
        );
    });

    return (
        <div className="flex flex-wrap">
            {/* <div className="grid-x grid-margin-y grid-margin-x">{LstDisplayAlbums}</div> */}
            <Grid container spacing={{ xs: 1, md: 4, lg: 7 }} columns={{ xs: 1, sm: 4, md: 8, lg: 12 }}>
                {LstDisplayAlbums}
            </Grid>
        </div>
    );
}

export default LstAlbums;

// <nav id={"album-" + album.a_id} key={album.a_id}>
//     {/* Artist */}
//     <nav id={"artist-" + album.a_id_user} key={album.a_id_user}>
//         <LinkNavUser data={album.profile_artist[0]} />
//     </nav>
//     {/* Follow */}
//     <BtnFollow
//         idUser={idUser}
//         isLoggedIn={isLoggedIn}
//         idUserFollow={album.a_id_user}
//         isFollowedProp={album.top_follow_artist}
//     />
//     {/* Favoris */}
//     {isLoggedIn && (
//         <>
//             {album.top_sale_album ? (
//                 <p>Album bought</p>
//             ) : (
//                 <BtnFavorisAlbum
//                     idUser={idUser}
//                     idAlbum={album.a_id}
//                     topFav={album.top_favoris_album}
//                 />
//             )}
//         </>
//     )}

//     <button type="button" onClick={() => changeIdAlbumPlay(album.a_id)}>
//         Play
//     </button>
//     {/* Album */}
//     <Link to={locationAlbum} state={stateLocationAlbum}>
//         <div className="card" style={{ display: "flex" }}>
//             <img
//                 src={coverPath}
//                 className="card-img-top"
//                 alt="Cover Album"
//                 style={{ width: "100px", height: "100px" }}
//             />
//             <div className="card-body" style={{ display: "flex" }}>
//                 <h5 className="card-title">{album.a_title}-- </h5>
//                 <p className="card-text">{album.a_artist}-- </p>
//                 <p className="card-text">{album.a_price}-- </p>
//                 {/* <p className="card-text">{album.a_date_release} -- </p> */}
//                 <p className="card-text">{formatDate(album.a_date_create)} -- </p>
//                 {/* <p className="card-text">{album.a_styles}-- </p> */}
//                 <p className="card-text">{lstStyles}-- </p>
//                 <p className="card-text">{album.a_description}-- </p>
//             </div>
//         </div>
//     </Link>
// </nav>;
