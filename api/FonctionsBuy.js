import pool from "./database/database.js";

export const buyAlbum = (req, res) => {
    console.log("API /buyAlbum");
    console.log("req.body", req.body);

    // this my table sales s_id_sale s_id_user; s_id_album; s_id_track; s_id_track_album; s_price; s_date_sale;
    // insert into bd in table sales the id of the user, the id of the album, the id of the track, the id of the track in the album, the price of the track, the date of the sale
    pool.query(
        "INSERT INTO public.sales (s_id_user, s_id_album, s_id_track, s_id_track_album, s_price, s_date_sale) VALUES ($1,$2,$3,$4,$5,$6)",
        [req.body.idUser, req.body.idAlbum, req.body.idTrack, req.body.idTrackAlbum, req.body.price, new Date()],
        (err, result) => {
            if (err) {
                console.error("Error executing INSERT INTO:", err);
            } else {
                res.send({ succes: "Album bought" });
            }
        }
    );
};
