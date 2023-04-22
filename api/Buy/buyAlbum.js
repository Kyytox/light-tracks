import pool from "../Database/database.js";

import { getInfosUserLnbits } from "../Lnbits/getInfosUser.js";
import { createInvoice, checkPayement } from "../Lnbits/wallets.js";

export const buyAlbum = async (req, res) => {
    console.log("API /buyAlbum");
    console.log("req.body", req.body);

    // check if user already bought tracks from album
    const price = await checkTrackAlbum(req);
    console.log("price", price);

    try {
        if (price.a_top_free === true) {
            // album is free
        } else if (price.a_top_custom_price === true) {
            // album is custom price
        } else {
            // album is not free
            const infosUser = await getInfosUserLnbits(req.body.idUser);
            console.log("infosUser", infosUser);

            // create invoice
            const invoice = await createInvoice(infosUser.invoiceKey, price.a_price);
            res.send({
                invoiceKey: infosUser.invoiceKey,
                payementHash: invoice.payment_hash,
                payementRequest: invoice.payment_request,
            });
        }
    } catch (error) {
        console.log("error", error);
    }
};

// serach in Sales table if user already bought tracks from album
export const checkTrackAlbum = async (req) => {
    console.log("API /checkTrackAlbum");

    try {
        const result = await pool.query(
            "SELECT * FROM sales WHERE s_id_user = $1 AND s_id_album = $2 AND s_top_sale_track = true",
            [req.body.idUser, req.body.idAlbum]
        );

        if (result.rowCount === 0) {
            console.log("User didn't buy tracks from album");
            return await getPriceAlbum(req);
        } else {
            console.log("User already bought tracks from album");
            // return a default value here
            return { a_price: 0 };
        }
    } catch (error) {
        console.log("checkTrackAlbum result -- Error");
        throw error;
    }
};

// get price of album
export const getPriceAlbum = async (req) => {
    console.log("API /getPriceAlbum");

    try {
        const result = await pool.query(
            "SELECT a_price, a_top_free, a_top_custom_price, a_top_price FROM albums WHERE a_id = $1",
            [req.body.idAlbum]
        );

        console.log("getPriceAlbum result -- Success");
        return result.rows[0];
    } catch (error) {
        console.log("getPriceAlbum result -- Error");
        throw error;
    }
};

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
                [
                    req.body.idUser,
                    req.body.idAlbum,
                    req.body.idTrack,
                    req.body.idTrackAlbum,
                    req.body.price,
                    new Date(),
                    true,
                    false,
                ]
            );

            console.log("addAlbumToSales result -- Success");

            // delete album from table Favoris if it exists
            await deleteAlbumFromFavoris(req, res);
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
        res.send({ succes: "Album bought" });
    } catch (error) {
        console.log("deleteAlbumFromFavoris result -- Error");
        throw error;
    }
};
