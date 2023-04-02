import dotenv from "dotenv";
dotenv.config();

// Create service client module using ES6 syntax.
import { DeleteObjectCommand, DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3Client } from "./AwsS3.js";

// Set params for S3 bucket
const bucketName = process.env.AWS_BUCKET_NAME;

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
    const folderPath = "uploads/" + req.body.idUser + "/" + req.body.idAlbumUser + "/tracks/";
    const data = await getAllObjectsInFolderS3(folderPath);

    // delete all tracks in folder
    console.log("delete all tracks in folder");
    await deleteAllObjectsInFolderS3(data);

    // delete folder
    console.log("delete folder");
    const delPathFolder = "uploads/" + req.body.idUser + "/" + req.body.idAlbumUser + "/";
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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
        console.log("Error", err);
    }
};
