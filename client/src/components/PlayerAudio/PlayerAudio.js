import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import ControlsPlayer from "./ControlsPlayer";

function PlayerAudio(props) {
    const playlist = props.playlist;
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const audioElement = useRef(null);
    const [songPlayed, setSongPlayed] = useState(false);

    // determine which song to play
    const song = currentSongIndex >= playlist.length ? playlist[0] : playlist[currentSongIndex];
    console.log("song = ", song);

    // init currentSongIndex when we change playlist
    useEffect(() => {
        setCurrentSongIndex(0);
        setSongPlayed(false);
    }, [playlist]);

    return (
        <div>
            <audio
                ref={audioElement}
                src={`https://d3s5ffas0ydxtp.cloudfront.net/${song.t_file_path}/${song.t_file_name_mp3}`}
            />
            <h3>{song.t_title}</h3>
            <h4>{song.t_artist}</h4>

            <ControlsPlayer
                playlist={playlist}
                showPlaylist={showPlaylist}
                setShowPlaylist={setShowPlaylist}
                currentSongIndex={currentSongIndex}
                setCurrentSongIndex={setCurrentSongIndex}
                audioElement={audioElement}
                songPlayed={songPlayed}
                setSongPlayed={setSongPlayed}
            />
        </div>
    );
}

export default PlayerAudio;
