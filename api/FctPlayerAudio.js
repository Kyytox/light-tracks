import { createObjectCsvWriter } from "csv-writer";

// add in dataSongPlayed.csv the id of the user, the id of the album, the id of the track
// when the user play a song
export const cptSongPlayed = (req, res) => {
    console.log("API /cptSongPlayed");

    const dict = {
        idUser: req.body.id_user,
        idAlbum: req.body.t_id_album,
        idTrack: req.body.t_id_album_track,
    };

    const csvWriter = createObjectCsvWriter({
        path: "data/dataUserSongPlayed.csv",
        header: [
            { id: "idUser", title: "idUser" },
            { id: "idAlbum", title: "idAlbum" },
            { id: "idTrack", title: "idTrack" },
        ],
        append: true,
    });

    csvWriter
        .writeRecords([dict])
        .then(() => {
            console.log("A new row has been added to the CSV file");
        })
        .catch((error) => {
            console.error("An error occurred while writing to the CSV file:", error);
        });
};
