import React from "react";

// lib Material UI
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function SelectCountry({ lstParams, setLstParams, lstCountries }) {
    const handleCountryChange = (e) => {
        const country = lstCountries.find(
            (c) => c.c_code_country === e.target.value[e.target.value.length - 1]
        );

        // if country.c_code_country not in lstParams.country.value then add new country
        if (!lstParams.country.value.find((c) => c.c_code_country === country.c_code_country)) {
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
        }
    };

    const handleCountryClear = (e) => {
        e.preventDefault();
        setLstParams({
            ...lstParams,
            country: { value: [], error: false, helperText: "" },
        });
    };

    return (
        <>
            <Select
                labelId="select-country"
                multiple
                id="select-country"
                label="Country"
                value={
                    lstParams.country.value
                        ? lstParams.country.value.map((c) => c.c_code_country)
                        : []
                }
                freeSolo
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
                }
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
                {/* buttton for clear */}
            </Select>
            <button onClick={(e) => handleCountryClear(e)} type="button">
                Clear
            </button>
        </>
    );
}

export default SelectCountry;
