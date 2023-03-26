import pool from "../database/database.js";
import fs from "fs";
import { csvToObj } from "csv-to-js-parser";

// insert in BD the cpt of song played by user in tabl user_song_played
export function getDataUserSongPlayed(req, res) {
    // récup les données du fichier ./dataUserSongPlayed.csv
    const csvFilePath = "dataUserSongPlayed.csv";

    const data = fs
        .readFileSync("/media/kytox/Jeux/DEV/LightTracks/api/data/dataUserSongPlayed.csv")
        .toString();

    console.log("data", data);

    const description = {
        idUser: { type: "number", group: 1 },
        idAlbum: { type: "number", group: 2 },
        idTrack: { type: "number", group: 3 },
    };
    let obj = csvToObj(data, ",", description);
    console.log("obj", obj);

    const tempDict = {};
    for (const item of obj) {
        const key = `${item.idUser}_${item.idAlbum}_${item.idTrack}`;
        if (!tempDict[key]) {
            tempDict[key] = { ...item, count: 1 };
        } else {
            tempDict[key].count++;
        }
    }

    const outputValues = Object.values(tempDict);
    console.log(outputValues);
}
