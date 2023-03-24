import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../Services/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// components
import UserWantlist from "./UserWantlist";
import UserCollections from "./UserCollections";
import UserMyAlbums from "./UserMyAlbums";
import UserMyFollows from "./UserMyFollows";
import MainSettings from "../Settings/MainSettings";
import PlayerAudio from "../PlayerAudio/PlayerAudio";

function MainUserProfile() {
    const location = useLocation();
    const navigate = useNavigate();
    const { username } = useContext(AuthContext);

    const [lstTracksPlay, setLstTracksPlay] = useState([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const tabPaths = ["collection", "wantlist", "myalbums", "myfollows", "Settings"];
    const [tabIndex, setTabIndex] = useState(() => {
        const index = tabPaths.findIndex((path) => location.pathname.includes(path));
        return index >= 0 ? index : 0;
    });

    useEffect(() => {
        const index = tabPaths.findIndex((path) => location.pathname.includes(path));
        if (index >= 0) {
            setTabIndex(index);
        }
    }, [location, tabPaths]);

    const handleTabChange = (event, newTabIndex) => {
        setTabIndex(newTabIndex);
        const newPath = tabPaths[newTabIndex];
        navigate(`/profile/${username}/${newPath}`);
    };

    // const lstTracksPlay = [
    //     {
    //         t_id_album_track: 1,
    //         t_title: "track 01",
    //         t_file_path: "uploads/4/1/tracks",
    //         t_file_name_mp3: "7a0f3779-lfg0nrfbk7.mp3",
    //     },
    //     {
    //         t_id_album_track: 2,
    //         t_title: "track 02",
    //         t_file_path: "uploads/4/1/tracks",
    //         t_file_name_mp3: "48ae0eb6-lfg0nslv3rp.mp3",
    //     },
    // ];

    return (
        <div>
            <div>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Tabs Login/SignUp">
                    <Tab label="My Collection" />
                    <Tab label="Wantlist" />
                    <Tab label="My Albums" />
                    <Tab label="My Follows" />
                    <Tab label="Settings" />
                </Tabs>
                {tabIndex === 0 && <UserCollections setLstTracksPlay={setLstTracksPlay} />}
                {tabIndex === 1 && <UserWantlist setLstTracksPlay={setLstTracksPlay} />}
                {tabIndex === 2 && <UserMyAlbums />}
                {tabIndex === 3 && <UserMyFollows />}
                {tabIndex === 4 && <MainSettings />}
            </div>

            <div>
                {/* PlayerAudio */}
                {lstTracksPlay.length > 0 && <PlayerAudio playlist={lstTracksPlay} songIndex={0} />}
            </div>
        </div>
    );
}

export default MainUserProfile;
