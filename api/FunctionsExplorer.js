import pool from "./database/database.js";

// create function to get the first 50 albums with date of creation ulterior to the date retrive in the request, sorted by date of creation
export const getAlbums = (req, res) => {
    pool.query(
        `SELECT *,
            (SELECT json_agg(json_build_object(
                'gm_id', gm.gm_id,
                'gm_name_genre', gm.gm_name_genre))
            FROM public.genres_music gm WHERE gm.gm_id = ANY(a.a_styles)) as styles,
            (SELECT json_agg(json_build_object(
                't_id_album_track', t.t_id_album_track,
                't_title', t.t_title,
                't_file_path', t.t_file_path,
                't_file_name_mp3', t.t_file_name_mp3,
                't_nb_listen', t.t_nb_listen))
            FROM public.tracks t WHERE t.t_id_album = a.a_id) as tracks
        FROM public.albums a
        JOIN public.profiles p ON a.a_id_user = p.p_id_user
        ORDER BY a.a_date_create DESC
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

    pool.query(
        `SELECT *,
            (SELECT json_agg(json_build_object(
                'gm_id', gm.gm_id,
                'gm_name_genre', gm.gm_name_genre))
                FROM public.genres_music gm
                WHERE gm.gm_id = ANY(a.a_styles)) as styles
        FROM public.albums a 
        JOIN public.tracks t ON a.a_id = t.t_id_album
        WHERE t.t_id_album = $1;`,
        [id],
        (err, result) => {
            if (err) {
                console.error("Error executing SELECT:", err);
            } else {
                res.send(result.rows);
            }
        }
    );
};

// get all genres and country from database present in table albums (for genres) and table profiles (for country)
export const getStylesCountryInAlbums = (req, res) => {
    console.log("API /getStylesCountryInAlbums");

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
