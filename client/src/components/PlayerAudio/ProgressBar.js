import React from "react";

function ProgressBar(props) {
    // format time of progress bar
    const formatTime = (seconds) => {
        if (isNaN(seconds)) {
            return "-:--";
        }
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getSeconds().toString().padStart(2, "0");
        if (hh) {
            return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
        }
        return `${mm}:${ss}`;
    };

    return (
        <div>
            {/* progress bar */}
            <div className="progress-container">
                <input
                    type="range"
                    className="progress-bar"
                    value={props.progress || 0}
                    min="0"
                    max="1"
                    step="0.01"
                    onChange={props.handleSeek}
                />
            </div>
            <div className="time-container">
                <span className="current-time">{formatTime(props.currentTime)}</span>
                --
                <span className="duration">{formatTime(props.duration)}</span>
            </div>
        </div>
    );
}

export default ProgressBar;
