import React, { useState, useEffect, useRef, useCallback } from "react";
// import WaveSurfer from "wavesurfer.js";
import { WaveSurfer, WaveForm } from "wavesurfer-react";
import ControlsPlayer from "./ControlsPlayer";

function PlayerAudio(props) {
    const playlist = props.playlist;
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const audioElement = useRef(null);

    const wavesurferRef = useRef();

    const handleWSMount = useCallback((waveSurfer) => {
        wavesurferRef.current = waveSurfer;

        const urlMp3 =
            "https://api.twilio.com//2010-04-01/Accounts/AC25aa00521bfac6d667f13fec086072df/Recordings/RE6d44bc34911342ce03d6ad290b66580c.mp3";
        // "https://d3s5ffas0ydxtp.cloudfront.net/" +
        // playlist[currentSongIndex].t_file_path +
        // "/" +
        // playlist[currentSongIndex].t_file_name_mp3;

        if (wavesurferRef.current) {
            wavesurferRef.current.load(urlMp3);
            // wavesurferRef.current.load(urlMp3, null, {
            //     xhr: {
            //         cache: "default",
            //         mode: "no-cors",
            //         method: "GET",
            //         credentials: "include",
            //         headers: [
            //             { key: "Access-Control-Allow-Origin", value: "*" },
            //             { key: "cache-control", value: "no-cache" },
            //             { key: "pragma", value: "no-cache" },
            //             { key: "expires", value: "0" },
            //         ],
            //     },
            // });

            wavesurferRef.current.on("ready", () => {
                console.log("WaveSurfer is ready");
            });

            wavesurferRef.current.on("loading", (data) => {
                console.log("loading --> ", data);
            });

            if (window) {
                console.log("window.surferidze = wavesurferRef.current");
                window.surferidze = wavesurferRef.current;
            }
        }
    }, []);

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

            {/* <div id="waveform"></div> */}
            <WaveSurfer onMount={handleWSMount}>
                <WaveForm id="waveform" cursorColor="transparent"></WaveForm>
            </WaveSurfer>

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
