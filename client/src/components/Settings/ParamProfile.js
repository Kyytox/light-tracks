import React, { useState, useEffect, useContext } from "react";

// lib Material UI
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

// lib Components en global variables en functions
import { AuthContext } from "../../Services/AuthContext";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import SelectGenres from "../Forms/selectGenres";
import SelectCountry from "../Forms/SelectCountry";
import FormParamTextField from "../Forms/FormParamTextField";
import { getAxiosReq, getAxiosReqAuth } from "../../Services/AxiosGet";
import { postAxiosReqAuth } from "../../Services/AxiosPost";

function ParamProfile() {
    const { isLoggedIn } = useContext(AuthContext);
    const idUser = getLocalStorage("id");

    const [lstGenres, setLstGenres] = useState([]);
    const [lstCountries, setLstCountries] = useState([]);

    const [lstParams, setLstParams] = useState({
        avatar: { value: "", error: false, helperText: "" },
        bio: { value: "", error: false, helperText: "" },
        email: { value: "", error: false, helperText: "" },
        country: { value: "", error: false, helperText: "" },
        styles: { value: [], error: false, helperText: "" },
    });

    useEffect(() => {
        const token = getLocalStorage("token");

        //
        // get Profile Infos
        const data = { idUser: idUser };
        const response = getAxiosReqAuth("/getProfileInfos", data, token);
        response.then((data) => {
            setLstParams({
                avatar: { value: data.avatar, error: false, helperText: "" },
                bio: { value: data.bio, error: false, helperText: "" },
                email: { value: data.email, error: false, helperText: "" },
                country: {
                    value: [{ c_code_country: data.code_country, c_name_country: data.country }],
                    error: false,
                    helperText: "",
                },
                styles: { value: data.styles, error: false, helperText: "" },
            });
        });

        //
        // get all genres from getGenres with axios
        const response2 = getAxiosReq("/getStylesCountries", {});
        response2.then((data) => {
            setLstGenres(data.styles);
            setLstCountries(data.countries);
        });
    }, []);

    //
    // remove all element of lstParams.country.value but not the last one
    // because in this page we can only select one country
    useEffect(() => {
        if (lstParams.country.value.length > 1) {
            const lastCountry = lstParams.country.value[lstParams.country.value.length - 1];
            setLstParams({
                ...lstParams,
                country: { value: [lastCountry], error: false, helperText: "" },
            });
        }
    }, [lstParams.country.value]);

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
                    code_country: lstParams.country.value[0].c_code_country,
                    name_country: lstParams.country.value[0].c_name_country,
                    styles_music: styles,
                };

                const response = postAxiosReqAuth("/updateProfileInfos", data, token);
                response.then((data) => {
                    console.log(data);
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
                <SelectCountry
                    lstParams={lstParams}
                    setLstParams={setLstParams}
                    lstCountries={lstCountries}
                />

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
