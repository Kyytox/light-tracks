import React, { useState, useEffect, useContext } from 'react';


// lib Material UI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';

// lib Components en global variables en functions
import { AuthContext } from "../../Services/AuthContext";
import { backendUrl } from "../../Globals/GlobalVariables";
import { setLocalStorage, getLocalStorage } from "../../Globals/GlobalFunctions";
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


    const handleChanges = (key, value) => {
        if (key === "avatar") {
            // if value is url type set value
            if (value.startsWith("http")) {
                setValues({ ...values, [key]: value });
            } else {
                setErrors({ ...errors, [key]: true });
                setHelperText({ ...helperText, [key]: "Url not valid" });
            }
        }

        if (key === "email") {
            // if value is email type set value
            if (value.includes("@")) {
                setValues({ ...values, [key]: value });
            } else {
                setErrors({ ...errors, [key]: true });
                setHelperText({ ...helperText, [key]: "Email not valid" });
            }
        }

        if (key === "bio") {
            setValues({ ...values, [key]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("submit");
        console.log("values", values);
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