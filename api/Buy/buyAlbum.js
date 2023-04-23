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
                top_free: false,
            });
        } else if (infosAlbum.rows[0].a_top_custom_price === true) {
            res.send({ top_custom_price: true, top_free: false });
        } else {
            // album is free
            console.log("album is free");
            await addFreeAlbumToSales(req, res);
        }
    } catch (error) {
        console.log("error", error);
    }
};

// Add free album to Sales
export const addFreeAlbumToSales = async (req, res) => {
    console.log("API /addFreeAlbumToSales");
    console.log("req.body", req.body);

    try {
        const result = await pool.query(
            `INSERT INTO sales (s_id_user, s_id_album, s_id_track, s_id_track_album, s_price, s_date_sale, s_top_sale_album, s_top_sale_track)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [req.body.idUser, req.body.idAlbum, null, null, 0, new Date(), true, false]
        );

        // delete album from table Favoris if it exists
        await deleteAlbumFromFavoris(req, res);

        res.send({ top_free: true, message: "Album added to Sales" });
    } catch (error) {
        console.log("error", error);
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
                [req.body.idUser, req.body.idAlbum, null, null, req.body.price, new Date(), true, false]
            );

            console.log("addAlbumToSales result -- Success");

            // delete all tracks of the album from table sales
            await deleteTracksFromSales(req);

            // delete album from table Favoris if it exists
            await deleteAlbumFromFavoris(req, res);

            res.send({ success: true, message: "Album added to Sales" });
        } catch (error) {
            console.log("addAlbumToSales result -- Error");
            throw error;
        }
    } else {
        console.log("addAlbumToSales result -- Error");
        res.send({ error: "Payement not valid" });
    }
};

// delete all tracks of the album from table sales
export const deleteTracksFromSales = async (req) => {
    console.log("API /deleteTracksFromSales");
    console.log("req.body", req.body);

    try {
        const result = await pool.query(
            "DELETE FROM public.sales WHERE s_id_user = $1 AND s_id_album = $2 AND s_top_sale_track = true",
            [req.body.idUser, req.body.idAlbum]
        );

        console.log("deleteTracksFromSales result -- Success");
        return;
    } catch (error) {
        console.log("deleteTracksFromSales result -- Error");
        throw error;
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
        return;
    } catch (error) {
        console.log("deleteAlbumFromFavoris result -- Error");
        throw error;
    }
};
