import React, { useState, useEffect } from "react";
import DisplayPlaylist from "./DisplayPlaylist";

// icone
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import ProgressBar from "./ProgressBar";
import { postAxiosReq } from "../../Services/AxiosPost";

function ControlsPlayer(props) {
    // play/pause
    const [isPlaying, setIsPlaying] = useState(false);

    // volume
    const [volume, setVolume] = useState(0.01);

    // progress bar and time
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [progress, setProgress] = useState(0);

    // play/pause
    useEffect(() => {
        if (isPlaying) {
            // verif if song is available for listening (t_nb_listen)
            if (
                props.playlist[props.currentSongIndex].t_cpt_play >= props.playlist[props.currentSongIndex].t_nb_listen
            ) {
                props.audioElement.current.pause();
                alert("This song is not available anymore");
            } else {
                props.audioElement.current.play();
            }
        } else {
            props.audioElement.current.pause();
        }
    }, [isPlaying, props.playlist, props.currentSongIndex]);

    // update volume
    useEffect(() => {
        props.audioElement.current.volume = volume;
    }, [props.audioElement, volume]);

    // update current time and progress bar and increment song played to server
    useEffect(() => {
        // console.log("ControlsPlayer useEffect currentTime = ", currentTime);

        if (props.playlist[props.currentSongIndex].top_sale_album === false) {
            if (props.playlist[props.currentSongIndex].top_sale_track === false) {
                // send song played to server after 5 seconds
                if (currentTime > 5 && !props.songPlayed && props.playlist[props.currentSongIndex].id_user) {
                    props.setSongPlayed(true);
                    console.log("ControlsPlayer -- /cptSongPlayed");
                    const data = props.playlist[props.currentSongIndex];
                    const response = postAxiosReq("/cptSongPlayed", data);
                    response.then((data) => {
                        console.log("ControlsPlayer useEffect data = ", data);
                    });
                }
            }
        }

        if (props.audioElement.current) {
            // set current time and progress bar
            const handleTimeUpdate = (e) => {
                setCurrentTime(e.target.currentTime);
                setProgress(e.target.currentTime / e.target.duration);
            };

            // set duration of song
            const handleDurationChange = (e) => {
                setDuration(e.target.duration);
            };

            // add event listener
            props.audioElement.current.addEventListener("timeupdate", handleTimeUpdate);
            props.audioElement.current.addEventListener("durationchange", handleDurationChange);
        }
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
        props.setSongPlayed(false);
    };

    // previous song
    const handlePrev = () => {
        props.setCurrentSongIndex(
            props.currentSongIndex === 0 ? props.playlist.length - 1 : props.currentSongIndex - 1
        );
        setIsPlaying(true);
        props.setSongPlayed(false);
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
        props.setSongPlayed(false);
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
            {isPlaying ? <PauseCircleIcon onClick={handlePlayPause} /> : <PlayCircleIcon onClick={handlePlayPause} />}
            <SkipPreviousIcon onClick={handlePrev} />
            <SkipNextIcon onClick={handleNext} />
            <input type="range" min="0" max="1" step="0.01" value={props.volume} onChange={handleVolumeChange} />

            {/* progress bar */}
            <ProgressBar progress={progress} handleSeek={handleSeek} currentTime={currentTime} duration={duration} />

            {/* Display playlist */}
            <QueueMusicIcon onClick={handleTogglePlaylist} />

            <DisplayPlaylist
                showPlaylist={props.showPlaylist}
                playlist={props.playlist}
                handleSelectSong={handleSelectSong}
            />
        </div>
    );
}

export default ControlsPlayer;
