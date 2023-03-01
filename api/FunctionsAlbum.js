import pool from "./database/database.js";
import { v4 as uuidv4 } from "uuid";
import { join, dirname } from "path";

// ffmpeg.wasm
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

// const FFmpegCoreLocation = join(
//         dirname(import.meta.url),
//         "./node_modules/@ffmpeg/core/dist/ffmpeg-core.js"
// ).replace("file:", "");


const FFmpegCoreLocation = "/media/kytox/Jeux/DEV/LightTracks/api/node_modules/@ffmpeg/core/dist/ffmpeg-core.js"
  
// const FFmpegWasmLocation = join(
//     dirname(import.meta.url),
//     "./node_modules/@ffmpeg/core/dist/ffmpeg-core.wasm"
// );
const FFmpegWasmLocation = "/media/kytox/Jeux/DEV/LightTracks/api/node_modules/@ffmpeg/core/dist/ffmpeg-core.wasm"


// function for count number of album for a user
export const countAlbumUser = (req, res) => {
    const idUser = req.query.idUser;
    pool.query("SELECT COUNT(*) FROM public.albums WHERE a_id_user = ($1)", [idUser], (err, result) => {
        if (err) {
            console.error("Error executing INSERT INTO:", err);
        } else {
            res.send({ count: parseInt(result.rows[0].count) + 1 });
        }
    });
};

// create app.post for retrieve data from client this data contain fomrData and file (image in format jpg and tracks in format mp3)
export const createAlbum = (req, res) => {
    console.log("API /createAlbum");
    console.log("req.body", req.body);
    console.log("req.file", req.files);
    const idUser = req.body.idUser;

    const album = {
        idAlbum: req.body.idAlbum,
        title: req.body.title,
        artist: req.body.artist,
        price: req.body.price,
        date_release: req.body.date_release,
        descr: req.body.descr,
        style: [req.body.styles],
        cover: req.files[0].key.split("/").slice(-1)[0],
        coverPath: req.files[0].key.split("/").slice(0, -1).join("/"),
    };

    const tracks = [];

    var count = 1;
    // insert in const tracks all tracks
    // browse req.files but don't take the first one (cover) and don't take mp3 file and insert into const tracks
    for (let i = 1; i < req.files.length; i++) {
        // if file is not mp3, push it
        if (!req.files[i].key.endsWith(".mp3")) {
            // retrive all index of req body who start with "track" and finish with var i
            const track = Object.keys(req.body).filter((key) => key.startsWith("track") && key.endsWith(count));
            /// browse const track and retrive the value of each index in req.body and insert into const tracks with dictionnary key:value (title: "title", artist: "artist", ...)
            const trackObj = {};
            track.forEach((key) => {
                // enleve le mot track et le chiffre i et met le reste en minuscule
                trackObj[key.replace(/track|\d+/g, "").toLowerCase()] = req.body[key];
            });

            // start of attribute key for track
            trackObj.path = req.files[i].key.split("/").slice(0, -1).join("/");

            // end of attribute key for track
            trackObj.filename = req.files[i].key.split("/").slice(-1)[0];

            /// retrieve mp3 filename , he is in the next index of req.files
            trackObj.filename_mp3 = req.files[i + 1].key.split("/").slice(-1)[0];

            // insert into const tracks
            tracks.push(trackObj);
            count++;
        }
    }
    console.log("album", album);
    console.log("tracks", tracks);

    // insert into bd
    pool.query(
        "INSERT INTO public.albums (a_id_user, a_id_album_user, a_title, a_artist, a_price, a_date_release, a_date_create, a_styles, a_description, a_cover, a_cover_path) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING a_id",
        [
            idUser,
            album.idAlbum,
            album.title,
            album.artist,
            album.price,
            album.date_release === "" ? new Date() : album.date_release,
            new Date(),
            album.style,
            album.descr,
            album.cover,
            album.coverPath,
        ],
        (err, result) => {
            if (err) {
                console.error("Error executing INSERT INTO:", err);
            } else {
                // insert into tracks table
                tracks.forEach((track) => {
                    pool.query(
                        "INSERT INTO public.tracks (t_id_album, t_id_user, t_id_album_track, t_title, t_artist, t_price, t_date_release, t_date_create, t_nb_listen, t_lyrics, t_file_name, t_file_path, t_file_name_mp3) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",
                        [
                            result.rows[0].a_id,
                            idUser,
                            track.id,
                            track.title,
                            track.artist,
                            track.price,
                            track.date_release === "" ? new Date() : track.date_release,
                            new Date(),
                            track.nb_listens,
                            track.lyrics,
                            track.filename,
                            track.path,
                            track.filename_mp3,
                        ],
                        (err, result) => {
                            if (err) {
                                console.error("Error executing INSERT INTO:", err);
                            } else {
                                console.log("result");
                            }
                        }
                    );
                });
                res.send({ succes: "Album created" });
            }
        }
    );
};

// Convert file to mp3 with ffmpeg.wasm
export const convertFileAudio = async (req, res) => {
    // retrieve the file from the request
    const file = req.file;
    console.log("file", file);

    // // create a new ffmpeg instance
    // const ffmpeg = createFFmpeg({
    //     log: true,
    //     coverPath: FFmpegCoreLocation,
    //     wasmPath: FFmpegWasmLocation,
    // });
    console.log("FFmpegCoreLocation", FFmpegCoreLocation);
    console.log("FFmpegWasmLocation", FFmpegWasmLocation);

    
    const ffmpeg = createFFmpeg({
        // corePath: "/media/kytox/Jeux/DEV/LightTracks/api/node_modules/@ffmpeg/core/dist/ffmpeg-core.js",
        // wasmPath: "./media/kytox/Jeux/DEV/LightTracks/api/node_modules/@ffmpeg/ffmpeg/dist/ffmpeg.wasm",
        log: true,
        logger: ({ message }) => console.log(message),
        progress: p => console.log(p)
    });
    
    ffmpeg.setLogger(({ type, message }) => {
        console.log("logger", type, message);
        /*
         * type can be one of following:
         *
         * info: internal workflow debug messages
         * fferr: ffmpeg native stderr output
         * ffout: ffmpeg native stdout output
         */
      });

    ffmpeg.setProgress(({ ratio }) => {
        console.log("progress", ratio);
        /*
         * ratio is a float number between 0 to 1.
         */
      });


    // convert the file to mp3 and return the result
    try {
        await ffmpeg.load();
        console.log("ffmpeg loaded");
        ffmpeg.FS("writeFile", file.originalname, await fetchFile(file.buffer));
        // ffmpeg.FS('writeFile', file.originalName, new Uint8Array(file.buffer));
        await ffmpeg.run("-i", file.originalname, "-c:a", "libmp3lame", "test.mp3");
        const data = ffmpeg.FS("readFile", "test.mp3");
        res.send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send("Erreur lors de la conversion");
    }
};



// create function for generate unique name for file
export const generateUniqueName = (originalName) => {
    const uniqueSuffix = Date.now().toString(36) + Math.round(Math.random() * 1e4).toString(36);
    const extension = originalName.split(".")[1];
    return `${uuidv4().slice(0, 8)}-${uniqueSuffix.slice(0, 12)}.${extension}`;
};
