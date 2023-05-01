import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PlayerAudio from "../PlayerAudio/PlayerAudio";
import Explorer from "./Explorer";
import MainSearch from "../Search/MainSearch";

// import CSS
import "./Explorer.css";

function MainExplorer() {
    const location = useLocation();
    const navigate = useNavigate();

    // list of albums to display in Explorer
    const [lstAlbums, setLstAlbums] = useState([]);

    // list of tracks to play in PlayerAudio
    const [lstTracksPlay, setLstTracksPlay] = useState([]);

    const tabPaths = ["new", "explorer-follows", "explorer-styles"];
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
        navigate(`/explorer/${newPath}`);
    };

    return (
        <div className="div_main_explorer">
            {/* Search Inputs */}
            {/* <MainSearch setLstAlbums={setLstAlbums} /> */}

            <div>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Tabs Explorer">
                    <Tab label="Latest Albums" />
                    <Tab label="Explorer Follows" />
                    <Tab label="Explorer Styles" />
                </Tabs>
                {tabIndex === 0 && (
                    // Explorer - Latest Albums
                    <Explorer
                        option={"Latest"}
                        lstAlbums={lstAlbums}
                        setLstAlbums={setLstAlbums}
                        setLstTracksPlay={setLstTracksPlay}
                    />
                )}
                {tabIndex === 1 && (
                    // Explorer - Albums in fonction of Follows of user
                    <Explorer
                        option={"Follows"}
                        lstAlbums={lstAlbums}
                        setLstAlbums={setLstAlbums}
                        setLstTracksPlay={setLstTracksPlay}
                    />
                )}
                {tabIndex === 2 && (
                    // Explorer - Albums in fonction of Styles in params Profile
                    <Explorer
                        option={"Styles"}
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
