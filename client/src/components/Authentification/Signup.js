import React, { useState, useContext } from "react";

// lib Material UI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

// lib Components en global variables en functions
import { AuthContext } from "../../Services/AuthContext";
import { setLocalStorage } from "../../Globals/GlobalFunctions";
import { postAxiosReq } from "../../Services/AxiosPost";
import Success from "./Success";
import { useNavigate } from "react-router-dom";

function SignUp() {
    const navigate = useNavigate();
    const { handleLogin } = useContext(AuthContext);

    const [values, setValues] = useState({
        username: { value: "", error: false, helperText: "" },
        password: { value: "", error: false, helperText: "" },
        confirmPassword: { value: "", error: false, helperText: "" },
        topArtist: { value: false, error: false, helperText: "" },
    });

    const [succesConnect, setSuccesConnect] = useState({
        success: false,
        text: "",
    });

    // valid password
    const isPasswordValid = (username, password) => {
        setValues({ ...values, password: { value: password, error: false, helperText: "" } });

        // Length must be greater than 7 characters
        if (password.length <= 7) {
            setValues({
                ...values,
                password: { value: password, error: true, helperText: "the length must be > 7" },
            });
            return false;
        }

        // Must contain at least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            setValues({
                ...values,
                password: { value: password, error: true, helperText: "At least an uppercase" },
            });
            return false;
        }

        // Must contain at least one lowercase letter
        if (!/[a-z]/.test(password)) {
            setValues({
                ...values,
                password: { value: password, error: true, helperText: "At least a lowercase" },
            });
            return false;
        }

        // Must contain at least one symbol
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            setValues({
                ...values,
                password: { value: password, error: true, helperText: "At least a symbol" },
            });
            return false;
        }

        // Password must not be equal to username
        if (password === username) {
            setValues({
                ...values,
                password: {
                    value: password,
                    error: true,
                    helperText: "Password must not be equal to username",
                },
            });
            return false;
        }

        // All tests passed
        setValues({ ...values, password: { value: password, error: false, helperText: "" } });
        return true;
    };

    const handleChange = (field, value) => {
        if (field === "password") {
            isPasswordValid(values.username, value);
        }
        setValues({ ...values, [field]: { value, error: false, helperText: "" } });
    };

    // Submit Form
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (values.password.value === values.confirmPassword.value && values.password.error === false) {
            setValues({
                ...values,
                confirmPassword: {
                    value: values.confirmPassword.value,
                    error: false,
                    helperText: "",
                },
            });

            const data = {
                username: values.username.value,
                password: values.password.value,
                topArtist: values.topArtist.value,
            };

            // call /signup for INSERT user
            console.log("Signup.js -- /signup");
            const response = postAxiosReq("/signup", data);
            response.then((res) => {
                console.log(res);
                if (res.err) {
                    // err insert into
                    setValues({
                        ...values,
                        username: {
                            value: values.username.value,
                            error: true,
                            helperText: res.err,
                        },
                    });
                } else {
                    setSuccesConnect({
                        ...succesConnect,
                        success: true,
                        text: res.succes,
                    });

                    // set localstorage
                    setLocalStorage("token", res.token);
                    setLocalStorage("id", res.id);
                    setLocalStorage("username", res.username);

                    // set User Logged
                    handleLogin();

                    // redirect to /profile/settings
                    navigate(`/profile/${res.username}/settings`);
                }
            });
        } else {
            setValues({
                ...values,
                confirmPassword: {
                    value: values.confirmPassword.value,
                    error: true,
                    helperText: "Password not equal",
                },
            });
        }
    };

    console.log("Signup.js -- render", values);

    return (
        <div className="div-form-auth">
            {succesConnect.success ? (
                <Success text={succesConnect.text} />
            ) : (
                <form onSubmit={handleSubmit} className="form-auth flex flex-col align-center">
                    <TextField
                        className="input-text-field"
                        required
                        error={values.username.error}
                        id="outlined-error-helper-text"
                        label="Name User"
                        helperText={values.username.helperText}
                        onChange={(event) => handleChange("username", event.target.value)}
                    />

                    <TextField
                        className="input-text-field"
                        required
                        error={values.password.error}
                        id="outlined-required"
                        label="Password"
                        type="password"
                        helperText={values.password.helperText}
                        onChange={(event) => handleChange("password", event.target.value)}
                    />

                    <TextField
                        className="input-text-field"
                        required
                        error={values.confirmPassword.error}
                        id="outlined-required"
                        label="Confirm Password"
                        type="password"
                        helperText={values.confirmPassword.helperText}
                        onChange={(event) => handleChange("confirmPassword", event.target.value)}
                    />

                    {/* Radio group Top Artist */}
                    <FormControl>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="listener"
                            name="radio-buttons-group"
                            row
                            fullWidth
                            className="flex justify-evenly text-white"
                        >
                            <FormControlLabel
                                value="artist"
                                control={
                                    <Radio
                                        checked={values.topArtist.value === true}
                                        onChange={(event) => handleChange("topArtist", true)}
                                        name="radio-buttons"
                                    />
                                }
                                label="I am an Artist"
                            />
                            <FormControlLabel
                                value="listener"
                                control={
                                    <Radio
                                        checked={values.topArtist.value === false}
                                        onChange={(event) => handleChange("topArtist", false)}
                                        name="radio-buttons"
                                    />
                                }
                                label="I am a Listener"
                            />
                        </RadioGroup>
                    </FormControl>

                    <Button type="submit" variant="contained" color="primary">
                        Create Account
                    </Button>
                </form>
            )}
        </div>
    );
}

export default SignUp;
