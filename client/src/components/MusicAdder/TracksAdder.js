import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";
import { Checkbox, FormControlLabel } from "@mui/material";

function TracksAdder({
    lstTrack,
    setLstTrack,
    fileInputRef,
    handleAddFormTrack,
    topFileConvert,
    topCalculatePriceAuto,
    setTopCalculatePriceAuto,
    convertFile,
}) {
    // formats accepted for the file track
    const acceptedFormatsTrack = ["audio/mpeg", "audio/flac", "audio/wav"];

    ///////////////////////////
    //
    // Add File Track
    //
    ///////////////////////////
    const handleAddTrack = (index, value) => {
        const newMusicList = [...lstTrack];
        const error = value && !acceptedFormatsTrack.includes(value.type);
        const errSize = value && value.size > 260000000;

        newMusicList[index]["fileOrigin"] = {
            error: error || errSize,
            helperText: error
                ? "This file format is not accepted"
                : errSize
                ? "the file size is greater than 260 MB"
                : "",
            value: error || errSize ? null : value,
        };

        // if no error and no error size, create fromdata and convert file
        if (!error && !errSize) {
            const formDataConvert = new FormData();
            formDataConvert.append("file", value);

            if (value.type !== "audio/mpeg") {
                // call convertFile function to convert the file to mp3
                convertFile(index, newMusicList, formDataConvert);
            } else {
                newMusicList[index]["fileMp3"] = {
                    error: false,
                    helperText: "",
                    value: value,
                };
            }

            setLstTrack(newMusicList);
        }
    };

    ///////////////////////////
    //
    // add a infos track
    //
    ///////////////////////////
    const changeInfosTrack = (index, field, value) => {
        const newMusicList = [...lstTrack];

        newMusicList[index][field] = {
            ...newMusicList[index][field],
            value: value,
            error: false,
            helperText: "",
        };

        setLstTrack(newMusicList);
        // if (field === "file" && newMusicList[index][field].error) fileInputRef.current.value = null;
    };

    ///////////////////////////
    //
    // Delete File track
    //
    ///////////////////////////
    const handleDeleteFile = (index) => {
        const delMusicFile = [...lstTrack];
        delMusicFile[index]["fileOrigin"] = { error: false, helperText: "", value: null };
        delMusicFile[index]["fileMp3"] = { error: false, helperText: "", value: null };

        setLstTrack(delMusicFile);
        // quand on va faire le CSS il faudra récup le div du file input pour pouvoir reset le bon file input car actuelement on reset uniquement le dernier file input
        fileInputRef.current.value = null;
    };

    return (
        <div>
            <h1>Add Tracks</h1>
            <div>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={topCalculatePriceAuto}
                            onChange={(e) => setTopCalculatePriceAuto(e.target.checked)}
                        />
                    }
                    label="Calculate price automatically"
                />

                {lstTrack.map((music, index) => (
                    <div key={index}>
                        {/* title */}
                        <TextField
                            required
                            disabled={topFileConvert}
                            id="track-title"
                            label="title"
                            variant="outlined"
                            value={music.title.value}
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => changeInfosTrack(index, "title", e.target.value)}
                            error={music.title.error}
                            helperText={
                                music.title.helperText ||
                                "leave blank to put the same name of upload track"
                            }
                        />
                        {/* Artist
                        <TextField
                            id="track-artist"
                            label="artist"
                            variant="outlined"
                            value={music.artist.value}
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => changeInfosTrack(index, "artist", e.target.value)}
                            error={music.artist.error}
                            helperText={
                                music.artist.helperText ||
                                "leave blank to put the same Album artist"
                            }
                        /> */}
                        {/* file */}
                        <Button
                            disabled={topFileConvert}
                            id="track-file"
                            label="file"
                            variant="contained"
                            component="label"
                            onChange={(e) => handleAddTrack(index, e.target.files[0])}
                            color={(music.fileOrigin.error && "error") || "primary"}
                        >
                            Upload file track .mp3, .wav, .flac
                            <input
                                type="file"
                                accept=".mp3, .wav, .flac"
                                ref={fileInputRef}
                                hidden
                            />
                        </Button>
                        <FormHelperText error={music.fileOrigin.error} color="error">
                            {music.fileOrigin.helperText}
                        </FormHelperText>

                        {/* display progress circle when convert file */}
                        {topFileConvert && <CircularProgress size={24} />}

                        {/* display file name and size */}
                        {music.fileOrigin.value && (
                            <>
                                <p>
                                    {music.fileOrigin.value.name}{" "}
                                    {(music.fileOrigin.value.size / (1024 * 1024)).toFixed(2)} Mo
                                </p>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={(e) => handleDeleteFile(index)}
                                >
                                    X
                                </Button>
                            </>
                        )}

                        {/* Price */}
                        <TextField
                            required
                            disabled={topFileConvert || !music.top_price.value}
                            id="track-price"
                            variant="outlined"
                            label="price"
                            value={music.price.value}
                            type="number"
                            onChange={(e) => changeInfosTrack(index, "price", e.target.value)}
                            error={music.price.error}
                            helperText={music.price.helperText}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                        {/* Date */}
                        <TextField
                            disabled={topFileConvert}
                            id="track-date-release"
                            label="date release"
                            type="date"
                            value={music.date_release.value}
                            sx={{ width: 220 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(e) =>
                                changeInfosTrack(index, "date_release", e.target.value)
                            }
                            helperText="leave blank to put the same Album date release"
                        />
                        {/* Lyrics */}
                        <TextField
                            disabled={topFileConvert}
                            id="track-lyrics"
                            label="lyrics"
                            variant="outlined"
                            value={lstTrack.Lyrics}
                            onChange={(e) => changeInfosTrack(index, "lyrics", e.target.value)}
                        />
                        {/* nb listens */}
                        <TextField
                            disabled={topFileConvert}
                            id="track-nb_listens"
                            label="Max number of listens"
                            variant="outlined"
                            type="number"
                            value={music.nb_listens.value}
                            onChange={(e) =>
                                changeInfosTrack(index, "nb_listens", parseInt(e.target.value))
                            }
                            error={music.nb_listens.error}
                            helperText={music.nb_listens.helperText}
                        />
                    </div>
                ))}
                <Button
                    disabled={topFileConvert}
                    variant="contained"
                    color="primary"
                    onClick={handleAddFormTrack}
                >
                    Add track
                </Button>
            </div>
        </div>
    );
}

export default TracksAdder;
