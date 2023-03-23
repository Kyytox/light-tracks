import React, { useState, useEffect, useRef } from "react";

function DisplayPlaylist(props) {
    return (
        <div>
            {props.showPlaylist && (
                <ul>
                    {props.playlist.map((song, index) => (
                        <li key={index} onClick={() => props.handleSelectSong(index)}>
                            {song.t_title} - {song.t_artist}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DisplayPlaylist;
