import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../Services/AuthContext";

// Navbar component
// This component is the navbar of the website
// It contains the logo and the links to the different pages
// AuthContext is used to check if the user is logged in or not
// If the user is logged in, the links to the login and signup pages are replaced by a logout button
// If the user is logged in, the link to the page to add music is displayed

const Navbar = () => {
    const { isLoggedIn, handleLogout, username } = useContext(AuthContext);

    return (
        <div className="navbar">
            <div className="navbar__logo">
                <h1>Light Tracks</h1>
            </div>
            <div className="navbar__links">
                <nav>
                    <ul>
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
                                <li>
                                    <NavLink to="/CreateAlbum">Add Music</NavLink>
                                </li>
                            </>
                        )}
                        {isLoggedIn ? (
                            <li>
                                <button onClick={handleLogout}>Logout</button>
                            </li>
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
                </nav>
            </div>
        </div>
    );
};

export default Navbar;
