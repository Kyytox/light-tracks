import React, { useState } from "react";
import { backendUrl } from "./Globals/GlobalVariables";
import axios from "axios";
import MainExplorer from "./components/Explorer/MainExplorer";
import "./App.css";

function Main() {
    const [audioUrl, setAudioUrl] = useState("");

    // recup de l'url signed de
    const handleClick = async () => {
        try {
            const response = await axios.post(backendUrl + "/getAudioFileStream", {
                // responseType: "blob",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
                data: "uploads/2/4/tracks/track-2-4-2.flac",
            });
            console.log("response", response.data);
            setAudioUrl(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    console.log("audioUrl", audioUrl);
    return (
        <div>
            <MainExplorer />
        </div>
    );
}

export default Main;
