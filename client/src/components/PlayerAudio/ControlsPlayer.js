import React, { useState, useEffect } from "react";
import DisplayPlaylist from "./DisplayPlaylist";

// icone
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import ProgressBar from "./ProgressBar";

function ControlsPlayer(props) {
    // play/pause
    const [isPlaying, setIsPlaying] = useState(true);

    // volume
    const [volume, setVolume] = useState(0.1);

    // progress bar and time
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [progress, setProgress] = useState(0);

    // play/pause
    useEffect(() => {
        if (isPlaying) {
            props.audioElement.current.play();
        } else {
            props.audioElement.current.pause();
        }
    }, [isPlaying, props.playlist, props.currentSongIndex]);

    // update volume
    useEffect(() => {
        props.audioElement.current.volume = volume;
    }, [props.audioElement, volume]);

    // update current time and progress bar
    useEffect(() => {
        props.audioElement.current.addEventListener("timeupdate", handleTimeUpdate);
        props.audioElement.current.addEventListener("durationchange", handleDurationChange);
        return () => {
            props.audioElement.current.removeEventListener("timeupdate", handleTimeUpdate);
            props.audioElement.current.removeEventListener("durationchange", handleDurationChange);
        };
    }, [currentTime, duration, props.audioElement]);

    // play/pause
    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    // next song
    const handleNext = () => {
        props.setCurrentSongIndex(
            props.currentSongIndex === props.playlist.length - 1 ? 0 : props.currentSongIndex + 1
        );
        setIsPlaying(true);
    };

    // previous song
    const handlePrev = () => {
        props.setCurrentSongIndex(
            props.currentSongIndex === 0 ? props.playlist.length - 1 : props.currentSongIndex - 1
        );
        setIsPlaying(true);
    };

    // change volume
    const handleVolumeChange = (event) => {
        setVolume(event.target.value);
    };

    // toggle display playlist
    const handleTogglePlaylist = () => {
        props.setShowPlaylist(!props.showPlaylist);
    };

    // select song in playlist
    const handleSelectSong = (index) => {
        props.setCurrentSongIndex(index);
        setIsPlaying(true);
    };

    // set current time and progress bar
    const handleTimeUpdate = (e) => {
        setCurrentTime(e.target.currentTime);
        setProgress(e.target.currentTime / e.target.duration);
    };

    // set duration of song
    const handleDurationChange = (e) => {
        setDuration(e.target.duration);
    };

    // change current time and progress bar when click on progress bar
    const handleSeek = (e) => {
        const newTime = e.target.value * props.audioElement.current.duration;
        setCurrentTime(newTime);
        setProgress(e.target.value);
        props.audioElement.current.currentTime = newTime;
    };

    return (
        <div>
            {isPlaying ? (
                <PauseCircleIcon onClick={handlePlayPause} />
            ) : (
                <PlayCircleIcon onClick={handlePlayPause} />
            )}
            {/* <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button> */}
            <SkipPreviousIcon onClick={handlePrev} />
            {/* <button onClick={handlePrev}>Previous</button> */}
            <SkipNextIcon onClick={handleNext} />
            {/* <button onClick={handleNext}>Next</button> */}
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={props.volume}
                onChange={handleVolumeChange}
            />

            {/* progress bar */}
            <ProgressBar
                progress={progress}
                handleSeek={handleSeek}
                currentTime={currentTime}
                duration={duration}
            />

            {/* Display playlist */}
            <QueueMusicIcon onClick={handleTogglePlaylist} />
            {/* <button onClick={handleTogglePlaylist}>
                {props.showPlaylist ? "Hide Playlist" : "Show Playlist"}
            </button> */}
            <DisplayPlaylist
                showPlaylist={props.showPlaylist}
                playlist={props.playlist}
                handleSelectSong={handleSelectSong}
            />
        </div>
    );
}

export default ControlsPlayer;
