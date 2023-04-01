import pool from "./database/database.js";
import { deleteAlbumInS3 } from "./AwsS3.js";

// get infos of user by id
export const getProfileInfos = (req, res) => {
    pool.query(
        // `SELECT u_id, u_username, u_avatar, u_email, u_bio, u_code_country, u_name_country, gm_id, gm_name_genre
        // FROM public.users
        // LEFT JOIN public.genres_music sm ON gm_id = ANY(u_styles_music)
        // WHERE u_id = $1
        // GROUP BY u_id, u_username, u_avatar, u_email, u_bio, u_code_country, u_name_country, gm_id, gm_name_genre`,
        `SELECT *
        FROM public.profiles 
        LEFT JOIN public.genres_music sm ON gm_id = ANY(p_styles_music)
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
    // create text for update
    var textUpdate = "UPDATE public.profiles SET ";
    for (const [key, value] of Object.entries(req.body)) {
        if (key !== "id") {
            if (value !== "") {
                if (key === "styles_music") {
                    textUpdate += `p_${key} = ARRAY[${value}], `;
                } else {
                    textUpdate += `p_${key} = '${value}', `;
                }
            }
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
    pool.query(
        `SELECT DISTINCT ON (s.s_id_album) *, 
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
            WHERE t.t_id_album = a.a_id) as tracks
        FROM public.sales s 
        JOIN public.albums a ON s.s_id_album = a.a_id AND s.s_id_user = $1
        JOIN public.profiles p ON a.a_id_user = p.p_id_user
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

// get all favoris from user id
export const getFavoris = (req, res) => {
    // get all favoris from user id
    pool.query(
        `SELECT *, true as top_favoris_album,
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
            WHERE t.t_id_album = a.a_id) as tracks
        FROM public.favoris f 
        JOIN public.albums a ON f.f_id_album  = a.a_id AND f.f_id_user = $1
        JOIN public.profiles p ON a.a_id_user = p.p_id_user
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

// add favoris to the user
// this is my table favoris f_id_fav f_id_user f_id_album f_id_track f_date_fav
export const addFavoris = (req, res) => {
    // insert into bd in table favoris the id of the user, the id of the album, the id of the track, the date of the favoris
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

// delete favoris to the user
export const deleteFavoris = (req, res) => {
    // delete from bd in table favoris the id of the user, the id of the album, the id of the track
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

// get all sales and favoris from user id
export const getSalesFavoris = (req, res) => {
    // get all sales and favoris from user id
    pool.query(
        `SELECT res.album_id, res.date, res.source 
        FROM 
            (SELECT s.s_id_album AS album_id, s.s_date_sale AS date, 'sale' AS source
            FROM sales s 
            WHERE s.s_id_user = $1 
            UNION 
            SELECT f.f_id_album AS album_id, f.f_date_fav AS date, 'favoris' AS source
            FROM favoris f 
            WHERE f.f_id_user = $1 
        ) res 
        ORDER BY res.date DESC;`,
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

// get if the album id is in favoris or in sales
export const getAlbumInFavorisOrSales = (req, res) => {
    // get if the album id is in favoris or in sales
    pool.query(
        `SELECT res.source 
        FROM 
            (SELECT 'sale' AS source
            FROM sales s 
            WHERE s.s_id_user = $1 and s.s_id_album = $2
            UNION 
            SELECT 'favoris' AS source
            FROM favoris f 
            WHERE f.f_id_user = $1 and f.f_id_album = $2
        ) res 
        ORDER BY res.source DESC;`,
        [req.query.idUser, req.query.idAlbum],
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
