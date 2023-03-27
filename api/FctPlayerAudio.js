import pool from "./database/database.js";
import { createObjectCsvWriter } from "csv-writer";

// // add in dataSongPlayed.csv the id of the user, the id of the album, the id of the track
// // when the user play a song
// export const cptSongPlayed = (req, res) => {
//     console.log("API /cptSongPlayed");

//     const dict = {
//         idUser: req.body.id_user,
//         idAlbum: req.body.t_id_album,
//         idTrack: req.body.t_id_album_track,
//     };

//     const csvWriter = createObjectCsvWriter({
//         path: "data/dataUserSongPlayed.csv",
//         header: [
//             { id: "idUser", title: "idUser" },
//             { id: "idAlbum", title: "idAlbum" },
//             { id: "idTrack", title: "idTrack" },
//         ],
//         append: true,
//     });

//     csvWriter
//         .writeRecords([dict])
//         .then(() => {
//             console.log("A new row has been added to the CSV file");
//         })
//         .catch((error) => {
//             console.error("An error occurred while writing to the CSV file:", error);
//         });
// };

// increment the number of times a song has been played
export const cptSongPlayed = (req, res) => {
    console.log("API /cptSongPlayed");
    console.log("req.body", req.body);

    pool.query(
        `INSERT INTO public.user_song_played (usp_id_user, usp_id_album, usp_id_album_track, usp_cpt_play)
        VALUES ($1, $2, $3, 1)
        ON CONFLICT (usp_id_user, usp_id_album, usp_id_album_track) 
        DO UPDATE SET usp_cpt_play = public.user_song_played.usp_cpt_play + 1;`,
        [req.body.id_user, req.body.t_id_album, req.body.t_id_album_track],
        (err, result) => {
            if (err) {
                console.error("Error executing UPDATE:", err);
            } else {
                res.send({ succes: "Song played" });
            }
        }
    );
};
