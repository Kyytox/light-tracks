import pool from "../Database/database.js";

//  buy Track
export const buyTrack = (req, res) => {
    console.log("API /buyTrack");
    console.log("req.body", req.body);

    // retrive the count of tracks of the album bought by the user and retrive th count of tracks of the album, in one request
    pool.query(
        `SELECT count(*) AS count_track_sales,
        (SELECT count(*) FROM tracks WHERE t_id_album = $2) AS count_track_album_total, 
        (SELECT a_price FROM albums WHERE a_id = $2) AS album_price
        FROM tracks t
        INNER JOIN sales s ON s.s_id_track = t.t_id
        WHERE s.s_id_user = $1 AND t.t_id_album = $2`,
        [req.body.idUser, req.body.idAlbum],
        (err, result) => {
            if (err) {
                console.error("Error executing SELECT:", err);
            } else {
                console.log("result.rows", result.rows);
                //
                // if count of tracks bought by the user is equal to the count of tracks of the album - 1
                // insert a new sale in table sales with top_sale_album = true and delete all tracks of the album from table sales
                if (
                    parseInt(result.rows[0].count_track_sales) ===
                    parseInt(result.rows[0].count_track_album_total) - 1
                ) {
                    pool.query(
                        `INSERT INTO public.sales (s_id_user, s_id_album, s_id_track, s_id_track_album, s_price, s_date_sale, s_top_sale_album, s_top_sale_track) 
                        VALUES ($1, $2, $3, $4, $5, $6,$7,$8)`,
                        [req.body.idUser, req.body.idAlbum, 0, 0, result.rows[0].album_price, new Date(), true, false],
                        (err, result) => {
                            if (err) {
                                console.error("Error executing INSERT INTO:", err);
                            } else {
                                //
                                // delete all tracks of the album from table sales
                                console.log("Last track bought so delete all tracks of the album from table sales");
                                pool.query(
                                    "DELETE FROM public.sales WHERE s_id_user = $1 AND s_id_album = $2 AND s_top_sale_track = true",
                                    [req.body.idUser, req.body.idAlbum],
                                    (err, result) => {
                                        if (err) {
                                            console.error("Error executing DELETE FROM:", err);
                                        } else {
                                            res.send({
                                                succes: "Track delete and Album bought",
                                            });
                                        }
                                    }
                                );
                            }
                        }
                    );
                } else {
                    pool.query(
                        `INSERT INTO public.sales (s_id_user, s_id_album, s_id_track, s_id_track_album, s_price, s_date_sale, s_top_sale_album, s_top_sale_track)
                    VALUES ($1, $2, $3, $4, $5, $6,$7,$8)`,
                        [
                            req.body.idUser,
                            req.body.idAlbum,
                            req.body.idTrack,
                            req.body.idTrackAlbum,
                            req.body.price,
                            new Date(),
                            false,
                            true,
                        ],
                        (err, result) => {
                            if (err) {
                                console.error("Error executing INSERT INTO:", err);
                                res.send({ succes: false, message: "Track not bought" });
                            } else {
                                console.log("Track bought");
                                res.send({ succes: true, message: "Track bought" });
                            }
                        }
                    );
                }
            }
        }
    );
};
