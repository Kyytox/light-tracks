import React from "react";

// lib Material UI
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";

function SelectGenres({ lstValues, setLstValues, lstGenres }) {
    //
    // handle change for Styles
    const handleStyleChange = (newValue) => {
        // modify the key of newValues gm_id => id and gm_name_genre => name
        const newValues = newValue.map((value) => {
            return { id: value.gm_id, name: value.gm_name_genre };
        });
        setLstValues({
            ...lstValues,
            styles: { value: newValues, error: false, helperText: "" },
        });
    };

    console.log("SelectGenres -- lstValues.styles.value", lstValues.styles.value);

    return (
        <div>
            {/* Styles Music */}
            <Autocomplete
                required
                value={lstValues.styles.value.map((style) => {
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
                        <Chip variant="outlined" label={option.gm_name_genre} {...getTagProps({ index })} />
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        error={lstValues.styles.error}
                        variant="outlined"
                        label="styles"
                        placeholder="Search"
                        helperText={lstValues.styles.helperText}
                    />
                )}
            />
        </div>
    );
}

export default SelectGenres;
