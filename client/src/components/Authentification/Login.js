// lib React
import React, { useState, useContext } from "react";
import { AuthContext } from "../../Services/AuthContext";

// lib Material UI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// lib Components en global variables en functions
import { setLocalStorage } from "../../Globals/GlobalFunctions";
import { postAxiosReq } from "../../Services/AxiosPost";
import Success from "./Success";

function Login() {
    const { handleLogin } = useContext(AuthContext);

    const [values, setValues] = useState({
        username: { value: "", error: false, helperText: "" },
        password: { value: "", error: false, helperText: "" },
    });

    const [succesConnect, setSuccesConnect] = useState({
        success: false,
        text: "",
    });

    const handleChange = (field, value) => {
        if (field === "username") {
            setValues({ ...values, [field]: { value: value, error: false, helperText: "" } });
        } else if (field === "password") {
            setValues({ ...values, [field]: { value: value, error: false, helperText: "" } });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            username: values.username.value,
            password: values.password.value,
        };

        // call /login for check username
        console.log("Login -- /login");
        const response = postAxiosReq("/login", data);
        response.then((data) => {
            if (data.errUsr) {
                // err user not exist
                setValues({
                    ...values,
                    username: {
                        value: values.username.value,
                        error: true,
                        helperText: data.errUsr,
                    },
                });
            } else if (data.errMdp) {
                // err user not exist
                setValues({
                    ...values,
                    password: {
                        value: values.password.value,
                        error: true,
                        helperText: data.errMdp,
                    },
                });
            } else {
                // connection Succes
                setSuccesConnect({
                    ...succesConnect,
                    success: true,
                    text: data.succes,
                    token: data.token,
                });
                setLocalStorage("token", data.token);
                setLocalStorage("id", data.id);
                setLocalStorage("username", data.username);
                setLocalStorage("code_currency", data.code_currency);
                setValues({
                    ...values,
                    username: { value: values.username.value, error: false, helperText: "" },
                    password: { value: values.password.value, error: false, helperText: "" },
                });
                handleLogin();
            }
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
                        error={values.username.error}
                        id="outlined-error-helper-text"
                        label="Name User"
                        helperText={values.username.helperText}
                        onChange={(event) => handleChange("username", event.target.value)}
                    />
                    <TextField
                        required
                        error={values.password.error}
                        id="outlined-required"
                        label="Password"
                        type="password"
                        helperText={values.password.helperText}
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
