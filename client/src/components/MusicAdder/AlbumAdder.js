import React, { useState, useEffect } from "react";

import TextField from "@mui/material/TextField";
import { Checkbox } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import SelectGenres from "../Forms/selectGenres";
import { getAxiosReq } from "../../Services/AxiosGet";
import FormAddTags from "../Forms/FormAddTags";

function AlbumAdder({
    album,
    setAlbum,
    ImgInputRef,
    onAlbumChange,
    handleImgDelete,
    topFileConvert,
}) {
    const [lstGenres, setLstGenres] = useState([]);

    // change checkbox value
    const handleChangeCheckbox = (e) => {
        const { name, checked } = e.target;

        // browse all key start with "top_"; if key = name, set value = true else set value = false
        const newAlbum = Object.keys(album).reduce((acc, key) => {
            if (key.startsWith("top_")) {
                if (key === name) {
                    if (key === "top_free" || key === "top_custom_price") {
                        acc["price"] = {
                            ...album["price"],
                            value: 0,
                            error: false,
                            helperText: "",
                        };
                    } else {
                        acc["price"] = {
                            ...album["price"],
                            value: "",
                            error: false,
                            helperText: "",
                        };
                    }
                    acc[key] = { ...album[key], value: checked, error: false, helperText: "" };
                } else {
                    acc[key] = { ...album[key], value: false, error: false, helperText: "" };
                }
            }
            return acc;
        }, {});

        // if all top_ = false, set top_price = true
        if (
            !newAlbum.top_free.value &&
            !newAlbum.top_custom_price.value &&
            !newAlbum.top_price.value
        ) {
            newAlbum.top_price = { ...album.top_price, value: true, error: false, helperText: "" };
        }

        setAlbum({ ...album, ...newAlbum });
    };

    useEffect(() => {
        // get all genres
        const response = getAxiosReq("/getStyles", {});
        response.then((data) => {
            setLstGenres(data);
        });
    }, []);

    return (
        <div>
            <h1>Add Album</h1>
            <div>
                {/* Image */}
                <Button
                    required
                    disabled={topFileConvert}
                    id="album-image"
                    label="image"
                    variant="contained"
                    component="label"
                    value={album.image.value}
                    onChange={(e) => onAlbumChange("image", e.target.files[0])}
                    color={(album.image.error && "error") || "primary"}
                >
                    Upload Album Image .jpg, .jpeg, .png
                    <input type="file" accept=".jpg, .jpeg, .png" ref={ImgInputRef} hidden />
                </Button>
                <FormHelperText error={album.image.error} color="error">
                    {album.image.helperText}
                </FormHelperText>
                {album.image.value && (
                    <>
                        <img src={album.image.url} alt="album-cover" style={{ width: "75px" }} />
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={(e) => handleImgDelete("image")}
                        >
                            X
                        </Button>
                    </>
                )}
                {/* title */}
                <TextField
                    required
                    disabled={topFileConvert}
                    id="album-title"
                    label="title"
                    variant="outlined"
                    value={album.title.value}
                    onChange={(e) => onAlbumChange("title", e.target.value)}
                    error={album.title.error}
                    helperText={album.title.helperText}
                />
                {/* artist */}
                <TextField
                    required
                    disabled={topFileConvert}
                    id="album-artist"
                    label="artist"
                    variant="outlined"
                    value={album.artist.value}
                    onChange={(e) => onAlbumChange("artist", e.target.value)}
                    error={album.artist.error}
                    helperText={album.artist.helperText}
                />
                {/* price */}
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                id="album-top-price"
                                label="top_price"
                                name="top_price"
                                value={album.top_price.value}
                                checked={album.top_price.value}
                                onChange={handleChangeCheckbox}
                            />
                        }
                        label="I choose the price"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                id="album-top-custom-price"
                                label="top_custom_price"
                                name="top_custom_price"
                                value={album.top_custom_price.value}
                                checked={album.top_custom_price.value}
                                onChange={handleChangeCheckbox}
                            />
                        }
                        label="Fans choose the price"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                id="album-top-free"
                                label="top_free"
                                name="top_free"
                                value={album.top_free.value}
                                checked={album.top_free.value}
                                onChange={handleChangeCheckbox}
                            />
                        }
                        label="Album is free"
                    />
                    <TextField
                        required
                        disabled={topFileConvert || !album.top_price.value}
                        id="album-price"
                        variant="outlined"
                        label="price"
                        value={album.price.value}
                        type="number"
                        onChange={(e) => onAlbumChange("price", e.target.value)}
                        error={album.price.error}
                        helperText={album.price.helperText}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                    />
                </FormGroup>

                {/* date */}
                <TextField
                    required
                    disabled={topFileConvert}
                    id="album-date-release"
                    label="date release"
                    type="date"
                    value={album.date_release.value}
                    sx={{ width: 220 }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => onAlbumChange("date_release", e.target.value)}
                    // error={album.date_release.error}
                    // helperText={album.date_release.helperText}
                />
                {/* description */}
                <TextField
                    disabled={topFileConvert}
                    id="album-descr"
                    label="descr"
                    variant="outlined"
                    value={album.descr.value}
                    multiline
                    rows={10}
                    onChange={(e) => onAlbumChange("descr", e.target.value)}
                />
                {/* genres */}
                <SelectGenres lstValues={album} setLstValues={setAlbum} lstGenres={lstGenres} />
                {/* Tags */}
                <FormAddTags album={album} setAlbum={setAlbum} />
            </div>
        </div>
    );
}

export default AlbumAdder;
