import dotenv from "dotenv";
dotenv.config();

// Create service client module using ES6 syntax.
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand,DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Set params for S3 bucket
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// Create an Amazon S3 service client object.
export const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

// Get audio file stream from S3 bucket
export const getAudioFileStream = async (req, res) => {
    const filename = req.body.data;
    const filenameEnd = "uploads/test.mp3";
    const params = {
        Bucket: bucketName,
        Key: filename,
    };

    // // Create a command to get a signed URL for the object
    // const command = new GetObjectCommand(params);
    // const seconds = 60;
    // const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });
    // return url before ? because after ? is token and data confidencial
    // res.send(url.split("?")[0]);
};


// delete album in S3 bucket
export const deleteAlbumInS3 = async (req, res) => {
    console.log("deleteAlbumInS3");
    console.log(req.body);


    //  delete cover album 
    console.log("delete cover album");
    const coverPath = req.body.coverPath;
    await deleteObjectsInS3(coverPath);

    // get all tracks in folder
    console.log("get all tracks in folder");
    const folderPath = "uploads/"+ req.body.idUser +"/"+ req.body.idAlbumUser +"/tracks/";
    const data = await getAllObjectsInFolderS3(folderPath);

    // delete all tracks in folder
    console.log("delete all tracks in folder");
    await deleteAllObjectsInFolderS3(data);


    // delete folder
    console.log("delete folder");
    const delPathFolder = "uploads/"+ req.body.idUser +"/"+ req.body.idAlbumUser +"/";
    await deleteFolderInS3(delPathFolder);
    
};



// delete Objects in S3 bucket
export const deleteObjectsInS3 = async (req, res) => {
    const paramsDelImg = {
        Bucket: bucketName,
        Key: req,
    };

    try {
        const data = await s3Client.send(new DeleteObjectCommand(paramsDelImg));
        console.log("Success del Object", data);
    }
    catch (err) {
        console.log("Error", err);
    }
};


// get all objects in folder S3 bucket
export const getAllObjectsInFolderS3 = async (req, res) => {
    //  with aws s3 v3 sdk we can't delete folder no empty
    // retrieve all tracks from folder aws s3
    const paramsGetFiles = {
        Bucket: bucketName,
        Prefix: req,
    };
    
    try {
        const data = await s3Client.send(new ListObjectsV2Command(paramsGetFiles));
        console.log("Success get files", data.Contents);
        return data.Contents;
    }
    catch (err) {
        console.log("Error", err);
    }

};

// delete all objects in folder S3 bucket
export const deleteAllObjectsInFolderS3 = async (req, res) => {
    // delete all tracks from folder aws s3

    if (req === undefined || req.length === 0) {
        console.log("No files to delete");
        return;
    }

    const paramsDelFiles = {
        Bucket: bucketName,
        Delete: {
            Objects: req.map((file) => ({ Key: file.Key })),
        },
    };


    try {
        const data = await s3Client.send(new DeleteObjectsCommand(paramsDelFiles));
        console.log("Success del files ", data);
    }
    catch (err) {
        console.log("Error", err);
    }
};



// delete Folder in S3 bucket
export const deleteFolderInS3 = async (req, res) => {
    // delete folder aws s3
    const paramsDelFolder = {
        Bucket: bucketName,
        Key: req,
    };

    try {
        const data = await s3Client.send(new DeleteObjectCommand(paramsDelFolder));
        console.log("Success del folder", data);
    }
    catch (err) {
        console.log("Error", err);
    }
};
