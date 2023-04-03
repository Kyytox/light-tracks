import pool from "../Database/database.js";

// increment the number of times a song has been played
export const cptSongPlayed = (req, res) => {
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
