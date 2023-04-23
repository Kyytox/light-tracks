import pool from "../Database/database.js";

import { getInfosUserLnbits } from "../Lnbits/getInfosUser.js";
import { createInvoice, checkPayement } from "../Lnbits/wallets.js";

export const buyAlbum = async (req, res) => {
    console.log("API /buyAlbum");
    console.log("req.body", req.body);

    try {
        // retrieve infos Album and tracks bought by user from Sales table
        const infosAlbum = await pool.query(
            `SELECT a_price, a_top_free, a_top_custom_price, a_top_price,
            (SELECT SUM(t_price) FROM tracks WHERE t_id_album = $1 AND t_id IN (
                SELECT s_id_track 
                FROM sales 
                WHERE s_id_user = $2 AND s_id_album = $1)) 
                AS sum_price_track_album_bought
            FROM albums a
            WHERE a.a_id = $1`,
            [req.body.idAlbum, req.body.idUser]
        );
        console.log("infosAlbum", infosAlbum.rows[0]);

        if (infosAlbum.rows[0].a_top_price === true) {
            // album is not free
            const infosUser = await getInfosUserLnbits(req.body.idUser);
            console.log("infosUser", infosUser);

            const price = infosAlbum.rows[0].a_price - infosAlbum.rows[0].sum_price_track_album_bought;
            console.log("price", price);

            // create invoice
            const invoice = await createInvoice(infosUser.invoiceKey, price);
            res.send({
                invoiceKey: infosUser.invoiceKey,
                payementHash: invoice.payment_hash,
                payementRequest: invoice.payment_request,
                top_custom_price: false,
            });
        } else if (infosAlbum.rows[0].a_top_custom_price === true) {
            res.send({ top_custom_price: true });
        }
    } catch (error) {
        console.log("error", error);
    }
};

// // serach in Sales table if user already bought tracks from album
// export const checkTrackAlreadyBought = async (req) => {
//     console.log("API /checkTrackAlreadyBought");

//     try {
//         const result = await pool.query(
//             "SELECT * FROM sales WHERE s_id_user = $1 AND s_id_album = $2 AND s_top_sale_track = true",
//             [req.body.idUser, req.body.idAlbum]
//         );

//         if (result.rowCount === 0) {
//             // get price of album
//             console.log("User didn't buy tracks from album");
//             return await getPriceAlbum(req);
//         } else {
//             console.log("User already bought tracks from album");
//             // calculate price of album with tracks already bought
//             return await calculPriceAlbum(req);
//         }
//     } catch (error) {
//         console.log("checkTrackAlreadyBought result -- Error");
//         throw error;
//     }
// };

// // get price of album
// export const getPriceAlbum = async (req) => {
//     console.log("API /getPriceAlbum");

//     try {
//         const result = await pool.query(
//             "SELECT a_price, a_top_free, a_top_custom_price, a_top_price FROM albums WHERE a_id = $1",
//             [req.body.idAlbum]
//         );

//         console.log("getPriceAlbum result -- Success");
//         return result.rows[0].a_price;
//     } catch (error) {
//         console.log("getPriceAlbum result -- Error");
//         throw error;
//     }
// };

// // calcul price of Album when user already bought tracks from album
// export const calculPriceAlbum = async (req) => {
//     console.log("API /calculPriceAlbum");
//     console.log("req.body", req.body);

//     // get price of album without tracks already bought
//     try {
//         const result = await pool.query(
//             `SELECT SUM(t_price)
//             FROM tracks
//             WHERE t_id_album = $1 AND t_id NOT IN (
//                 SELECT s_id_track
//                 FROM sales
//                 WHERE s_id_user = $2 AND s_id_album = $3)`,
//             [req.body.idAlbum, req.body.idUser, req.body.idAlbum]
//         );

//         console.log("calculPriceAlbum result -- Success");
//         return result.rows[0].sum;
//     } catch (error) {
//         console.log("calculPriceAlbum result -- Error");
//         throw error;
//     }
// };

// add Album to Sales
export const addAlbumToSales = async (req, res) => {
    console.log("API /addAlbumToSales");
    console.log("req.body", req.body);

    const topPayement = await checkPayement(req.body.invoiceKey, req.body.payementHash);
    console.log("topPayement", topPayement);

    if (topPayement === true) {
        try {
            const result = await pool.query(
                `INSERT INTO sales (s_id_user, s_id_album, s_id_track, s_id_track_album, s_price, s_date_sale, s_top_sale_album, s_top_sale_track)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [req.body.idUser, req.body.idAlbum, null, null, req.body.price, new Date(), true, false]
            );

            console.log("addAlbumToSales result -- Success");

            // delete album from table Favoris if it exists
            await deleteAlbumFromFavoris(req, res);

            // delete all tracks of the album from table sales
            const resultDelTracks = await pool.query(
                "DELETE FROM public.sales WHERE s_id_user = $1 AND s_id_album = $2 AND s_top_sale_track = true",
                [req.body.idUser, req.body.idAlbum]
            );
        } catch (error) {
            console.log("addAlbumToSales result -- Error");
            throw error;
        }
    } else {
        console.log("addAlbumToSales result -- Error");
        res.send({ error: "Payement not valid" });
    }
};

// delete album from table Favoris if it exists
export const deleteAlbumFromFavoris = async (req, res) => {
    console.log("API /deleteAlbumFromFavoris");
    console.log("req.body", req.body);

    try {
        const result = await pool.query("DELETE FROM favoris WHERE f_id_user = $1 AND f_id_album = $2", [
            req.body.idUser,
            req.body.idAlbum,
        ]);

        console.log("deleteAlbumFromFavoris result -- Success");
        res.send({ success: true, message: "Album added to Sales" });
    } catch (error) {
        console.log("deleteAlbumFromFavoris result -- Error");
        throw error;
    }
};
