// import dotenv
import dotenv from "dotenv";
dotenv.config();

// import aws s3
import { s3Client } from "./AwsS3.js";

// BD
import pool from "../database/database.js";

// import aws s3 commands
import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
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

// // get dowload link object S3 bucket and create zip who send to client directly
// export const getDowloadLinkObjectS3 = async (req, res) => {
//     console.log("getDowloadLinkObjectS3 : ", req.rows);
//     const tracks = req.rows;
//     // const tracksLength = tracks.length;
//     const tracksLength = 1;
//     let tracksDowload = [];

//     for (let i = 0; i < tracksLength; i++) {
//         console.log(
//             "tracks[i].t_file_path + tracks[i].t_file_name",
//             tracks[i].t_file_path + "/" + tracks[i].t_file_name
//         );
//         const paramsGetFile = {
//             Bucket: bucketName,
//             Key: tracks[i].t_file_path + "/" + tracks[i].t_file_name,
//         };

//         console.log("paramsGetFile", paramsGetFile);

//         try {
//             // const command = await s3Client.send(new GetObjectCommand(paramsGetFile));
//             const command = new GetObjectCommand(paramsGetFile);
//             const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
//             tracksDowload.push(signedUrl);
//         } catch (err) {
//             console.log("Error", err);
//         }
//     }

//     console.log("tracksDowload", tracksDowload);

//     // // create zip file
//     // const archive = archiver("zip", {
//     //     zlib: { level: 9 },
//     // });

//     // // send zip file to client
//     // archive.pipe(res);
//     // tracksDowload.forEach((track) => {
//     //     archive.append(track, { name: track });
//     // });
//     // archive.finalize();

//     // Une fois que toutes les URLs signées sont disponibles, créer un dossier zip et y ajouter les fichiers téléchargés
//     // const JSZip = require("jszip");
//     const zip = new JSZip();

//     tracksDowload.forEach((url) => {
//         const fileName = url.split("?")[0].split("/").pop(); // Extraire le nom de fichier de l'URL signée
//         zip.file(fileName, url, { binary: true }); // Ajouter le fichier au dossier zip
//     });

//     // Générer le dossier zip
//     zip.generateAsync({ type: "nodebuffer" }).then(function (content) {
//         // Renvoyer le contenu du dossier zip en tant que réponse HTTP
//         res.set("Content-Type", "application/zip");
//         res.set("Content-Disposition", 'attachment; filename="dossier.zip"');
//         res.send(content);
//     });

//     // res.status(200).json({ message: "ok" });
// };
