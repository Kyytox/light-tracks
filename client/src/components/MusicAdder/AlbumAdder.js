import React from "react";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";

function AlbumAdder({ album, ImgInputRef, onAlbumChange, handleImgDelete }) {
    const musicStyles = ["Blues", "Classical", "Country", "Dance", "Electronic", "Folk", "Hip-Hop", "Jazz", "Latin", "Metal", "Pop", "R&B", "Reggae", "Rock", "Soul"];

    return (
        <div>
            <h1>Add Album</h1>
            <div>
                {/* Image */}
                <Button
                    required
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
                    {album.image.msg}
                </FormHelperText>
                {album.image.value && (
                    <>
                        <img src={album.image.url} alt="album-cover" style={{ width: "75px" }} />
                        <Button variant="contained" color="secondary" onClick={(e) => handleImgDelete("image")}>
                            X
                        </Button>
                    </>
                )}
                {/* title */}
                <TextField
                    required
                    id="album-title"
                    label="title"
                    variant="outlined"
                    value={album.title.value}
                    onChange={(e) => onAlbumChange("title", e.target.value)}
                    error={album.title.error}
                    helperText={album.title.msg}
                />
                {/* artist */}
                <TextField
                    required
                    id="album-artist"
                    label="artist"
                    variant="outlined"
                    value={album.artist.value}
                    onChange={(e) => onAlbumChange("artist", e.target.value)}
                    error={album.artist.error}
                    helperText={album.artist.msg}
                />
                {/* price */}
                <TextField
                    required
                    id="album-price"
                    variant="outlined"
                    label="price"
                    value={album.price.value}
                    type="number"
                    onChange={(e) => onAlbumChange("price", e.target.value)}
                    error={album.price.error}
                    helperText={album.price.msg}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                />
                {/* date */}
                <TextField
                    required
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
                    // helperText={album.date_release.msg}
                />
                {/* description */}
                <TextField
                    id="album-descr"
                    label="descr"
                    variant="outlined"
                    value={album.descr.value}
                    multiline
                    rows={4}
                    onChange={(e) => onAlbumChange("descr", e.target.value)}
                />
                {/* style Musics */}
                <Autocomplete
                    required
                    value={album.styles.value}
                    onChange={(e, newValue) =>
                        onAlbumChange(
                            "styles",
                            newValue.map((option) => option)
                        )
                    }
                    multiple
                    id="album-styles"
                    options={musicStyles}
                    getOptionLabel={(option) => option}
                    freeSolo
                    renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} />)}
                    renderInput={(params) => (
                        <TextField {...params} error={album.styles.error} variant="outlined" label="styles" placeholder="Search" helperText={album.styles.msg} />
                    )}
                />
            </div>
        </div>
    );
}

export default AlbumAdder;
