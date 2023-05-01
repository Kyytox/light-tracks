import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../Services/AuthContext";

// import CSS
import "./Navbar.css";

import logo from "../../logo.png";

// Navbar component
// This component is the navbar of the website
// It contains the logo and the links to the different pages
// AuthContext is used to check if the user is logged in or not
// If the user is logged in, the links to the login and signup pages are replaced by a logout button
// If the user is logged in, the link to the page to add music is displayed

const Navbar = () => {
    const { isLoggedIn, handleLogout, username } = useContext(AuthContext);

    return (
        <div className="navbar flex flex-nowrap items-center justify-between px-2 text-white">
            <ul className="menu-sections flex flex-nowrap items-center space-x-8">
                <li className="logo">
                    <img src={logo} alt="logo" style={{ width: "50px", height: "50px" }} />
                </li>
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/explorer/new">Explorer</NavLink>
                </li>
                {isLoggedIn && (
                    <>
                        <li>
                            <NavLink to={`/profile/${username}/collection`}>Collection</NavLink>
                        </li>
                        <li>
                            <NavLink to={`/profile/${username}/wantlist`}>Wantlist</NavLink>
                        </li>
                    </>
                )}
            </ul>

            <ul className="menu-settings flex flex-nowrap space-x-4">
                {isLoggedIn ? (
                    <>
                        <li>
                            <a href="/#" onClick={handleLogout}>
                                Logout
                            </a>
                        </li>
                        <li>
                            <NavLink to="/CreateAlbum">Add Music</NavLink>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <NavLink to="/authentification/login">Login</NavLink>
                        </li>
                        <li>
                            <NavLink to="/authentification/singup">Signup</NavLink>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default Navbar;
