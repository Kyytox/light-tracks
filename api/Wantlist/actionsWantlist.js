//
// database
import pool from "../Database/database.js";

// get all albums in wantlist
export const getWantlist = (req, res) => {
    pool.query(
        `SELECT *, true as top_favoris_album,
            (SELECT json_agg(json_build_object(
                'p_id_user', p.p_id_user,
                'p_username', p.p_username,
                'p_avatar', p.p_avatar,
                'p_code_country', p.p_code_country,
                'p_name_country', p.p_name_country))
            FROM profiles p WHERE a.a_id_user = p.p_id_user) as profile_artist,
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
                'top_sale_album', EXISTS(SELECT 1 FROM public.sales s WHERE s.s_id_album = a.a_id AND s.s_id_user = $1 and s.s_top_sale_album = true),
                'top_sale_track', EXISTS(SELECT 1 FROM public.sales s WHERE s.s_id_track = t.t_id AND s.s_id_user = $1 AND s.s_top_sale_track = true),
                't_cpt_play',COALESCE(usp.usp_cpt_play, 0)))
            FROM public.tracks t 
            left join public.user_song_played usp on usp.usp_id_album = t.t_id_album and usp.usp_id_album_track = t.t_id_album_track
            WHERE t.t_id_album = a.a_id) as tracks,
            EXISTS(SELECT 1 FROM follows fo  WHERE fo.fo_id_user = $1 AND fo.fo_id_user_follow = a.a_id_user) AS top_follow_artist
        FROM public.favoris f 
        JOIN public.albums a ON f.f_id_album  = a.a_id AND f.f_id_user = $1
        ORDER BY f.f_date_fav DESC
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

// add album to wantlist of the user
export const addWantlist = (req, res) => {
    pool.query(
        "INSERT INTO public.favoris (f_id_user, f_id_album, f_id_track, f_date_fav) VALUES ($1,$2,$3,$4)",
        [req.body.idUser, req.body.idAlbum, req.body.idTrack, new Date()],
        (err, result) => {
            if (err) {
                console.error("Error executing INSERT INTO:", err);
            } else {
                res.send({ succes: "Album added to favoris" });
            }
        }
    );
};

// delete album from wantlist of the user
export const deleteWantlist = (req, res) => {
    pool.query(
        "DELETE FROM public.favoris WHERE f_id_user = $1 and f_id_album = $2 ",
        [req.body.idUser, req.body.idAlbum],
        (err, result) => {
            if (err) {
                console.error("Error executing DELETE FROM:", err);
            } else {
                res.send({ succes: "Album deleted from favoris" });
            }
        }
    );
};
