import React, { useState, useContext } from "react";
import axios from "axios";

// lib Material UI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// lib Components en global variables en functions
import { AuthContext } from "../../Services/AuthContext";
import { backendUrl } from "../../Globals/GlobalVariables";
import { setLocalStorage } from "../../Globals/GlobalFunctions";
import Success from "./Success";

function SignUp() {
    const { handleLogin } = useContext(AuthContext);
    const [values, setValues] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({
        username: false,
        password: false,
        confirmPassword: false,
    });
    const [helperText, setHelperText] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [succesConnect, setSuccesConnect] = useState({
        success: false,
        text: "",
    });

    // valid password
    const isPasswordValid = (username, password) => {
        setErrors({ ...errors, ["password"]: false });

        // Length must be greater than 7 characters
        if (password.length <= 7) {
            setErrors({ ...errors, ["password"]: true });
            setHelperText({ ...helperText, ["password"]: "the length must be > 7" });
            return false;
        }

        // Must contain at least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            setErrors({ ...errors, ["password"]: true });
            setHelperText({ ...helperText, ["password"]: "At least a uppercase" });
            return false;
        }

        // Must contain at least one lowercase letter
        if (!/[a-z]/.test(password)) {
            setErrors({ ...errors, ["password"]: true });
            setHelperText({ ...helperText, ["password"]: "At least a lowercase" });
            return false;
        }

        // Must contain at least one symbol
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            setErrors({ ...errors, ["password"]: true });
            setHelperText({ ...helperText, ["password"]: "At least one symbol" });
            return false;
        }

        // Password must not be equal to username
        if (password === username) {
            setErrors({ ...errors, ["password"]: true });
            setHelperText({ ...helperText, ["password"]: "Must be different from username" });
            return false;
        }

        // All tests passed
        setHelperText({ ...helperText, ["password"]: "" });
        return true;
    };

    const handleChange = (field, value) => {
        if (field === "username") {
            setValues({ ...values, [field]: value });
        } else if (field === "password") {
            isPasswordValid(values.username, value);
            setValues({ ...values, [field]: value });
        } else if (field === "confirmPassword") {
            setValues({ ...values, [field]: value });
        }
    };

    // Submit Form
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (values.password === values.confirmPassword && errors.password === false) {
            setErrors({ ...errors, ["confirmPassword"]: false });
            setHelperText({ ...helperText, ["confirmPassword"]: "" });

            const data = {
                username: values.username,
                password: values.password,
            };

            // call /signup for INSERT username
            axios
                .post(backendUrl + "/signup", data)
                .then((response) => {
                    console.log(response.data.err);
                    if (response.data.err) {
                        // err insert into
                        setErrors({ ...errors, ["username"]: true });
                        setHelperText({ ...helperText, ["username"]: response.data.err });
                    } else {
                        setSuccesConnect({ ...succesConnect, ["success"]: true, ["text"]: response.data.succes });
                        setLocalStorage("token", response.data.token);
                        setLocalStorage("id", response.data.id);
                        setLocalStorage("username", response.data.username);
                        handleLogin();
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            setErrors({ ...errors, ["confirmPassword"]: true });
            setHelperText({ ...helperText, ["confirmPassword"]: "Passwords are not the same" });
        }
    };

    console.log("values", values);
    console.log("errors", errors);

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
                    <TextField
                        required
                        error={errors.confirmPassword}
                        id="outlined-required"
                        label="Confirm Password"
                        type="password"
                        helperText={helperText.confirmPassword}
                        onChange={(event) => handleChange("confirmPassword", event.target.value)}
                    />

                    <Button type="submit" variant="contained">
                        Sign Up
                    </Button>
                </form>
            )}
        </div>
    );
}

export default SignUp;
