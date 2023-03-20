import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

// lib Material UI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

// lib Components en global variables en functions
import { AuthContext } from "../../Services/AuthContext";
import { backendUrl } from "../../Globals/GlobalVariables";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import SelectGenres from "../Forms/selectGenres";
import SelectCountry from "../Forms/SelectCountry";
import FormParamTextField from "../Forms/FormParamTextField";

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
                {/* Avatar */}
                <Avatar alt="Avatar" src={lstParams.avatar.value} />
                <FormParamTextField
                    lstParams={lstParams}
                    handleChanges={handleChanges}
                    label="Avatar"
                    name="avatar"
                    placeholder="Url Image"
                    type="url"
                    keyVal="avatar"
                />

                {/* Bio */}
                <FormParamTextField
                    lstParams={lstParams}
                    handleChanges={handleChanges}
                    label="Bio"
                    name="bio"
                    placeholder="Bio"
                    type="text"
                    keyVal="bio"
                />

                {/* Email */}
                <FormParamTextField
                    lstParams={lstParams}
                    handleChanges={handleChanges}
                    label="Email"
                    name="email"
                    placeholder="Email"
                    type="email"
                    keyVal="email"
                />

                {/* Country */}
                <SelectCountry lstParams={lstParams} setLstParams={setLstParams} />

                {/* Genres Music */}
                <SelectGenres
                    lstValues={lstParams}
                    setLstValues={setLstParams}
                    lstGenres={lstGenres}
                />

                {/* Submit */}
                <Button variant="contained" type="submit">
                    Save
                </Button>
            </form>

            {/* Delete Account */}
            <Button variant="contained" color="error">
                Delete Account
            </Button>
        </div>
    );
}

export default ParamProfile;
