import React, { useState, useEffect } from "react";

import TextField from "@mui/material/TextField";
import { Autocomplete } from "@mui/material";
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
                <TextField
                    required
                    disabled={topFileConvert}
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
