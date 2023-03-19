import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

// lib Material UI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";

// lib Components en global variables en functions
import { AuthContext } from "../../Services/AuthContext";
import { backendUrl } from "../../Globals/GlobalVariables";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { countries } from "./Countries";
import { Select } from "@mui/material";
import SelectGenres from "../Forms/selectGenres";

function ParamProfile() {
    const { isLoggedIn } = useContext(AuthContext);
    const idUser = getLocalStorage("id");

    const [lstGenres, setLstGenres] = useState([]);

    const [lstParams, setLstParams] = useState({
        avatar: { value: "", error: false, helperText: "" },
        bio: { value: "", error: false, helperText: "" },
        email: { value: "", error: false, helperText: "" },
        code_country: { value: "", error: false, helperText: "" },
        country: { value: "", error: false, helperText: "" },
        styles: { value: [], error: false, helperText: "" },
    });

    useEffect(() => {
        const token = getLocalStorage("token");

        //
        // get Profile Infos
        axios
            .get(backendUrl + "/getProfileInfos", {
                params: {
                    idUser: idUser,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                // setValues(response.data);
                console.log(response.data);
                setLstParams({
                    avatar: { value: response.data.avatar, error: false, helperText: "" },
                    bio: { value: response.data.bio, error: false, helperText: "" },
                    email: { value: response.data.email, error: false, helperText: "" },
                    code_country: {
                        value: response.data.code_country,
                        error: false,
                        helperText: "",
                    },
                    country: { value: response.data.country, error: false, helperText: "" },
                    styles: { value: response.data.styles, error: false, helperText: "" },
                });
            })
            .catch((error) => {
                console.error(error);
            });

        //
        // get all genres from getGenres with axios
        axios
            .get(backendUrl + "/getGenres")
            .then((response) => {
                setLstGenres(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    //
    // handle change for inputs
    const handleChanges = (key, value) => {
        // check if value has a valid format
        const isValid =
            (key === "avatar" && value.startsWith("http")) ||
            (key === "email" && value.includes("@")) ||
            key === "bio";

        if (isValid) {
            setLstParams({ ...lstParams, [key]: { value: value, error: false, helperText: "" } });
        } else {
            const errText = key === "avatar" ? "Url not valid" : "Email not valid";
            setLstParams({
                ...lstParams,
                [key]: { value: value, error: true, helperText: errText },
            });
        }
    };

    //
    // submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        const token = getLocalStorage("token");

        const styles = lstParams.styles.value.map((style) => style.id);

        if (isLoggedIn) {
            // check if all errors are false send data to server at /updateUser
            if (!lstParams.avatar.error && !lstParams.bio.error && !lstParams.email.error) {
                console.log("no errors");
                const data = {
                    id: idUser,
                    avatar: lstParams.avatar.value,
                    bio: lstParams.bio.value,
                    email: lstParams.email.value,
                    code_country: lstParams.code_country.value,
                    name_country: lstParams.country.value,
                    styles_music: styles,
                };
                axios
                    .post(backendUrl + "/updateProfileInfos", data, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((response) => {
                        console.log(response);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Avatar alt="Avatar" src={lstParams.avatar.value} />
                <TextField
                    id="outlined-basic"
                    label="Avatar"
                    variant="outlined"
                    type="url"
                    name="avatar"
                    placeholder="Url Image"
                    value={lstParams.avatar.value}
                    onChange={(e) => {
                        handleChanges("avatar", e.target.value);
                    }}
                    error={lstParams.avatar.error}
                    helperText={lstParams.avatar.helperText}
                />
                <TextField
                    id="outlined-basic"
                    label="Bio"
                    multiline
                    rows={5}
                    variant="outlined"
                    type="text"
                    name="bio"
                    placeholder="Bio"
                    value={lstParams.bio.value}
                    onChange={(e) => {
                        handleChanges("bio", e.target.value);
                    }}
                />
                <TextField
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={lstParams.email.value}
                    onChange={(e) => {
                        handleChanges("email", e.target.value);
                    }}
                    error={lstParams.email.error}
                    helperText={lstParams.email.helperText}
                />
                <Select
                    labelId="select-country"
                    id="select-country"
                    value={lstParams.code_country.value}
                    label="Country"
                    onChange={(e) => {
                        setLstParams({
                            ...lstParams,
                            code_country: {
                                value: e.target.value,
                                error: false,
                                helperText: "",
                            },
                            country: {
                                value: countries.find((country) => country.code === e.target.value)
                                    .label,
                                error: false,
                                helperText: "",
                            },
                        });
                    }}
                >
                    {countries.map((country) => (
                        <MenuItem value={country.code}>
                            <img
                                loading="lazy"
                                width="20"
                                src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                                srcSet={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png 2x`}
                                alt="country flag"
                            />
                            &ensp;{country.label}
                        </MenuItem>
                    ))}
                </Select>
                {/* Genres Music */}
                <SelectGenres
                    lstValues={lstParams}
                    setLstValues={setLstParams}
                    lstGenres={lstGenres}
                />
                <Button variant="contained" type="submit">
                    Save
                </Button>
            </form>
            <Button variant="contained" color="error">
                Delete Account
            </Button>
        </div>
    );
}

export default ParamProfile;
