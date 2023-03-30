import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";
import { Checkbox, FormControlLabel } from "@mui/material";

function TracksAdder({
    lstTrack,
    fileInputRef,
    onTrackChange,
    handleAddFormTrack,
    handleAddTrack,
    handleFileDelete,
    topFileConvert,
    topCalculatePriceAuto,
    setTopCalculatePriceAuto,
}) {
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
                            onChange={(e) => onTrackChange(index, "title", e.target.value)}
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
                            onChange={(e) => onTrackChange(index, "artist", e.target.value)}
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
                            onChange={(e) => handleAddTrack(index, "file", e.target.files[0])}
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
                                    onClick={(e) => handleFileDelete(index)}
                                >
                                    X
                                </Button>
                            </>
                        )}

                        {/* Price */}
                        <TextField
                            required
                            disabled={topFileConvert}
                            id="track-price"
                            variant="outlined"
                            label="price"
                            value={music.price.value}
                            type="number"
                            onChange={(e) => onTrackChange(index, "price", e.target.value)}
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
                            onChange={(e) => onTrackChange(index, "date_release", e.target.value)}
                            // error={music.date_release.error}
                            // helperText={music.date_release.helperText || "leave blank to put the same Album date realease"}
                        />
                        {/* Lyrics */}
                        <TextField
                            disabled={topFileConvert}
                            id="track-lyrics"
                            label="lyrics"
                            variant="outlined"
                            value={lstTrack.Lyrics}
                            onChange={(e) => onTrackChange(index, "lyrics", e.target.value)}
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
                                onTrackChange(index, "nb_listens", parseInt(e.target.value))
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
