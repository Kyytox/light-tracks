import React from "react";
import { NavLink } from "react-router-dom";
import Button from "@mui/material/Button";

const NoPage = () => {
    return (
        <div>
            <h1>Error 404: Page not found</h1>
            <p>The page you requested could not be found.</p>
            <Button variant="contained" color="primary">
                <NavLink to="/">Go back to the homepage</NavLink>
            </Button>
        </div>
    );
};

export default NoPage;
