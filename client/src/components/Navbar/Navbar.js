import React, { useContext, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../Services/AuthContext";

// import MainSearch
import MainSearch from "../Search/MainSearch";
import MainSearchNew from "../Search/MainSearchNew";

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

    const [showSearchBar, setShowSearchBar] = useState(false);
    const mainSearchRef = useRef(null);

    const toggleSearchBar = () => {
        setShowSearchBar(!showSearchBar);
    };

    return (
        <div className="navbar flex flex-nowrap items-center justify-between px-2 text-white mt-1">
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

            {/* Search bar */}

            <MainSearchNew />

            {/* <div>
                <button onClick={toggleSearchBar}>Cliquez ici</button>
                <div
                    style={{
                        position: showSearchBar ? "fixed" : "absolute",
                        // backgroundColor: "white",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        top: showSearchBar ? "0px" : "-500px",
                        left: "0",
                        height: "100%",
                        width: "100%",
                        height: showSearchBar ? "100%" : "0",
                        transition: "top 0.5s ease-in-out, height 0.5s ease-in-out",
                        backgroundColor: "rgba(0,0,0,0.35)",
                        backdropFilter: "blur(1px)",
                        zIndex: "1000",
                    }}
                >
                    <button onClick={toggleSearchBar}>X</button>
                    <MainSearch showSearchBar={showSearchBar} ref={mainSearchRef} />
                </div>
            </div> */}

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
