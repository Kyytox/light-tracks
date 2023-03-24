import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import ControlsPlayer from "./ControlsPlayer";
import WaveSurferPlayer from "./WaveSurfer";

function PlayerAudio(props) {
    const playlist = props.playlist;
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const audioElement = useRef(null);

    console.log("PlayerAudio.js: currentSongIndex = ", currentSongIndex);

    // reinit currentSongIndex when we change playlist
    useEffect(() => {
        console.log("PlayerAudio.js: useEffect currentSongIndex = ", currentSongIndex);
        setCurrentSongIndex(0);
    }, [playlist]);

    // const wavesurferRef = useRef();

    return (
        <div>
            {/* when we change Playlist the currentSongIndex is not init to 0 so the conditions is here 
            , the useEffect il launch after init audio element */}
            {currentSongIndex >= playlist.length ? (
                <div>
                    <audio
                        ref={audioElement}
                        src={
                            "https://d3s5ffas0ydxtp.cloudfront.net/" +
                            playlist[0].t_file_path +
                            "/" +
                            playlist[0].t_file_name_mp3
                        }
                    />
                    <h3>{playlist[0].t_title}</h3>
                    <h4>{playlist[0].t_artist}</h4>
                </div>
            ) : (
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
                </div>
            )}

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
