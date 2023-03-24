import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import ControlsPlayer from "./ControlsPlayer";
import WaveSurferPlayer from "./WaveSurfer";

function PlayerAudio(props) {
    const playlist = props.playlist;
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const audioElement = useRef(null);
    const song = currentSongIndex >= playlist.length ? playlist[0] : playlist[currentSongIndex];

    // reinit currentSongIndex when we change playlist
    useEffect(() => {
        setCurrentSongIndex(0);
    }, [playlist]);

    // const wavesurferRef = useRef();

    return (
        <div>
            {/* when we change Playlist the currentSongIndex is not init to 0 so the conditions is here 
            , the useEffect il launch after init audio element */}
            <audio
                ref={audioElement}
                src={`https://d3s5ffas0ydxtp.cloudfront.net/${song.t_file_path}/${song.t_file_name_mp3}`}
            />
            <h3>{song.t_title}</h3>
            <h4>{song.t_artist}</h4>

            <WaveSurferPlayer />

            <ControlsPlayer
                playlist={playlist}
                showPlaylist={showPlaylist}
                setShowPlaylist={setShowPlaylist}
                currentSongIndex={currentSongIndex}
                setCurrentSongIndex={setCurrentSongIndex}
                audioElement={audioElement}
            />
        </div>
    );
}

export default PlayerAudio;
