import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

// lib Material UI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";

// lib Components en global variables en functions
import { AuthContext } from "../../Services/AuthContext";
import { backendUrl } from "../../Globals/GlobalVariables";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { countries } from "./Countries";
import { Select } from "@mui/material";

function ParamProfile() {
    const { isLoggedIn } = useContext(AuthContext);
    const idUser = getLocalStorage("id");

    const [lstGenres, setLstGenres] = useState([]);

    const [values, setValues] = useState({
        avatar: "",
        bio: "",
        email: "",
        code_country: "",
        country: "",
        styles: [],
    });
    const [errors, setErrors] = useState({
        avatar: false,
        bio: false,
        email: false,
        code_country: false,
        country: false,
        styles: false,
    });
    const [helperText, setHelperText] = useState({
        avatar: "",
        bio: "",
        email: "",
        code_country: "",
        country: "",
        styles: "",
    });

    useEffect(() => {
        const token = getLocalStorage("token");

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
                setValues(response.data);
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
            setValues({ ...values, [key]: value });
            setErrors({ ...errors, [key]: false });
            setHelperText({ ...helperText, [key]: "" });
        } else {
            const errText = key === "avatar" ? "Url not valid" : "Email not valid";
            setErrors({ ...errors, [key]: true });
            setHelperText({ ...helperText, [key]: errText });
        }
    };

    //
    // handle change for Styles
    const handleStyleChange = (newValue) => {
        console.log("newValue", newValue);

        // modify the key of newValues gm_id => id and gm_name_genre => name
        const newValues = newValue.map((value) => {
            return { id: value.gm_id, name: value.gm_name_genre };
        });

        setValues({ ...values, styles: newValues });
    };

    //
    // submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        const token = getLocalStorage("token");

        const styles = values.styles.map((style) => style.id);
        console.log("styles", styles);

        if (isLoggedIn) {
            // check if all errors are false send data to server at /updateUser
            if (!errors.avatar && !errors.bio && !errors.email) {
                console.log("no errors");
                const data = {
                    id: idUser,
                    avatar: values.avatar,
                    bio: values.bio,
                    email: values.email,
                    code_country: values.code_country,
                    name_country: values.country,
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

    console.log("values", values);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Avatar alt="Avatar" src={values.avatar} />
                <TextField
                    id="outlined-basic"
                    label="Avatar"
                    variant="outlined"
                    type="url"
                    name="avatar"
                    placeholder="Url Image"
                    value={values.avatar}
                    onChange={(e) => {
                        handleChanges("avatar", e.target.value);
                    }}
                    error={errors.avatar}
                    helperText={helperText.avatar}
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
                    value={values.bio}
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
                    value={values.email}
                    onChange={(e) => {
                        handleChanges("email", e.target.value);
                    }}
                    error={errors.email}
                    helperText={helperText.email}
                />
                <Select
                    labelId="select-country"
                    id="select-country"
                    value={values.code_country}
                    label="Country"
                    onChange={(e) => {
                        setValues({
                            ...values,
                            code_country: e.target.value,
                            country: countries.find((country) => country.code === e.target.value)
                                .label,
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
                {/* Styles Music */}
                <Autocomplete
                    required
                    value={values.styles.map((style) => {
                        return { gm_id: style.id, gm_name_genre: style.name };
                    })}
                    onChange={(e, newValue) => {
                        handleStyleChange(newValue);
                    }}
                    multiple
                    id="genres-music"
                    options={lstGenres}
                    getOptionLabel={(option) => option.gm_name_genre}
                    freeSolo
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                variant="outlined"
                                label={option.gm_name_genre}
                                {...getTagProps({ index })}
                            />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            error={errors.styles}
                            variant="outlined"
                            label="styles"
                            placeholder="Search"
                            helperText={helperText.styles}
                        />
                    )}
                />
                ;
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
