//
// database
import pool from "../Database/database.js";

//
// get search results from database with search, styles and country
export const getSearchAuth = (req, res) => {
    const idUser = req.query.idUser;
    const search = req.query.search.toLowerCase();
    const styles = req.query.styles?.map((item) => item.id) ?? [];
    const tags = req.query.tags?.map((item) => `'${item}'`) ?? [];
    const countries = req.query.country?.map((item) => item.c_code_country) ?? [];

    var reqSQL = `SELECT *,
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
                        'top_sale_album', EXISTS(SELECT 1 FROM public.sales s WHERE s.s_id_album = a.a_id AND s.s_id_user = ${idUser} AND s.s_top_sale_album = true),
                        'top_sale_track', EXISTS(SELECT 1 FROM public.sales s WHERE s.s_id_track = t.t_id AND s.s_id_user = ${idUser} AND s.s_top_sale_track = true),
                        't_cpt_play',COALESCE(usp.usp_cpt_play, 0)))
                    FROM public.tracks t 
                    left join public.user_song_played usp on usp.usp_id_album = t.t_id_album and usp.usp_id_album_track = t.t_id_album_track
                    WHERE t.t_id_album = a.a_id) as tracks
                    FROM public.albums a
                    JOIN public.profiles p ON a.a_id_user = p.p_id_user`;

    // oint tables profiles and countries
    if (countries.length > 0) {
        const reqCountry = ` JOIN profiles p on a.a_id_user = p.p_id_user JOIN countries c on c.c_code_country = p.p_code_country`;
        reqSQL += reqCountry;
    }

    reqSQL += " where";

    // add stylesin where clause
    if (styles.length > 0) {
        const reqStyles = ` a.a_styles && ARRAY[${styles}]`;
        reqSQL += reqStyles;
    }

    // add search in where clause
    if (search) {
        if (styles.length > 0) {
            reqSQL += " or";
        }
        const reqSearch = ` (lower(a.a_title) like '%${search}%' or lower(a.a_artist) like '%${search}%')`;
        reqSQL += reqSearch;
    }

    // add tags in where clause
    if (tags) {
        if (styles.length > 0 || search) {
            reqSQL += " or";
        }
        const reqTags = ` a.a_tags && ARRAY[${tags}]::varchar[]`;
        reqSQL += reqTags;
    }

    // add country in where clause
    if (countries.length > 0) {
        if (styles.length > 0 || search || tags) {
            reqSQL += " or";
        }
        const countryValues = countries.map((item) => `'${item}'`);
        const reqCountry = ` c.c_code_country = ANY(ARRAY[${countryValues}]::text[])`;
        reqSQL += reqCountry;
    }

    console.log("reqSQL", reqSQL);

    // call database
    pool.query(reqSQL, (err, result) => {
        if (err) {
            console.error("Error executing SELECT:", err);
        } else {
            res.send(result.rows);
        }
    });
};
