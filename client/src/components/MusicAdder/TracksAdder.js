import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";

function TracksAdder({ lstTrack, fileInputRef, onTrackChange, handleAdd, handleFileDelete }) {
    return (
        <div>
            <h1>Add Tracks</h1>
            <div>
                {lstTrack.map((music, index) => (
                    <div key={index}>
                        {/* title */}
                        <TextField
                            required
                            id="track-title"
                            label="title"
                            variant="outlined"
                            value={music.title.value}
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => onTrackChange(index, "title", e.target.value)}
                            error={music.title.error}
                            helperText={music.title.msg || "leave blank to put the same name of upload track"}
                        />
                        {/* Artist */}
                        <TextField
                            id="track-artist"
                            label="artist"
                            variant="outlined"
                            value={music.artist.value}
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => onTrackChange(index, "artist", e.target.value)}
                            error={music.artist.error}
                            helperText={music.artist.msg || "leave blank to put the same Album artist"}
                        />
                        {/* file */}
                        <Button
                            id="track-file"
                            label="file"
                            variant="contained"
                            component="label"
                            onChange={(e) => onTrackChange(index, "file", e.target.files[0])}
                            color={(music.fileOrigin.error && "error") || "primary"}
                        >
                            Upload file track .mp3, .wav, .flac
                            <input type="file" accept=".mp3, .wav, .flac" ref={fileInputRef} hidden />
                        </Button>
                        <FormHelperText error={music.fileOrigin.error} color="error">
                            {music.fileOrigin.msg}
                        </FormHelperText>
                        {music.fileOrigin.value && (
                            <>
                                <p>
                                    {music.fileOrigin.value.name} {(music.fileOrigin.value.size / (1024 * 1024)).toFixed(2)} Mo
                                </p>
                                <Button variant="contained" color="secondary" onClick={(e) => handleFileDelete(index, "file")}>
                                    X
                                </Button>
                            </>
                        )}
                        {/* Price */}
                        <TextField
                            required
                            id="track-price"
                            variant="outlined"
                            label="price"
                            value={lstTrack.price}
                            type="number"
                            onChange={(e) => onTrackChange(index, "price", e.target.value)}
                            error={music.price.error}
                            helperText={music.price.msg}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                        {/* Date */}
                        <TextField
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
                            // helperText={music.date_release.msg || "leave blank to put the same Album date realease"}
                        />
                        {/* Lyrics */}
                        <TextField id="track-lyrics" label="lyrics" variant="outlined" value={lstTrack.Lyrics} onChange={(e) => onTrackChange(index, "lyrics", e.target.value)} />
                        {/* nb listens */}
                        <TextField
                            id="track-nb_listens"
                            label="Max number of listens"
                            variant="outlined"
                            type="number"
                            value={music.nb_listens.value}
                            onChange={(e) => onTrackChange(index, "nb_listens", parseInt(e.target.value))}
                            error={music.nb_listens.error}
                            helperText={music.nb_listens.msg}
                        />
                    </div>
                ))}
                <Button variant="contained" color="primary" onClick={handleAdd}>
                    Ajouter une musique
                </Button>
            </div>
        </div>
    );
}

export default TracksAdder;
