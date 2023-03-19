import pool from "./database/database.js";

// get all genres from database in table genres_music
export const getGenres = (req, res) => {
    console.log("API /getGenres");

    pool.query("SELECT * FROM public.genres_music order by gm_name_genre", [], (err, result) => {
        if (err) {
            console.error("Error executing SELECT:", err);
        } else {
            res.send(result.rows);
        }
    });
};
