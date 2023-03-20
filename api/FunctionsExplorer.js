import pool from "./database/database.js";

// create function to get the first 50 albums with date of creation ulterior to the date retrive in the request, sorted by date of creation
export const getAlbums = (req, res) => {
    const date = new Date(req.query.date);

    pool.query(
        // "SELECT * FROM public.albums WHERE a_date_create < $1 ORDER BY a_date_create DESC LIMIT 50",
        // [date],
        `SELECT a_id, a_id_user, a_id_album_user, a_title, a_artist, a_price
            , a_date_release, a_date_create, a_styles, a_description, a_cover, a_cover_path
            , u_id, u_username, u_avatar
            FROM public.albums a
            JOIN public.users u
            ON a_id_user = u_id
            ORDER BY a_date_create DESC
            LIMIT 50;`,
        (err, result) => {
            if (err) {
                console.error("Error executing SELECT:", err);
            } else {
                res.send(result.rows);
            }
        }
    );
};

// create function to get thrack from album id retrive in the request
export const getTracks = (req, res) => {
    const id = req.query.id;

    pool.query("SELECT * FROM public.tracks WHERE t_id_album = $1", [id], (err, result) => {
        if (err) {
            console.error("Error executing SELECT:", err);
        } else {
            res.send(result.rows);
        }
    });
};
