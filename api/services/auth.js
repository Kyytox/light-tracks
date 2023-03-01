import { createToken } from "./token.js";
import pool from "../database/database.js";

import fs from "fs";
import path from "path";

// Hash bcrypt
import bcrypt from "bcryptjs";
const saltRounds = 10;

// create folder for user
function createFolderUser(idUser) {
    const dir = path.join("D:/DEV/LightTracks/api/" + idUser);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

//
//
// Sign Up / register
export const signUp = (req, res) => {
    console.log("API /signup");
    console.log("username", req.body);

    const username = req.body.username;
    const password = req.body.password;

    // check if username exist in BD
    pool.query("SELECT * FROM public.users WHERE u_username = ($1)", [username], (err, result) => {
        if (err) {
            console.error("Error executing INSERT INTO:", err);
        } else {
            if (result.rowCount === 0) {
                // username not exist in Bd => insert into
                // Hash the password
                bcrypt.hash(password, saltRounds, function (err, hash) {
                    // Store hash in your password DB.
                    console.log(`hash: ${hash}`);
                    pool.query("INSERT INTO public.users (u_username, u_password) VALUES ($1,$2)", [username, hash], (err, result) => {
                        if (err) {
                            console.error("Error executing INSERT INTO:", err);
                        } else {
                            pool.query("SELECT * FROM public.users WHERE u_username = ($1)", [username], (err, result) => {
                                if (err) {
                                    console.error("Error executing INSERT INTO:", err);
                                } else {
                                    // create token
                                    console.log("result.rows[0]", result.rows[0]);
                                    const token = createToken(result.rows[0]);
                                    // createFolderUser(result.rows[0].u_id);
                                    res.send({ succes: "SignupSuccess", id: result.rows[0].u_id, token: token, username: result.rows[0].u_username });
                                }
                            });
                        }
                    });
                });
            } else {
                res.send({ err: "Username already exist " });
            }
        }
    });
};

//
//
// Login
export const login = (req, res) => {
    console.log("API /login");
    console.log("req", req.body);

    const username = req.body.username;
    const password = req.body.password;

    // check if username exist in BD
    pool.query("SELECT * FROM public.users WHERE u_username = ($1)", [username], (err, result) => {
        if (err) {
            console.error("Error executing INSERT INTO:", err);
        } else {
            if (result.rowCount === 1) {
                // user exist in BD
                // Load hash from your password DB.
                bcrypt.compare(password, result.rows[0].password, function (err, resultCrypt) {
                    if (resultCrypt === false) {
                        res.send({ errMdp: "incorrect password" });
                    } else {
                        // create token
                        console.log("result.rows[0]", result.rows[0]);
                        const token = createToken(result.rows[0]);
                        res.send({ succes: "LoginSuccess", id: result.rows[0].u_id, token: token, username: result.rows[0].u_username });
                    }
                });
            } else {
                res.send({ errUsr: "Username not exist" });
            }
        }
    });
};
