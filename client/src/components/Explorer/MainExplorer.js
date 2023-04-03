import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Services/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PlayerAudio from "../PlayerAudio/PlayerAudio";
import Explorer from "./Explorer";
import ExplorerFollows from "./ExplorerFollows";
import ExplorerStyles from "./ExplorerStyles";
import MainSearch from "../Search/MainSearch";

function MainExplorer() {
    const location = useLocation();
    const navigate = useNavigate();
    const { username } = useContext(AuthContext);

    // list of albums to display in Explorer
    const [lstAlbums, setLstAlbums] = useState([]);

    // list of tracks to play in PlayerAudio
    const [lstTracksPlay, setLstTracksPlay] = useState([]);

    const tabPaths = ["explorer", "explorer-follows", "explorer-styles"];
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

    return (
        <div>
            {/* Search Inputs */}
            <MainSearch setLstAlbums={setLstAlbums} />

            <div>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Tabs Explorer">
                    <Tab label="Explorer" />
                    <Tab label="Explorer Follows" />
                    <Tab label="Explorer Styles" />
                </Tabs>
                {tabIndex === 0 && (
                    <Explorer lstAlbums={lstAlbums} setLstAlbums={setLstAlbums} setLstTracksPlay={setLstTracksPlay} />
                )}
                {tabIndex === 1 && (
                    <ExplorerFollows
                        lstAlbums={lstAlbums}
                        setLstAlbums={setLstAlbums}
                        setLstTracksPlay={setLstTracksPlay}
                    />
                )}
                {tabIndex === 2 && (
                    <ExplorerStyles
                        lstAlbums={lstAlbums}
                        setLstAlbums={setLstAlbums}
                        setLstTracksPlay={setLstTracksPlay}
                    />
                )}
            </div>

            <div>
                {/* PlayerAudio */}
                {lstTracksPlay.length > 0 && <PlayerAudio playlist={lstTracksPlay} />}
            </div>
        </div>
    );
}

export default MainExplorer;
