import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { countries } from "../Settings/Countries";

function SelectCountry(props) {
    const { lstParams, setLstParams } = props;

    return (
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
                        value: countries.find((country) => country.code === e.target.value).label,
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
    );
}

export default SelectCountry;
