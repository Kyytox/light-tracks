import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeLocalStorage, getLocalStorage, setLocalStorage, verifyUser } from "../Globals/GlobalFunctions";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return getLocalStorage("isLoggedIn") === "true" ? true : false;
    });

    const tokenJWT = getLocalStorage("token");
    const idUser = getLocalStorage("id");
    const username = getLocalStorage("username");

    // User is logged
    const handleLogin = () => {
        setIsLoggedIn(true);
        setLocalStorage("isLoggedIn", true);
        // navigate("/");
    };

    // User is disconnected
    const handleLogout = () => {
        setIsLoggedIn(false);
        removeAllLocalStorage();
        navigate("/");
    };

    const removeAllLocalStorage = () => {
        removeLocalStorage("token");
        removeLocalStorage("id");
        removeLocalStorage("isLoggedIn");
        removeLocalStorage("username");
    };

    const checkToken = async () => {
        if (!tokenJWT) {
            console.log("no Jwt");
        } else {
            const data = {
                token: tokenJWT,
            };

            try {
                const response = await verifyUser(data);
                if (response === 200) {
                    console.log("Valid token");
                    handleLogin();
                } else {
                    console.log("Invalid token");
                    removeAllLocalStorage();
                    handleLogout();
                    // window.location.reload();
                    // Afficher un message d'erreur ou rediriger vers une page de connexion
                }
            } catch (error) {
                console.log("Error verifying token:", error);
                removeAllLocalStorage();
                handleLogout();
                // window.location.reload();
                // Afficher un message d'erreur ou rediriger vers une page de connexion
            }
        }
    };

    return <AuthContext.Provider value={{ idUser, username, isLoggedIn, handleLogin, handleLogout, checkToken }}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
