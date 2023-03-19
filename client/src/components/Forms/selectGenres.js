import React from "react";

// lib Material UI
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";

function SelectGenres({ values, setValues, lstGenres, errors, helperText }) {
    console.log("Select genres --- values", values);

    //
    // handle change for Styles
    const handleStyleChange = (newValue) => {
        console.log("newValue", newValue);

        // modify the key of newValues gm_id => id and gm_name_genre => name
        const newValues = newValue.map((value) => {
            return { id: value.gm_id, name: value.gm_name_genre };
        });

        setValues({ ...values, styles: newValues });
    };

    return (
        <div>
            {/* Styles Music */}
            <Autocomplete
                required
                value={values.styles.map((style) => {
                    return { gm_id: style.id, gm_name_genre: style.name };
                })}
                onChange={(e, newValue) => {
                    handleStyleChange(newValue);
                }}
                multiple
                id="genres-music"
                options={lstGenres}
                getOptionLabel={(option) => option.gm_name_genre}
                freeSolo
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip
                            variant="outlined"
                            label={option.gm_name_genre}
                            {...getTagProps({ index })}
                        />
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        error={errors.styles}
                        variant="outlined"
                        label="styles"
                        placeholder="Search"
                        helperText={helperText.styles}
                    />
                )}
            />
        </div>
    );
}

export default SelectGenres;
