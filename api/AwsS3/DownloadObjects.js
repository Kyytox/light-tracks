// import dotenv
import dotenv from "dotenv";
dotenv.config();

// import fs from "fs";
import { Readable } from "stream";
import { createWriteStream } from "fs";

// import aws s3
import { s3Client, createS3Client } from "./AwsS3.js";

// BD
import pool from "../database/database.js";

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
                // console.log("rows", rows.rows);
                // if rows is empty, user have not buy album
                if (rows.rowCount === 0) {
                    console.log("User have not buy album");
                    res.status(500).json({ message: "User have not buy album" });
                }
                // if rows is not empty and row number is 1, have s_top_sale_album = true ==> user have buy all tracks of album
                else if (rows.rowCount === 1 && rows.rows[0].s_top_sale_album === true) {
                    console.log("user have buy all tracks of album");
                    getTracksAlbum(req, res);
                } else {
                    // user have buy some tracks of album
                    console.log("user have buy some tracks of album");
                }
            }
        }
    );
};

// get all tracks of album in bd
const getTracksAlbum = async (req, res) => {
    console.log("getTracksAlbum : ", req.query);
    pool.query(`SELECT * FROM tracks WHERE t_id_album = $1`, [req.query.idAlbum], (err, rows) => {
        if (err) {
            res.status(500).json({ message: err });
        } else {
            // console.log("rows", rows);
            // getDowloadLinkObjectS3(rows, res);
            getFilesS3(rows, res);
        }
    });
};

// get file S3 bucket and send to client
export const getFilesS3 = async (req, res) => {
    console.log("getFilesS3 : ", req.rows);
    const s3 = createS3Client();
    const tracks = req.rows;
    const tracksLength = tracks.length;
    const listUrl = [];

    // browse tracks
    for (let i = 0; i < tracksLength; i++) {
        // Init params for S3 bucket file
        const params = {
            Bucket: bucketName,
            Key: tracks[i].t_file_path + "/" + tracks[i].t_file_name,
        };

        // get file
        const s3Item = await s3.send(new GetObjectCommand(params));

        // create signed url
        const signedUrl = await getSignedUrl(s3, new GetObjectCommand(params), {
            expiresIn: 3600,
        });
        listUrl.push({
            idAlbum: tracks[i].t_id_album,
            idTrack: tracks[i].t_id_track,
            filename: tracks[i].t_title,
            url: signedUrl,
        });
    }

    // send list url to client
    res.send(listUrl);
};
