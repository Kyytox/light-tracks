import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function SelectCountry({ lstParams, setLstParams, lstCountries }) {
    const handleCountryChange = (e) => {
        const country = lstCountries.find(
            (c) => c.c_code_country === e.target.value[e.target.value.length - 1]
        );

        // add new country to lstParams don't delete old country
        setLstParams({
            ...lstParams,
            country: {
                value: [
                    ...lstParams.country.value,
                    {
                        c_code_country: country.c_code_country,
                        c_name_country: country.c_name_country,
                    },
                ],
                error: false,
                helperText: "",
            },
        });
    };

    return (
        <Select
            labelId="select-country"
            multiple
            id="select-country"
            value={
                lstParams.country.value ? lstParams.country.value.map((c) => c.c_code_country) : []
            }
            label="Country"
            onChange={(e) => handleCountryChange(e)}
        >
            {lstCountries.map((country) => (
                <MenuItem value={country.c_code_country}>
                    <img
                        loading="lazy"
                        width="20"
                        src={`https://flagcdn.com/w20/${country.c_code_country.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w40/${country.c_code_country.toLowerCase()}.png 2x`}
                        alt="country flag"
                    />
                    &ensp;{country.c_name_country}
                </MenuItem>
            ))}
        </Select>
    );
}

export default SelectCountry;
