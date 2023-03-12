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



function MainUserProfile() {
    const location = useLocation();
    const navigate = useNavigate();
    const { username } = useContext(AuthContext);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const tabPaths = ["collection", "wantlist", "myalbums", "myfollows"];
    const [tabIndex, setTabIndex] = useState(() => {
      const index = tabPaths.findIndex(path => location.pathname.includes(path));
      return index >= 0 ? index : 0;
    });
    
    useEffect(() => {
      const index = tabPaths.findIndex(path => location.pathname.includes(path));
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
            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Tabs Login/SignUp">
                <Tab label="My Collection" />
                <Tab label="Wantlist" />
                <Tab label="My Albums" />
                <Tab label="My Follows" />
            </Tabs>
            {tabIndex === 0 && <UserCollections />}
            {tabIndex === 1 && <UserWantlist />}
            {tabIndex === 2 && <UserMyAlbums />}
            {tabIndex === 3 && <UserMyFollows />}
        </div>
    );
}

export default MainUserProfile;
