// import dotenv
import dotenv from "dotenv";
dotenv.config();

// import fs from "fs";
import { Readable } from "stream";
import { createWriteStream } from "fs";

// import aws s3
import { s3Client, createS3Client } from "./awsS3.js";

// BD
import pool from "../Database/database.js";

// import aws s3 commands
import { S3Client, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import archiver from "archiver";
import JSZip from "jszip";

// Set params for S3 bucket
const bucketName = process.env.AWS_BUCKET_NAME;

// get all tracks of albums in bd
export const downloadAlbum = async (req, res) => {
    console.log("downloadAlbum : ", req.query);

    // check if User have buy album
    pool.query(
        `SELECT * FROM sales WHERE s_id_user = $1 AND s_id_album = $2`,
        [req.query.idUser, req.query.idAlbum],
        (err, rows) => {
            if (err) {
                res.status(500).json({ message: err });
            } else {
                // if rows is empty, user have not buy album
                if (rows.rowCount === 0) {
                    console.log("User have not buy album");
                    res.status(500).json({ message: "User have not buy album" });
                }
                // if rows is not empty and row number is 1, have s_top_sale_album = true ==> user have buy all tracks of album
                else if (rows.rowCount === 1 && rows.rows[0].s_top_sale_album === true) {
                    console.log("user have buy all tracks of album");
                    getAllTracksAlbum(req, res);
                } else {
                    // user have buy some tracks of album
                    console.log("user have buy some tracks of album");
                    getSomeTracksAlbum(req, res);
                }
            }
        }
    );
};

// get all tracks of album in bd
const getAllTracksAlbum = async (req, res) => {
    console.log("getAllTracksAlbum : ", req.query);
    pool.query(
        `SELECT a_id_user, a_id, a_title, a_artist, t_id, t_id_album_track, t_title, t_file_path, t_file_name, a_cover_path, a_cover
         FROM tracks t
         join albums a 
         on a.a_id = t.t_id_album 
         WHERE t.t_id_album = $1`,
        [req.query.idAlbum],
        (err, rows) => {
            if (err) {
                res.status(500).json({ message: err });
            } else {
                // console.log("rows", rows);
                getDowloadLinkObjectS3(rows, res);
            }
        }
    );
};

// get some tracks of album in bd
const getSomeTracksAlbum = async (req, res) => {
    console.log("getSomeTracksAlbum : ", req.query);
    pool.query(
        `SELECT a_id_user, a_id, a_title, a_artist, t_id, t_id_album_track, t_title, t_file_path, t_file_name, a_cover_path, a_cover
        FROM tracks t
        join albums a 
        on a.a_id = t.t_id_album 
        WHERE t.t_id_album = $1 
        AND t.t_id IN 
            (SELECT s_id_track 
            FROM sales s
            WHERE s.s_id_user = $2 
            AND s.s_id_album = $3)`,
        [req.query.idAlbum, req.query.idUser, req.query.idAlbum],
        (err, rows) => {
            if (err) {
                res.status(500).json({ message: err });
            } else {
                // console.log("rows", rows);
                getDowloadLinkObjectS3(rows, res);
            }
        }
    );
};

// get file S3 bucket and send to client
export const getDowloadLinkObjectS3 = async (req, res) => {
    console.log("getDowloadLinkObjectS3 : ", req.rows);
    const s3 = createS3Client();
    const tracks = req.rows;
    const tracksLength = tracks.length;
    const listUrl = [];

    console.log("tracks : ", tracks);

    // browse tracks
    for (let i = 0; i < tracksLength; i++) {
        // Init params for S3 bucket file
        const params = {
            Bucket: bucketName,
            Key: tracks[i].t_file_path + "/" + tracks[i].t_file_name,
        };

        // get file and create signed url
        const signedUrl = await getSignedUrl(s3, new GetObjectCommand(params), {
            expiresIn: 3600,
        });
        listUrl.push({
            idAlbum: tracks[i].t_id_album,
            titleAlbum: tracks[i].a_title,
            artistAlbum: tracks[i].a_artist,
            idTrack: tracks[i].t_id_track,
            filename: tracks[i].t_title,
            coverPath: tracks[i].a_cover_path,
            cover: tracks[i].a_cover,
            url: signedUrl,
        });
    }

    // send list url to client
    res.send(listUrl);
};
