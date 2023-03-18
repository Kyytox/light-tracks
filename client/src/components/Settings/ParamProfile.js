import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

// lib Material UI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';

// lib Components en global variables en functions
import { AuthContext } from "../../Services/AuthContext";
import { backendUrl } from "../../Globals/GlobalVariables";
import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { countries } from './Countries';



function ParamProfile() {

    const { isLoggedIn } = useContext(AuthContext);
    const idUser = getLocalStorage("id");


    const [values, setValues] = useState({
        avatar: "",
        bio: "",
        email: "",
        code_country: "",
        country: "",
    });
    const [errors, setErrors] = useState({
        avatar: false,
        bio: false,
        email: false,
        code_country: false,
        country: false,
    });
    const [helperText, setHelperText] = useState({
        avatar: "",
        bio: "",
        email: "",
        code_country: "",
        country: "",
    });


    //  check value and set value
    const handleChanges = (key, value) => {
        // check if value has a valid format
        const isValid = key === "avatar" && value.startsWith("http")
            || key === "email" && value.includes("@")
            || key === "bio";

        
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

    // submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("submit");
        console.log("values", values);
        const token = getLocalStorage("token");

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
                    country: values.country,
                };
                axios
                    .post(backendUrl + "/updateUser", data, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((response) => {
                        console.log(response);
                    }
                    )
                    .catch((error) => {
                        console.error(error);
                    }
                    );
            }
        }
    };


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
                    onChange={(e) => { 
                        handleChanges("email", e.target.value);
                    }}
                    error={errors.email}
                    helperText={helperText.email}
                />
                <Autocomplete
                    id="country-select"
                    sx={{ width: 300 }}
                    options={countries}
                    autoHighlight
                    getOptionLabel={(option) => option.label}
                    renderOption={(props, option) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <img
                            loading="lazy"
                            width="20"
                            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                            alt=""
                        />
                        {option.label} ({option.code})
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                        {...params}
                        label="Choose a country"
                        inputProps={{
                            ...params.inputProps,
                        }}
                        />
                    )}
                    onChange={(e, value) => {
                        console.log("value", value);
                        setValues({ ...values, ["code_country"]: value.code, ["country"]: value.label });
                    }}
                />
                <Button variant="contained" type='submit'>Save</Button>
            </form>
            <Button variant="contained" color='error'>Delete Account</Button>
        </div>
    );
}

export default ParamProfile;