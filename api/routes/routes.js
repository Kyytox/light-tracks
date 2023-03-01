import express from "express";

import { checkToken, authenticateToken } from "../services/token.js";
import { signUp, login } from "../services/auth.js";
import { createAlbum, countAlbumUser } from "../FunctionsAlbum.js";
import { getAlbums, getTracks } from "../FunctionsExplorer.js";
import { getAudioFileStream } from "../AwsS3.js";
import { generateUniqueName, convertFileAudio } from "../FunctionsAlbum.js";
import { buyAlbum } from "../FonctionsBuy.js";
import { getCollection, getFavoris, getMyAlbums, addFavoris, deleteFavoris, getSalesFavoris, getAlbumInFavorisOrSales,deleteAlbum } from "../FonctionsProfile.js";

import dotenv from "dotenv";
dotenv.config();

// multer for upload file
// configure storage for multer when file is uploaded
import multer from "multer";
import multerS3 from "multer-s3";
import { s3Client } from "../AwsS3.js";

const storage2 = multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            // const filename = "cover-" + req.body.idUser + "-" + req.body.idAlbum + "." + file.mimetype.split("/")[1];
            const filename = generateUniqueName(file.originalname);
            const pathS3 = "coversAlbums/" + req.body.idUser + "/";
            cb(null, pathS3 + filename);
        } else {
            // const filename = "track-" + req.body.idUser + "-" + req.body.idAlbum + "-" + (req.files.length - 1).toString() + "." + file.mimetype.split("/")[1];
            const filename = generateUniqueName(file.originalname);
            const pathS3 = "uploads/" + req.body.idUser + "/" + req.body.idAlbum + "/tracks/";
            cb(null, pathS3 + filename);
        }
    },
});

const upload = multer({ storage: storage2 });
const uploadConvertFile = multer();

const router = express.Router();
dotenv.config();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/verifyUser", checkToken);

// Album
router.post("/createAlbum", upload.array("file"), createAlbum);
router.get("/countAlbumUser", countAlbumUser);

// Explorer
router.get("/getAlbums", getAlbums);
router.get("/getTracks", getTracks);

router.post("/getAudioFileStream", getAudioFileStream);
router.post("/convertFileAudio", uploadConvertFile.single("file"), convertFileAudio);

// Buy
router.post("/buyAlbum", buyAlbum);

// User Profile
router.get("/getCollection", authenticateToken, getCollection);
router.get("/getFavoris", authenticateToken, getFavoris);
router.get("/getMyAlbums", authenticateToken, getMyAlbums);
router.post("/addFavoris", addFavoris);
router.post("/deleteFavoris", deleteFavoris);
router.get("/getSalesFavoris", authenticateToken, getSalesFavoris);
router.get("/getAlbumInFavorisOrSales", authenticateToken, getAlbumInFavorisOrSales);
router.post("/deleteAlbum",authenticateToken, deleteAlbum);

export default router;
