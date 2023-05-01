import React from "react";

// lib Material UI
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

function SelectCountry({ lstParams, setLstParams, lstCountries }) {
    const handleCountryChange = (e) => {
        const country = lstCountries.find((c) => c.c_code_country === e.target.value[e.target.value.length - 1]);

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
        <div className="flex flex-row mb-6 items-center">
            <FormControl className="input-text-field w-2/3">
                <InputLabel id="country-select-label">Countries</InputLabel>
                <Select
                    multiple
                    labelId="select-country"
                    label="Country"
                    id="select-country"
                    value={lstParams.country.value ? lstParams.country.value.map((c) => c.c_code_country) : []}
                    onChange={(e) => handleCountryChange(e)}
                >
                    {lstCountries.map((country, key) => (
                        <MenuItem value={country.c_code_country}>
                            <img
                                loading="lazy"
                                width="20"
                                src={`https://flagcdn.com/w20/${country.c_code_country.toLowerCase()}.png`}
                                srcSet={`https://flagcdn.com/w40/${country.c_code_country.toLowerCase()}.png 2x`}
                                alt="country flag"
                                key={key}
                            />
                            &ensp;{country.c_name_country}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* buttton for clear */}
            <Button
                variant="contained"
                color="secondary"
                onClick={(e) => handleCountryClear(e)}
                sx={{ width: "100px", marginLeft: "10px" }}
            >
                Clear
            </Button>
        </div>
    );
}

export default SelectCountry;
