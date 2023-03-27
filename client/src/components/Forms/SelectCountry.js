import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { countries } from "../Settings/Countries";

function SelectCountry({ lstParams, setLstParams, lstCountries }) {
    console.log("SelectCountry --- lstParams", lstParams);
    console.log("SelectCountry --- lstCountries", lstCountries);

    return (
        <Select
            labelId="select-country"
            id="select-country"
            value={lstParams.country.value.map((country) => country.p_code_country)}
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
            {lstCountries.map((country) => (
                <MenuItem value={country.p_code_country}>
                    <img
                        loading="lazy"
                        width="20"
                        src={`https://flagcdn.com/w20/${country.p_code_country.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w40/${country.p_code_country.toLowerCase()}.png 2x`}
                        alt="country flag"
                    />
                    &ensp;{country.p_name_country}
                </MenuItem>
            ))}
        </Select>
    );
}

export default SelectCountry;
