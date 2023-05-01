import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useLocation, useNavigate } from "react-router-dom";

import Login from "./Login";
import SignUp from "./Signup";
import "./Auth.css";

function Authentification() {
    const location = useLocation();
    const navigate = useNavigate();
    const [tabIndex, setTabIndex] = useState(location.pathname.includes("login") ? 0 : 1);

    useEffect(() => {
        setTabIndex(location.pathname.includes("login") ? 0 : 1);
    }, [location]);

    const handleTabChange = (event, newTabIndex) => {
        setTabIndex(newTabIndex);

        if (newTabIndex === 0) {
            navigate("/authentification/login");
        }
        if (newTabIndex === 1) {
            navigate("/authentification/signup");
        }
    };

    return (
        <div className="box-auth max-w-lg mx-auto bg-neutral-700 mt-8 p-4 rounded shadow-lg">
            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Tabs Login/SignUp">
                <Tab label="Login" />
                <Tab label="Sign Up" />
            </Tabs>
            {tabIndex === 0 && <Login />}
            {tabIndex === 1 && <SignUp />}
        </div>
    );
}

export default Authentification;
