import React, { useState, useEffect } from "react";
import DisplayPlaylist from "./DisplayPlaylist";

function ControlsPlayer(props) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);

    useEffect(() => {
        if (isPlaying) {
            props.audioElement.current.play();
        } else {
            props.audioElement.current.pause();
        }
    }, [isPlaying, props.audioElement, props.currentSongIndex]);

    useEffect(() => {
        props.audioElement.current.volume = volume;
    }, [props.audioElement, volume]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleNext = () => {
        props.setCurrentSongIndex(
            props.currentSongIndex === props.playlist.length - 1 ? 0 : props.currentSongIndex + 1
        );
        setIsPlaying(true);
    };

    const handlePrev = () => {
        props.setCurrentSongIndex(
            props.currentSongIndex === 0 ? props.playlist.length - 1 : props.currentSongIndex - 1
        );
        setIsPlaying(true);
    };

    const handleVolumeChange = (event) => {
        setVolume(event.target.value);
    };

    const handleTogglePlaylist = () => {
        props.setShowPlaylist(!props.showPlaylist);
    };

    const handleSelectSong = (index) => {
        props.setCurrentSongIndex(index);
        setIsPlaying(true);
    };

    return (
        <div>
            <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
            <button onClick={handlePrev}>Previous</button>
            <button onClick={handleNext}>Next</button>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={props.volume}
                onChange={handleVolumeChange}
            />
            <button onClick={handleTogglePlaylist}>
                {props.showPlaylist ? "Hide Playlist" : "Show Playlist"}
            </button>
            <DisplayPlaylist
                showPlaylist={props.showPlaylist}
                playlist={props.playlist}
                handleSelectSong={handleSelectSong}
            />
        </div>
    );
}

export default ControlsPlayer;
