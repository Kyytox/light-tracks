import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import ControlsPlayer from "./ControlsPlayer";
// import WaveSurferPlayer from "./WaveSurfer";

import { WaveSurfer, WaveForm } from "wavesurfer-react";

function PlayerAudio(props) {
    const playlist = props.playlist;
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const audioElement = useRef(null);

    // determine which song to play
    const song = currentSongIndex >= playlist.length ? playlist[0] : playlist[currentSongIndex];

    // reinit currentSongIndex when we change playlist
    useEffect(() => {
        setCurrentSongIndex(0);
    }, [playlist]);

    // const wavesurferRef = useRef();

    // const handleWSMount = useCallback((waveSurfer) => {
    //     wavesurferRef.current = waveSurfer;

    //     const urlMp3 =
    //         // "https://api.twilio.com//2010-04-01/Accounts/AC25aa00521bfac6d667f13fec086072df/Recordings/RE6d44bc34911342ce03d6ad290b66580c.mp3";
    //         "https://d3s5ffas0ydxtp.cloudfront.net/" +
    //         playlist[currentSongIndex].t_file_path +
    //         "/" +
    //         playlist[currentSongIndex].t_file_name_mp3;

    //     if (wavesurferRef.current) {
    //         // wavesurferRef.current.load(urlMp3);
    //         wavesurferRef.current.load(urlMp3, null, {
    //             xhr: {
    //                 cache: "default",
    //                 headers: [
    //                     { key: "Access-Control-Allow-Headers", value: "Content-Type" },
    //                     { key: "Access-Control-Allow-Origin", value: "*" },
    //                     { key: "Access-Control-Allow-Methods", value: "OPTIONS,POST,GET" },
    //                 ],
    //             },
    //         });

    //         wavesurferRef.current.on("ready", () => {
    //             console.log("WaveSurfer is ready");
    //         });

    //         wavesurferRef.current.on("loading", (data) => {
    //             console.log("loading --> ", data);
    //         });

    //         if (window) {
    //             console.log("window.surferidze = wavesurferRef.current");
    //             window.surferidze = wavesurferRef.current;
    //         }
    //     }
    // }, []);

    return (
        <div>
            <audio
                ref={audioElement}
                src={`https://d3s5ffas0ydxtp.cloudfront.net/${song.t_file_path}/${song.t_file_name_mp3}`}
            />
            <h3>{song.t_title}</h3>
            <h4>{song.t_artist}</h4>

            {/* <WaveSurferPlayer audioElement={audioElement} /> */}
            {/* <WaveSurfer onMount={handleWSMount}>
                <WaveForm id="waveform" cursorColor="transparent"></WaveForm>
            </WaveSurfer> */}

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
