import React, { useState, useEffect, useRef } from "react";
import ControlsPlayer from "./ControlsPlayer";

function PlayerAudio(props) {
    const playlist = props.playlist;
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const audioElement = useRef(null);

    return (
        <div>
            <audio
                ref={audioElement}
                src={
                    "https://d3s5ffas0ydxtp.cloudfront.net/" +
                    playlist[currentSongIndex].t_file_path +
                    "/" +
                    playlist[currentSongIndex].t_file_name_mp3
                }
            />
            <h3>{playlist[currentSongIndex].t_title}</h3>
            <h4>{playlist[currentSongIndex].t_artist}</h4>
            <ControlsPlayer
                setCurrentSongIndex={setCurrentSongIndex}
                setShowPlaylist={setShowPlaylist}
                playlist={playlist}
                currentSongIndex={currentSongIndex}
                showPlaylist={showPlaylist}
                audioElement={audioElement}
            />
        </div>
    );
}

export default PlayerAudio;
