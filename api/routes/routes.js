import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { checkToken, authenticateToken } from "../services/token.js";

//
// Auth
import { signUp, login, deleteUser } from "../services/auth.js";

//
// Album
import { createAlbum, countAlbumUser } from "../Album/createAlbum.js";
import { generateUniqueName, convertFileAudio } from "../Album/convertAudio.js";

//
// Explorer
import { getAlbums, getTracks } from "../Explorer/explorerNotAuth.js";
import {
    getAlbumsAuthLatest,
    getTracksAuth,
    getAlbumsAuthFollows,
    getAlbumsAuthStyles,
} from "../Explorer/explorerAuth.js";

//
// Buy
import { buyAlbum, addAlbumToSales } from "../Buy/buyAlbum.js";
import { buyTrack, addTrackToSales } from "../Buy/buyTrack.js";

import {
    getProfileInfos,
    updateProfileInfos,
    getCollection,
    getMyAlbums,
    deleteAlbum,
} from "../Profile/fctsProfile.js";

//
// Wantlist
import { getWantlist, addWantlist, deleteWantlist } from "../Wantlist/actionsWantlist.js";

//
// Follows
import { getFollows, getFollowsByIdUser } from "../Follows/fctsFollow.js";
import { followUser, unfollowUser } from "../Follows/actionFollow.js";

//
// User
import { getUserById } from "../User/fctsUser.js";

//
// Globals
import { getStylesCountries, getStyles } from "../fctsGlobals.js";

//
// PlayerAudio
import { cptSongPlayed } from "../PlayerAudio/fctPlayerAudio.js";

//
// Search
import { getSearch } from "../Search/searchNotAuth.js";
import { getSearchAuth } from "../Search/searchAuth.js";
import { getStylesCountryInAlbums } from "../Search/fctSearch.js";

//
// LnBits
import { withdraw } from "../Lnbits/withdraw.js";
import { verifyInvoice } from "../Lnbits/wallets.js";

// multer for upload file
// configure storage for multer when file is uploaded
import multer from "multer";
import multerS3 from "multer-s3";
import { s3Client } from "../AwsS3/awsS3.js";
import { downloadAlbum } from "../AwsS3/downloadObjects.js";

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

router.post("/signup", signUp);
router.post("/login", login);
router.post("/deleteUser", deleteUser);
router.post("/verifyUser", checkToken);

// Global Functions
router.get("/getStylesCountries", getStylesCountries);
router.get("/getStyles", getStyles);

// Album
router.post("/createAlbum", authenticateToken, upload.array("file"), createAlbum);
router.post("/deleteAlbum", authenticateToken, deleteAlbum);
router.get("/countAlbumUser", countAlbumUser);
router.post("/convertFileAudio", uploadConvertFile.single("file"), convertFileAudio);

// Explorer
router.get("/getAlbums", getAlbums);
router.get("/getTracks", getTracks);
router.get("/getAlbumsAuthLatest", authenticateToken, getAlbumsAuthLatest);
router.get("/getAlbumsAuthFollows", authenticateToken, getAlbumsAuthFollows);
router.get("/getAlbumsAuthStyles", authenticateToken, getAlbumsAuthStyles);
router.get("/getTracksAuth", authenticateToken, getTracksAuth);

// Search
router.get("/getStylesCountryInAlbums", getStylesCountryInAlbums);
router.get("/getSearch", getSearch);
router.get("/getSearchAuth", authenticateToken, getSearchAuth);

// Buy
router.post("/buyAlbum", authenticateToken, buyAlbum);
router.post("/addAlbumToSales", authenticateToken, addAlbumToSales);
router.post("/buyTrack", authenticateToken, buyTrack);
router.post("/addTrackToSales", authenticateToken, addTrackToSales);

// Profile
router.get("/getProfileInfos", authenticateToken, getProfileInfos);
router.post("/updateProfileInfos", authenticateToken, updateProfileInfos);
router.get("/getCollection", authenticateToken, getCollection);
router.get("/getMyAlbums", authenticateToken, getMyAlbums);

// Wantlist
router.get("/getWantlist", authenticateToken, getWantlist);
router.post("/addWantlist", addWantlist);
router.post("/deleteWantlist", deleteWantlist);

// Follow
router.get("/getFollows", authenticateToken, getFollows);
router.get("/getFollowsByIdUser", authenticateToken, getFollowsByIdUser);
router.post("/followUser", authenticateToken, followUser);
router.post("/unfollowUser", authenticateToken, unfollowUser);

// Player Audio
router.post("/cptSongPlayed", cptSongPlayed);

// User
router.get("/getUserById", getUserById);

// Download
router.get("/downloadAlbum", authenticateToken, downloadAlbum);

// Lnbits
router.get("/withdraw", authenticateToken, withdraw);
router.get("/verifyInvoice", verifyInvoice);

export default router;
