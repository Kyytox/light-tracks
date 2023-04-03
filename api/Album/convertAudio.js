import { v4 as uuidv4 } from "uuid";
// ffmpeg.wasm
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const FFmpegCoreLocation = "/media/kytox/Jeux/DEV/LightTracks/api/node_modules/@ffmpeg/core/dist/ffmpeg-core.js";

const FFmpegWasmLocation = "/media/kytox/Jeux/DEV/LightTracks/api/node_modules/@ffmpeg/core/dist/ffmpeg-core.wasm";

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
        log: true,
        logger: ({ message }) => console.log(message),
        progress: (p) => console.log(p),
    });

    ffmpeg.setLogger(({ type, message }) => {
        console.log("logger", type, message);
    });

    ffmpeg.setProgress(({ ratio }) => {
        console.log("progress", ratio);
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
    const extension = originalName.split(".").slice(-1)[0];
    return `${uuidv4().slice(0, 8)}-${uniqueSuffix.slice(0, 12)}.${extension}`;
};
