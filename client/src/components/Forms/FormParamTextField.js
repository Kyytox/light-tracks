import React from "react";
import TextField from "@mui/material/TextField";

function FormParamTextField({ lstParams, handleChanges, label, name, placeholder, type, keyVal }) {
    return (
        <TextField
            id="outlined-basic"
            className="input-text-field"
            label={label}
            variant="outlined"
            multiline={name === "bio" ? true : false}
            rows={name === "bio" ? 5 : 1}
            type={type}
            name={name}
            placeholder={placeholder}
            value={lstParams[keyVal].value}
            onChange={(e) => {
                handleChanges(keyVal, e.target.value);
            }}
            error={lstParams[keyVal].error}
            helperText={lstParams[keyVal].helperText}
        />
    );
}

export default FormParamTextField;
