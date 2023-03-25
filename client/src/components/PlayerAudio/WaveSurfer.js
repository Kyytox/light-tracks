// import React, {useCallback} from "react";
// import { WaveSurfer, WaveForm } from "wavesurfer-react";

// function WaveSurferPlayer({ audioElement }) {
//     const wavesurferRef = audioElement

//     const handleWSMount = useCallback((waveSurfer) => {
//         wavesurferRef.current = waveSurfer;

//         const urlMp3 =
//             // "https://api.twilio.com//2010-04-01/Accounts/AC25aa00521bfac6d667f13fec086072df/Recordings/RE6d44bc34911342ce03d6ad290b66580c.mp3";
//             "https://d3s5ffas0ydxtp.cloudfront.net/" +
//             playlist[currentSongIndex].t_file_path +
//             "/" +
//             playlist[currentSongIndex].t_file_name_mp3;

//         if (wavesurferRef.current) {
//             wavesurferRef.current.load(urlMp3);

//             wavesurferRef.current.on("ready", () => {
//                 console.log("WaveSurfer is ready");
//             });

//             wavesurferRef.current.on("loading", (data) => {
//                 console.log("loading --> ", data);
//             });

//             if (window) {
//                 console.log("window.surferidze = wavesurferRef.current");
//                 window.surferidze = wavesurferRef.current;
//             }
//         }
//     }, []);

//     return (
//         <div>
//             {/* <div id="waveform"></div> */}
//             <WaveSurfer onMount={handleWSMount}>
//                 <WaveForm id="waveform" cursorColor="transparent"></WaveForm>
//             </WaveSurfer>
//         </div>
//     );
// }

// export default WaveSurferPlayer;
