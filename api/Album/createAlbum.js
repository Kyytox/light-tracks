// database
import pool from "../Database/database.js";

// count number of album for a user
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

// Insert album in database
export const createAlbum = (req, res) => {
    console.log("API /createAlbum");
    console.log("req.body", req.body);
    console.log("req.file", req.files);
    const idUser = req.body.idUser;

    // create album
    const album = {
        a_id_user: parseInt(req.body.idUser),
        a_id_album_user: parseInt(req.body.idAlbum),
        a_title: req.body.title,
        a_artist: req.body.artist,
        a_price: parseFloat(req.body.price),
        a_date_release: req.body.date_release,
        a_date_create: new Date(),
        a_styles: req.body.styles.split(",").map((item) => parseInt(item)),
        a_description: req.body.descr,
        a_cover: req.files[0].key.split("/").slice(-1)[0],
        a_cover_path: req.files[0].key.split("/").slice(0, -1).join("/"),
        a_tags: req.body.tags.split(",").map((item) => item.trim()),
        a_top_free: Boolean(req.body.top_free),
        a_top_custom_price: Boolean(req.body.top_custom_price),
        a_top_price: Boolean(req.body.top_price),
    };

    const tracks = [];

    var count = 1;
    // insert in const tracks all tracks
    // browse req.files but don't take the first one (cover) and don't take mp3 file and insert into const tracks
    for (let i = 1; i < req.files.length; i++) {
        // if i is impair
        if (i % 2 !== 0) {
            // retrive all index of req body who start with "track" and finish with var i
            const track = Object.keys(req.body).filter((key) => key.startsWith("track") && key.endsWith(count));
            /// browse const track and retrive the value of each index in req.body and insert into const tracks with dictionnary key:value (title: "title", artist: "artist", ...)
            const trackObj = {};
            track.forEach((key) => {
                // enleve le mot track et le chiffre i et met le reste en minuscule
                if (key === "trackPrice" + i) {
                    trackObj[key.replace(/track|\d+/g, "").toLowerCase()] = parseFloat(req.body[key]);
                } else {
                    trackObj[key.replace(/track|\d+/g, "").toLowerCase()] = req.body[key];
                }
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
    const query = {
        text: "INSERT INTO public.albums (a_id_user, a_id_album_user, a_title, a_artist, a_price, a_date_release, a_date_create, a_styles, a_description, a_cover, a_cover_path, a_tags, a_top_free, a_top_custom_price, a_top_price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING a_id",
        values: [
            album.a_id_user,
            album.a_id_album_user,
            album.a_title,
            album.a_artist,
            album.a_price,
            album.a_date_release,
            album.a_date_create,
            album.a_styles,
            album.a_description,
            album.a_cover,
            album.a_cover_path,
            album.a_tags,
            album.a_top_free,
            album.a_top_custom_price,
            album.a_top_price,
        ],
    };
    pool.query(query, (err, result) => {
        if (err) {
            console.error("Error executing INSERT INTO:", err);
        } else {
            // insert into tracks table
            tracks.forEach((track) => {
                pool.query(
                    "INSERT INTO public.tracks (t_id_album, t_id_user, t_id_album_track, t_title,t_artist, t_price, t_date_release, t_date_create, t_nb_listen, t_lyrics, t_file_name, t_file_path, t_file_name_mp3) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",
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
    });
};
