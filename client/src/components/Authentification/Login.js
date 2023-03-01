// lib React
import React, { useState, useContext } from "react";
import { AuthContext } from "../../Services/AuthContext";

// lib Material UI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// lib Components en global variables en functions
import { backendUrl } from "../../Globals/GlobalVariables";
import { setLocalStorage } from "../../Globals/GlobalFunctions";
import Success from "./Success";

import axios from "axios";

function Login() {
    const { handleLogin } = useContext(AuthContext);
    const [values, setValues] = useState({
        username: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        username: false,
        password: false,
    });
    const [helperText, setHelperText] = useState({
        username: "",
        password: "",
    });

    const [succesConnect, setSuccesConnect] = useState({
        success: false,
        text: "",
    });

    const handleChange = (field, value) => {
        if (field === "username") {
            setValues({ ...values, [field]: value });
        } else if (field === "password") {
            setValues({ ...values, [field]: value });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            username: values.username,
            password: values.password,
        };

        // call /login for check username
        axios
            .post(backendUrl + "/login", data)
            .then((response) => {
                if (response.data.errUsr) {
                    // err user not exist
                    setErrors({ ...errors, ["username"]: true });
                    setHelperText({ ...helperText, ["username"]: response.data.errUsr });
                } else if (response.data.errMdp) {
                    // err user not exist
                    setErrors({ ...errors, ["password"]: true, ["username"]: false });
                    setHelperText({ ...helperText, ["password"]: response.data.errMdp, ["username"]: "" });
                } else {
                    // connection Succes
                    setSuccesConnect({ ...succesConnect, ["success"]: true, ["text"]: response.data.succes, ["token"]: response.data.token });
                    setLocalStorage("token", response.data.token);
                    setLocalStorage("id", response.data.id);
                    setLocalStorage("username", response.data.username);
                    setErrors({ ...errors, ["username"]: false, ["password"]: false });
                    setHelperText({ ...helperText, ["username"]: "", ["password"]: "" });
                    handleLogin();
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div>
            {succesConnect.success ? (
                <Success text={succesConnect.text} />
            ) : (
                <form onSubmit={handleSubmit}>
                    <TextField
                        required
                        error={errors.username}
                        id="outlined-error-helper-text"
                        label="Name User"
                        helperText={helperText.username}
                        onChange={(event) => handleChange("username", event.target.value)}
                    />
                    <TextField
                        required
                        error={errors.password}
                        id="outlined-required"
                        label="Password"
                        type="password"
                        helperText={helperText.password}
                        onChange={(event) => handleChange("password", event.target.value)}
                    />
                    <Button type="submit" variant="contained">
                        Login
                    </Button>
                </form>
            )}
        </div>
    );
}

export default Login;
