import pool from "../Database/database.js";
import { deleteAlbumInS3 } from "../AwsS3/deleteObjects.js";

// get infos of user by id
export const getProfileInfos = (req, res) => {
    pool.query(
        `SELECT *
        FROM profiles 
        LEFT JOIN genres_music sm ON gm_id = ANY(p_styles_music)
        LEFT JOIN currencies cu on cu.cu_code_currency = p_code_currency  
        WHERE p_id_user = $1`,
        [req.query.idUser],
        (err, result) => {
            if (err) {
                console.error("Error executing SELECT:", err);
            } else {
                const data = {
                    avatar: result.rows[0].p_avatar,
                    email: result.rows[0].p_email,
                    bio: result.rows[0].p_bio,
                    code_country: result.rows[0].p_code_country,
                    country: result.rows[0].p_name_country,
                    code_currency: result.rows[0].p_code_currency,
                    currency: result.rows[0].cu_name_currency,
                    styles: result.rows.map((row) => {
                        return {
                            id: row.gm_id,
                            name: row.gm_name_genre,
                        };
                    }),
                };
                res.send(data);
            }
        }
    );
};

// update profile infos
export const updateProfileInfos = (req, res) => {
    console.log("API /updateProfileInfos");
    console.log("req.body", req.body);
    // create text for update
    var textUpdate = "UPDATE public.profiles SET ";
    for (const [key, value] of Object.entries(req.body)) {
        if (key !== "id") {
            // if (value !== "") {
            if (key === "styles_music") {
                textUpdate += `p_${key} = ARRAY[${value === 0 ? null : value}], `;
            } else {
                textUpdate += `p_${key} = '${value}', `;
            }
            // }
        }
    }

    textUpdate = textUpdate.slice(0, -2); // remove the last comma and space
    textUpdate += ` WHERE p_id_user = ${req.body.id}`;

    // update user infos
    pool.query(textUpdate, [], (err, result) => {
        if (err) {
            console.error("Error executing UPDATE:", err);
        } else {
            res.send({ succes: "User updated" });
        }
    });
};

export const getCollection = (req, res) => {
    console.log("API /getCollection");
    pool.query(
        `SELECT DISTINCT ON (s.s_id_album) *,
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
            EXISTS(SELECT 1 FROM public.sales s WHERE s.s_id_album = a.a_id AND s.s_id_user = $1 AND s.s_top_sale_album = true) AS top_sale_album,
            EXISTS(SELECT 1 FROM follows fo  WHERE fo.fo_id_user = $1 AND fo.fo_id_user_follow = a.a_id_user) AS top_follow_artist
        FROM public.sales s 
        JOIN public.albums a ON s.s_id_album = a.a_id AND s.s_id_user = $1
        ORDER BY s.s_id_album, s.s_date_sale DESC
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

// get all albums created by user id
export const getMyAlbums = (req, res) => {
    // get all albums created by user id
    pool.query(
        "SELECT * FROM public.albums where a_id_user = $1 order by a_date_create desc",
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

// delete album from the user id with album id
export const deleteAlbum = async (req, res) => {
    // delete img and folder album from S3
    await deleteAlbumInS3(req);
    console.log("deleteAlbumInS3-----------");

    // delete from bd in table albums the id of the user, the id of the album
    pool.query(
        "DELETE FROM public.albums WHERE a_id_user = $1 and a_id = $2 ",
        [req.body.idUser, req.body.idAlbum],
        (err, result) => {
            if (err) {
                console.error("Error executing DELETE FROM:", err);
            } else {
                res.send({ succes: "Album deleted from user" });
            }
        }
    );
};
