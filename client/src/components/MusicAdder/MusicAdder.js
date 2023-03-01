import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

import Button from "@mui/material/Button";

import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { backendUrl } from "../../Globals/GlobalVariables";
import AlbumAdder from "./AlbumAdder";
import TracksAdder from "./TracksAdder";

function MusicAdder() {
    const idUser = getLocalStorage("id");
    const [idAlbum, setIdAlbum] = useState(0);
    const [album, setAlbum] = useState({
        title: { value: "", error: false, msg: "" },
        artist: { value: "", error: false, msg: "" },
        image: { value: null, url: "", error: false, msg: "" },
        price: { value: "", error: false, msg: "" },
        descr: { value: "", error: false, msg: "" },
        date_release: { value: "", error: false, msg: "" },
        styles: { value: [], error: false, msg: "" },
    });

    const [lstTrack, setLstTrack] = useState([
        {
            id: { value: 1, error: false, msg: "" },
            title: { value: "", error: false, msg: "" },
            artist: { value: "", error: false, msg: "" },
            fileOrigin: { value: null, error: false, msg: "" },
            fileMp3: { value: null, error: false, msg: "" },
            price: { value: "", error: false, msg: "" },
            date_release: { value: "", error: false, msg: "" },
            lyrics: { value: "", error: false, msg: "" },
            nb_listens: { value: 0, error: false, msg: "" },
        },
    ]);

    // formats accepted for the file track
    const acceptedFormatsTrack = ["audio/mpeg", "audio/flac", "audio/wav"];
    const acceptedFormatsImg = ["image/png", "image/jpeg", "image/jpg"];

    // ref to the file input
    const fileInputRef = useRef(null);
    const ImgInputRef = useRef(null);

    // use useeffect to get the number of album of the user
    // use axios .get and call countAlbumUser with Body {idUser: idUser}
    // then set the numAlbum
    useEffect(() => {
        console.log("id user", idUser);
        axios
            .get(backendUrl + "/countAlbumUser", { params: { idUser: idUser } })
            .then((res) => {
                console.log(res.data);
                setIdAlbum(res.data.count);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [idUser]);

    ///////////////////////////
    //
    // Handle Change Album and Track
    //
    ///////////////////////////
    // function to change the value of an album
    // if the field is file, we check if the type file is accepted
    // if not, we set the error to true and the value to null ELSE we set the error to false and the value to the file
    const handleAlbumChange = (field, value) => {
        if (field === "image") {
            const error = value && !acceptedFormatsImg.includes(value.type);
            setAlbum({
                ...album,
                [field]: { error: error, msg: error ? "This file format is not accepted" : "", value: error ? null : value, url: error ? "" : URL.createObjectURL(value) },
            });
            if (error) ImgInputRef.current.value = null;
        } else {
            setAlbum({ ...album, [field]: { ...album[field], value: value, error: false, msg: "" } });
        }
    };

    // function to change the value of a track
    // if the field is file, we check if the type file is accepted and if the size is less than 260Mo
    // if not, we set the error to true and the value to null ELSE we set the error to false and the value to the file
    const handleTrackChange = (index, field, value) => {
        const newMusicList = [...lstTrack];

        if (field === "file") {
            const error = value && !acceptedFormatsTrack.includes(value.type);
            const errSize = value && value.size > 260000000;
            newMusicList[index]["fileOrigin"] = {
                error: error || errSize,
                msg: error ? "This file format is not accepted" : errSize ? "the file size is greater than 260 MB" : "",
                value: error || errSize ? null : value,
            };

            // if no error and no error size, create fromdata
            if (!error && !errSize) {
                const formDataConvert = new FormData();
                formDataConvert.append("file", value);

                // call convertFile function to convert the file to mp3
                convertFile(index, newMusicList, formDataConvert);
            }
        } else {
            newMusicList[index][field] = { ...newMusicList[index][field], value: value, error: false, msg: "" };
        }

        setLstTrack(newMusicList);
        if (field === "file" && newMusicList[index][field].error) fileInputRef.current.value = null;
    };

    ///////////////////////////
    //
    // Convert File track to mp3
    //
    ///////////////////////////
    const convertFile = async (index, newMusicList, file) => {
        await axios
            .post(backendUrl + "/convertFileAudio", file, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                console.log(res.data);
                const blob = new Blob([new Uint8Array(Object.values(res.data))], { type: "audio/mpeg" });
                console.log("blob", blob);
                newMusicList[index]["fileMp3"] = { error: false, msg: "", value: blob };
            })
            .catch((err) => {
                console.log(err);
            });
    };

    ///////////////////////////
    //
    // Delete File track and Image Album
    //
    ///////////////////////////
    // function to delete a file of track
    const handleFileDelete = (index, field) => {
        const delMusicFile = [...lstTrack];
        delMusicFile[index][field] = { error: false, msg: "", value: null };
        setLstTrack(delMusicFile);
        // quand on va faire le CSS il faudra récup le div du file input pour pouvoir reset le bon file input car actuelement on reset uniquement le dernier file input
        fileInputRef.current.value = null;
    };

    // function to delete a image of album
    const handleImgDelete = (field) => {
        setAlbum({ ...album, [field]: { error: false, msg: "", value: null } });
        ImgInputRef.current.value = null;
    };

    ///////////////////////////
    //
    // Submit Form
    //
    //////////////////////////
    // create a function that will send the form data to the server
    const handleSubmit = (e) => {
        e.preventDefault();
        var errorForm = false;
        console.log("album", album);
        console.log("lstTrack", lstTrack);

        // auto complete the fields of the new track
        autoComplTrack();

        // browse the index of dictionary album and check if all fields are filled
        const newErrorAlbum = { ...album };
        for (const [key, value] of Object.entries(album)) {
            if (key !== "descr" && key !== "date_release") {
                if (!value.value || value.value.length === 0) {
                    errorForm = true;
                    newErrorAlbum[key] = { ...newErrorAlbum[key], error: true, msg: "This field is required" };
                }
            }
            setAlbum(newErrorAlbum);
        }

        // browse the list of Tracks and for each track, browse the index of dictionary and check if all fields are filled
        const newErrorTrack = [...lstTrack];
        for (let i = 0; i < lstTrack.length; i++) {
            for (const [key, value] of Object.entries(lstTrack[i])) {
                if (key !== "lyrics" && key !== "id" && key !== "date_release") {
                    if (!value.value || value.value.length === 0) {
                        errorForm = true;
                        newErrorTrack[i][key] = { ...newErrorTrack[i][key], error: true, msg: "This field is required" };
                    }
                }
            }
            setLstTrack(newErrorTrack);
        }

        console.log("album", album);
        console.log("lstTrack", lstTrack);

        // if no error, we send the form data to the server
        if (errorForm === false) {
            console.log("Formdata");

            // create a new form data
            const formData = new FormData();
            formData.append("idUser", idUser);
            formData.append("idAlbum", idAlbum);
            formData.append("title", album.title.value);
            formData.append("artist", album.artist.value);
            formData.append("file", album.image.value, album.image.value.name);
            formData.append("price", album.price.value);
            formData.append("date_release", album.date_release.value);
            formData.append("descr", album.descr.value);
            formData.append("styles", album.styles.value);

            // add the tracks data to the form data
            lstTrack.forEach((track, index) => {
                formData.append(`trackId${index + 1}`, track.id.value);
                formData.append(`trackTitle${index + 1}`, track.title.value);
                formData.append(`trackArtist${index + 1}`, track.artist.value);
                formData.append(`file`, track.fileOrigin.value, track.fileOrigin.value.name); // file origin
                formData.append(`file`, track.fileMp3.value, track.fileMp3.value.name + ".mp3"); // file convert in mp3
                formData.append(`trackPrice${index + 1}`, track.price.value);
                formData.append(`trackDate_release${index + 1}`, track.date_release.value);
                formData.append(`trackLyrics${index + 1}`, track.lyrics.value);
                formData.append(`trackNb_listens${index + 1}`, track.nb_listens.value);
            });

            console.log("formData", formData);

            // call api create album with album data and lstTrack data with axios
            axios
                .post(backendUrl + "/createAlbum", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    console.log("res", res);
                })
                .catch((err) => {
                    console.log("err", err);
                });
        }
    };

    const autoComplTrack = () => {
        // browse list of Tracks and check for index title, artist, date_release, are empty
        // if they are empty, we set listTrack with value artist, date_release of album and title with track.filename
        const newTrack = [...lstTrack];
        const i = lstTrack.length - 1;
        // for (let i = 0; i < lstTrack.length; i++) {
        if (!lstTrack[i].title.value) {
            if (lstTrack[i].fileOrigin.value) {
                newTrack[i].title = { ...newTrack[i].title, value: lstTrack[i].fileOrigin.value.name.replace(/.mp3|.flac|.wav/g, "") };
            }
        }
        if (!lstTrack[i].artist.value) {
            newTrack[i].artist = { ...newTrack[i].artist, value: album.artist.value };
        }
        if (!lstTrack[i].date_release.value) {
            newTrack[i].date_release = { ...newTrack[i].date_release, value: album.date_release.value };
        }
        // }
        setLstTrack(newTrack);
    };

    // function to add a new track to the list
    const handleAdd = () => {
        // auto complete the fields of the new track
        autoComplTrack();

        setLstTrack([
            ...lstTrack,
            {
                id: { value: lstTrack.length + 1, error: false, msg: "" },
                title: { value: "", error: false, msg: "" },
                artist: { value: "", error: false, msg: "" },
                fileOrigin: { value: null, error: false, msg: "" },
                fileMp3: { value: null, error: false, msg: "" },
                price: { value: "", error: false, msg: "" },
                date_release: { value: "", error: false, msg: "" },
                lyrics: { value: "", error: false, msg: "" },
                nb_listens: { value: lstTrack[lstTrack.length - 1].nb_listens.value, error: false, msg: "" },
            },
        ]);
    };

    return (
        <div>
            <form noValidate onSubmit={handleSubmit}>
                <AlbumAdder
                    album={album}
                    ImgInputRef={ImgInputRef}
                    handleImgDelete={(field) => handleImgDelete(field)}
                    onAlbumChange={(field, newAlbum) => handleAlbumChange(field, newAlbum)}
                />
                <br></br>
                <TracksAdder
                    lstTrack={lstTrack}
                    fileInputRef={fileInputRef}
                    handleAdd={handleAdd}
                    handleFileDelete={(index, field) => handleFileDelete(index, field)}
                    onTrackChange={(index, field, newTrack) => handleTrackChange(index, field, newTrack)}
                />
                <Button variant="contained" type="submit" color="success">
                    Create Album
                </Button>
            </form>
        </div>
    );
}

export default MusicAdder;
