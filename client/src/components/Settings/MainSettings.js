import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../Services/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// components
import ParamProfile from "../Settings/ParamProfile";



function MainSettings() {
    const location = useLocation();
    const navigate = useNavigate();
    const { username } = useContext(AuthContext);

    const tabPaths = ["settings Profile", "settings App"];
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
                <Tab label="Settings Profile" />
                <Tab label="Settings App" />
            </Tabs>
            {tabIndex === 0 && <ParamProfile />}
            {/* {tabIndex === 1 && <ParamProfile />} */}
        </div>
    );
}

export default MainSettings;