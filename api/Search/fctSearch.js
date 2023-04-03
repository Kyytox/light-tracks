//
// database
import pool from "../Database/database.js";

//
// get all genres and country from database present in table albums (for genres) and table profiles (for country)
export const getStylesCountryInAlbums = (req, res) => {
    pool.query(
        `SELECT p.p_code_country, p.p_name_country, gm.gm_id, gm.gm_name_genre
        FROM public.albums a
        JOIN public.profiles p ON a.a_id_user = p.p_id_user
        JOIN public.genres_music gm ON gm.gm_id = ANY(a.a_styles);`,
        [],
        (err, result) => {
            if (err) {
                console.error("Error executing SELECT:", err);
            } else {
                res.send(result.rows);
            }
        }
    );
};
