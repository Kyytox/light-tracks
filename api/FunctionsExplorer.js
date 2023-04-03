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

export const getAlbumsAuthLatest = (req, res) => {
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
                't_nb_listen', t.t_nb_listen,
                'top_sale_album', EXISTS(SELECT 1 FROM public.sales s WHERE s.s_id_album = a.a_id AND s.s_id_user = $1),
                'top_sale_track', EXISTS(SELECT 1 FROM public.sales s WHERE s.s_id_track = t.t_id AND s.s_id_user = $1 AND s.s_top_sale_track = true),
                't_cpt_play',COALESCE(usp.usp_cpt_play, 0))) 
            FROM public.tracks t
            left join public.user_song_played usp on usp.usp_id_album = t.t_id_album and usp.usp_id_album_track = t.t_id_album_track
            WHERE t.t_id_album = a.a_id) as tracks,
            EXISTS(SELECT 1 FROM public.sales s WHERE s.s_id_album = a.a_id AND s.s_id_user = $1) AS top_sale_album,
            EXISTS(SELECT 1 FROM public.favoris f WHERE f.f_id_album = a.a_id AND f.f_id_user = $1) AS top_favoris_album
        FROM public.albums a
        JOIN public.profiles p ON a.a_id_user = p.p_id_user
        ORDER BY a.a_date_create DESC
        LIMIT 50;`,
        [req.query.idUser],
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

// getTracks for User connected for retrieve the tracks and if user as bought the album
export const getTracksAuth = (req, res) => {
    const id = req.query.id;
    const idUser = req.query.idUser;

    pool.query(
        `SELECT *, usp.usp_cpt_play as t_cpt_play,usp.usp_id_user as id_user,
        (SELECT json_agg(json_build_object(
            'gm_id', gm.gm_id,
            'gm_name_genre', gm.gm_name_genre))
            FROM public.genres_music gm
            WHERE gm.gm_id = ANY(a.a_styles)) as styles,
            EXISTS(SELECT 1 FROM public.sales s WHERE s.s_id_album = a.a_id AND s.s_id_user = $1 AND s.s_top_sale_album = true) AS top_sale_album,
            EXISTS(SELECT 1 FROM public.sales s WHERE s.s_id_track = t.t_id AND s.s_id_user = $1 AND s.s_top_sale_track = true) AS top_sale_track,
            EXISTS(SELECT 1 FROM public.favoris f WHERE f.f_id_album = a.a_id AND f.f_id_user = $1) AS top_favoris_album
        FROM public.albums a 
        JOIN public.tracks t ON a.a_id = t.t_id_album
        left join public.user_song_played usp on usp.usp_id_album = t.t_id_album and usp.usp_id_album_track = t.t_id_album_track
        WHERE t.t_id_album = $2;`,
        [idUser, id],
        (err, result) => {
            if (err) {
                console.error("Error executing SELECT:", err);
            } else {
                res.send(result.rows);
            }
        }
    );
};

// get Album where user of album is followed by user connected
export const getAlbumsAuthFollows = (req, res) => {
    const idUser = req.query.idUser;
    pool.query(
        `SELECT *,
            (SELECT json_agg(json_build_object(
                'gm_id', gm.gm_id,
                'gm_name_genre', gm.gm_name_genre))
            FROM genres_music gm WHERE gm.gm_id = ANY(a.a_styles)) as styles,
            (SELECT json_agg(json_build_object(
                't_id_album_track', t.t_id_album_track,
                't_title', t.t_title,
                't_file_path', t.t_file_path,
                't_file_name_mp3', t.t_file_name_mp3,
                't_nb_listen', t.t_nb_listen,
                'top_sale_album', EXISTS(SELECT 1 FROM public.sales s WHERE s.s_id_album = a.a_id AND s.s_id_user = $1),
                'top_sale_track', EXISTS(SELECT 1 FROM public.sales s WHERE s.s_id_track = t.t_id AND s.s_id_user = $1 AND s.s_top_sale_track = true),
                't_cpt_play',COALESCE(usp.usp_cpt_play, 0))) 
            FROM tracks t
            left join user_song_played usp on usp.usp_id_album = t.t_id_album and usp.usp_id_album_track = t.t_id_album_track
            WHERE t.t_id_album = a.a_id) as tracks,
            EXISTS(SELECT 1 FROM sales s WHERE s.s_id_album = a.a_id AND s.s_id_user = $1) AS top_sale_album,
            EXISTS(SELECT 1 FROM favoris f WHERE f.f_id_album = a.a_id AND f.f_id_user = $1) AS top_favoris_album
        FROM albums a
        JOIN profiles p ON a.a_id_user = p.p_id_user
        join follows f2 on a.a_id_user = f2.fo_id_user_follow 
        where f2.fo_id_user = $1
        ORDER BY a.a_date_create DESC
        LIMIT 50;`,
        [idUser],
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
