import pool from "./database/database.js";

export const buyAlbum = (req, res) => {
    console.log("API /buyAlbum");
    console.log("req.body", req.body);

    pool.query(
        "INSERT INTO public.sales (s_id_user, s_id_album, s_id_track, s_id_track_album, s_price, s_date_sale) VALUES ($1,$2,$3,$4,$5,$6)",
        [req.body.idUser, req.body.idAlbum, req.body.idTrack, req.body.idTrackAlbum, req.body.price, new Date()],
        (err, result) => {
            if (err) {
                console.error("Error executing INSERT INTO:", err);
            } else {
                // delete album from table Favoris if it exists
                pool.query(
                    "DELETE FROM public.favoris WHERE f_id_user = $1 AND f_id_album = $2",
                    [req.body.idUser, req.body.idAlbum],
                    (err, result) => {
                        if (err) {
                            console.error("Error executing DELETE FROM:", err);
                        } else {
                            res.send({ succes: "Album bought" });
                        }
                    }
                );
            }
        }
    );
};
