import pool from "./database/database.js";
import { deleteAlbumInS3 } from "./AwsS3.js";

// get infos of user by id
export const getProfileInfos = (req, res) => {
    console.log("API /getProfileInfos");

    pool.query(
        `SELECT u_id, u_username, u_avatar, u_email, u_bio, u_code_country, u_name_country, gm_id, gm_name_genre
        FROM public.users 
        LEFT JOIN public.genres_music sm ON gm_id = ANY(u_styles_music)
        WHERE u_id = $1
        GROUP BY u_id, u_username, u_avatar, u_email, u_bio, u_code_country, u_name_country, gm_id, gm_name_genre`,
        [req.query.idUser],
        (err, result) => {
            if (err) {
                console.error("Error executing SELECT:", err);
            } else {
                const data = {
                    avatar: result.rows[0].u_avatar,
                    email: result.rows[0].u_email,
                    bio: result.rows[0].u_bio,
                    code_country: result.rows[0].u_code_country,
                    country: result.rows[0].u_name_country,
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
    var textUpdate = "UPDATE public.users SET ";
    for (const [key, value] of Object.entries(req.body)) {
        if (key !== "id") {
            if (value !== "") {
                if (key === "styles_music") {
                    textUpdate += `u_${key} = ARRAY[${value}], `;
                } else {
                    textUpdate += `u_${key} = '${value}', `;
                }
            }
        }
    }

    textUpdate = textUpdate.slice(0, -2); // remove the last comma and space
    textUpdate += ` WHERE u_id = ${req.body.id}`;

    console.log("textUpdate", textUpdate);

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

    // this my table sales s_id_sale s_id_user; s_id_album; s_id_track; s_id_track_album; s_price; s_date_sale;
    // get all sales from user id , sorted by date of sale
    pool.query(
        // "SELECT * FROM public.sales, public.albums where s_id_user = $1 and albums.a_id = sales.s_id_album order by s_date_sale desc",
        `SELECT s_id_sale, s_id_user, s_id_album, s_id_track, s_date_sale, s_id_track_album  
            , a_id, a_id_user, a_id_album_user, a_title, a_artist, a_price
            , a_date_release, a_date_create, a_styles, a_description, a_cover, a_cover_path
            , u_id, u_username, u_avatar
            FROM public.sales, public.albums, public.users
            where s_id_user = $1
            and albums.a_id = sales.s_id_album 
            and albums.a_id_user = users.u_id
            order by s_date_sale desc;`,
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
    console.log("API /getFavoris");

    // get all favoris from user id
    pool.query(
        // "SELECT * FROM public.favoris, public.albums where f_id_user = $1 and albums.a_id = favoris.f_id_album order by f_date_fav desc",
        // [req.query.idUser],
        `SELECT f_id_fav, f_id_user, f_id_album, f_id_track, f_date_fav 
            , a_id, a_id_user, a_id_album_user, a_title, a_artist, a_price
            , a_date_release, a_date_create, a_styles, a_description, a_cover, a_cover_path
            , u_id, u_username, u_avatar
            FROM public.favoris, public.albums, public.users
            where f_id_user = 2 
            and albums.a_id = favoris.f_id_album 
            and albums.a_id_user = users.u_id
            order by f_date_fav desc`,
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
    console.log("API /getMyAlbums");

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
    console.log("API /addFavoris");
    console.log("req.body", req.body);

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
    console.log("API /deleteFavoris");
    console.log("req.body", req.body);

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
    console.log("API /getSalesFavoris");
    console.log("req.query.idUser", req.query.idUser);

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
    console.log("API /getAlbumInFavorisOrSales");
    console.log("req.query.idUser", req.query.idUser);
    console.log("req.query.idAlbum", req.query.idAlbum);

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
    console.log("API /deleteAlbum");
    console.log("req.body", req.body);

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
