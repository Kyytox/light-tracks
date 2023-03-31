import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

import Button from "@mui/material/Button";

import { getLocalStorage } from "../../Globals/GlobalFunctions";
import { backendUrl } from "../../Globals/GlobalVariables";
import AlbumAdder from "./AlbumAdder";
import TracksAdder from "./TracksAdder";

function MusicAdder() {
    const idUser = getLocalStorage("id");
    const username = getLocalStorage("username");
    const [idAlbum, setIdAlbum] = useState(0);
    const [album, setAlbum] = useState({
        title: { value: "", error: false, helperText: "" },
        artist: { value: username, error: false, helperText: "" },
        cover: { value: null, url: "", error: false, helperText: "" },
        price: { value: "", error: false, helperText: "" },
        descr: { value: "", error: false, helperText: "" },
        date_release: { value: "", error: false, helperText: "" },
        styles: { value: [], error: false, helperText: "" },
        tags: { value: [], error: false, helperText: "" },
        top_price: { value: true, error: false, helperText: "" },
        top_free: { value: false, error: false, helperText: "" },
        top_custom_price: { value: false, error: false, helperText: "" },
    });

    const [lstTrack, setLstTrack] = useState([
        {
            id: { value: 1, error: false, helperText: "" },
            title: { value: "", error: false, helperText: "" },
            artist: { value: "", error: false, helperText: "" },
            fileOrigin: { value: null, error: false, helperText: "" },
            fileMp3: { value: null, error: false, helperText: "" },
            price: { value: "", error: false, helperText: "" },
            date_release: { value: "", error: false, helperText: "" },
            lyrics: { value: "", error: false, helperText: "" },
            nb_listens: { value: 20, error: false, helperText: "" },
            top_price: { value: true, error: false, helperText: "" },
            top_convert: { value: false, error: false, helperText: "" },
        },
    ]);

    // state to know if the file is converting to mp3
    const [topFileConvert, setTopFileConvert] = useState(false);

    // top for Calculate Price Auto
    const [topCalculatePriceAuto, setTopCalculatePriceAuto] = useState(false);

    // ref to the file input
    const fileInputRef = useRef(null);
    const ImgInputRef = useRef(null);

    ///////////////////////////
    //
    // Get Count Album User
    //
    ///////////////////////////
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
    // Calculate Price Auto
    //
    ///////////////////////////
    useEffect(() => {
        console.log("useEffect Calculate Price Auto");

        if (topCalculatePriceAuto) {
            // calculate the price of each track
            const newTrack = [...lstTrack];
            for (let i = 0; i < lstTrack.length; i++) {
                const priceTrack = (album.price.value / lstTrack.length).toFixed(1);
                newTrack[i].price = { ...newTrack[i].price, value: priceTrack };
            }
            setLstTrack(newTrack);
        }
    }, [album.price.value, lstTrack.length, topCalculatePriceAuto]);

    ///////////////////////////
    //
    // init Price Track
    //
    ///////////////////////////
    useEffect(() => {
        console.log("useEffect init Price Track");

        // if top_free or top_custom_price = true, we set the price of each track to 0
        if (album.top_free.value || album.top_custom_price.value) {
            const newTrack = [...lstTrack];
            for (let i = 0; i < lstTrack.length; i++) {
                newTrack[i].price = {
                    ...newTrack[i].price,
                    value: 0,
                    error: false,
                    helperText: "",
                };
                newTrack[i].top_price = {
                    ...newTrack[i].top_price,
                    value: false,
                    error: false,
                    helperText: "",
                };
            }
            setLstTrack(newTrack);
        }
    }, [album.top_free.value, album.top_custom_price.value]);

    ///////////////////////////
    //
    // Convert File track to mp3
    //
    ///////////////////////////
    const convertFile = async (index, newMusicList, file) => {
        setTopFileConvert(true);
        await axios
            .post(backendUrl + "/convertFileAudio", file, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                const blob = new Blob([new Uint8Array(Object.values(res.data))], {
                    type: "audio/mpeg",
                });
                newMusicList[index]["fileMp3"] = { error: false, helperText: "", value: blob };
            })
            .catch((err) => {
                console.log(err);
            });
        setTopFileConvert(false);
    };

    ///////////////////////////
    //
    // Submit Form
    //
    //////////////////////////
    // create a function that will send the form data to the server
    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        var errorForm = false;
        console.log("album", album);
        console.log("lstTrack", lstTrack);

        // auto complete the fields of the new track
        autoComplTrack();

        //
        // check error in album
        const newErrorAlbum = { ...album };
        const infosAlbumRequired = ["title", "artist", "cover", "date_release", "styles"];

        // browse infosAlbumRequired to check if the field is empty, if it is, we add an error
        for (let i = 0; i < infosAlbumRequired.length; i++) {
            if (!album[infosAlbumRequired[i]].value || album[infosAlbumRequired[i]].value.length === 0) {
                errorForm = true;
                newErrorAlbum[infosAlbumRequired[i]] = {
                    ...newErrorAlbum[infosAlbumRequired[i]],
                    error: true,
                    helperText: "This field is required",
                };
            }
        }

        // check if top_price is true, if it is, we check if the price is empty, if it is, we add an error
        if (album.top_price.value && !album.price.value) {
            errorForm = true;
            newErrorAlbum["price"] = {
                ...newErrorAlbum["price"],
                error: true,
                helperText: "This field is required",
            };
        }
        setAlbum(newErrorAlbum);

        //
        // check error in lstTrack
        const newErrorTrack = [...lstTrack];
        const infosTrackRequired = ["title", "fileOrigin", "fileMp3", "nb_listens"];

        // browse infosTrackRequired to check if the field is empty, if it is, we add an error
        for (let i = 0; i < lstTrack.length; i++) {
            for (let j = 0; j < infosTrackRequired.length; j++) {
                if (
                    !lstTrack[i][infosTrackRequired[j]].value ||
                    lstTrack[i][infosTrackRequired[j]].value.length === 0
                ) {
                    errorForm = true;
                    newErrorTrack[i][infosTrackRequired[j]] = {
                        ...newErrorTrack[i][infosTrackRequired[j]],
                        error: true,
                        helperText: "This field is required",
                    };
                }
            }

            // check if top_price is true, if it is, we check if the price is empty, if it is, we add an error
            if (album.top_price.value === true && !lstTrack[i].price.value) {
                errorForm = true;
                newErrorTrack[i]["price"] = {
                    ...newErrorTrack[i]["price"],
                    error: true,
                    helperText: "This field is required",
                };
            }
        }

        setLstTrack(newErrorTrack);

        console.log("Post album", album);
        console.log("Post lstTrack", lstTrack);

        // collect all id in album.styles.value
        const styles = [];
        album.styles.value.forEach((style) => {
            styles.push(style.id);
        });

        // if no error, we send the form data to the server
        if (errorForm === false) {
            // create a new form data
            const formData = new FormData();
            formData.append("idUser", idUser);
            formData.append("idAlbum", idAlbum);

            // browse the album data and add it to the form data
            for (const [key, alb] of Object.entries(album)) {
                if (key === "styles") {
                    formData.append(key, [styles]);
                } else if (key === "cover") {
                    formData.append("file", alb.value, alb.value.name);
                } else {
                    formData.append(key, alb.value);
                }
            }

            // add the tracks data to the form data
            lstTrack.forEach((track, index) => {
                formData.append(`trackId${index + 1}`, track.id.value);
                formData.append(`trackTitle${index + 1}`, track.title.value);
                formData.append(`trackArtist${index + 1}`, album.artist.value);
                formData.append(`file`, track.fileOrigin.value, track.fileOrigin.value.name); // file origin
                // if file is Blob (mp3) we add it to the form data, else we convert it to mp3 and add it to the form data
                if (track.fileMp3.value instanceof Blob) {
                    formData.append(`file`, track.fileMp3.value, track.title.value + ".mp3");
                } else {
                    formData.append(`file`, track.fileMp3.value, track.fileMp3.value.name);
                }
                formData.append(`trackPrice${index + 1}`, track.price.value ? track.price.value : 0);
                formData.append(`trackDate_release${index + 1}`, track.date_release.value);
                formData.append(`trackLyrics${index + 1}`, track.lyrics.value);
                formData.append(`trackNb_listens${index + 1}`, track.nb_listens.value);
                formData.append(`trackTop_price${index + 1}`, track.top_price.value);
            });

            console.log("POST Album");
            // call api create album with album data and lstTrack data with axios
            axios
                .post(backendUrl + "/createAlbum", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: "Bearer " + token,
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

    ///////////////////////////
    //
    // Auto Complete Track Fields
    //
    ///////////////////////////
    const autoComplTrack = () => {
        // browse list of Tracks and check for index title, artist, date_release, are empty
        // if they are empty, we set listTrack with value artist, date_release of album and title with track.filename
        const newTrack = [...lstTrack];
        const i = lstTrack.length - 1;

        if (!lstTrack[i].title.value) {
            if (lstTrack[i].fileOrigin.value) {
                newTrack[i].title = {
                    ...newTrack[i].title,
                    value: lstTrack[i].fileOrigin.value.name.replace(/.mp3|.flac|.wav/g, ""),
                };
            }
        }

        // check if date_release is empty
        if (!lstTrack[i].date_release.value) {
            newTrack[i].date_release = {
                ...newTrack[i].date_release,
                value: album.date_release.value,
            };
        }
        // }
        setLstTrack(newTrack);
    };

    ///////////////////////////
    //
    // Add New Form Track
    //
    ///////////////////////////
    const handleAddFormTrack = () => {
        // auto complete the fields of the new track
        autoComplTrack();

        setLstTrack([
            ...lstTrack,
            {
                id: { value: lstTrack.length + 1, error: false, helperText: "" },
                title: { value: "", error: false, helperText: "" },
                artist: { value: "", error: false, helperText: "" },
                fileOrigin: { value: null, error: false, helperText: "" },
                fileMp3: { value: null, error: false, helperText: "" },
                price: { value: 0, error: false, helperText: "" },
                date_release: { value: "", error: false, helperText: "" },
                lyrics: { value: "", error: false, helperText: "" },
                nb_listens: {
                    value: lstTrack[lstTrack.length - 1].nb_listens.value,
                    error: false,
                    helperText: "",
                },
                top_price: {
                    value: lstTrack[lstTrack.length - 1].top_price.value,
                    error: false,
                    helperText: "",
                },
            },
        ]);
    };

    console.log("lstTrack", lstTrack);
    console.log("album", album);

    return (
        <div>
            <form noValidate onSubmit={handleSubmit}>
                <AlbumAdder
                    album={album}
                    setAlbum={setAlbum}
                    ImgInputRef={ImgInputRef}
                    topFileConvert={topFileConvert}
                />
                <br></br>
                <TracksAdder
                    lstTrack={lstTrack}
                    setLstTrack={setLstTrack}
                    fileInputRef={fileInputRef}
                    handleAddFormTrack={handleAddFormTrack}
                    topFileConvert={topFileConvert}
                    topCalculatePriceAuto={topCalculatePriceAuto}
                    setTopCalculatePriceAuto={setTopCalculatePriceAuto}
                    convertFile={convertFile}
                />
                <Button disabled={topFileConvert} variant="contained" type="submit" color="success">
                    Create Album
                </Button>
            </form>
        </div>
    );
}

export default MusicAdder;
