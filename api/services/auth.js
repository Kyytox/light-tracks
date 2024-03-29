import { createToken } from "./token.js";
import pool from "../Database/database.js";

// Hash bcrypt
import bcrypt from "bcryptjs";
const saltRounds = 10;

// Lnbits
import { createUserLnbits } from "../Lnbits/createUser.js";

//
//
// Sign Up / register
export const signUp = (req, res) => {
    console.log("API /signup");
    console.log("username", req.body);

    const username = req.body.username;
    const password = req.body.password;
    const topArtist = req.body.topArtist;

    // check if username exist in BD
    pool.query("SELECT * FROM users WHERE u_username = ($1)", [username], (err, result) => {
        if (err) {
            console.error("Error executing INSERT INTO:", err);
        } else {
            if (result.rowCount === 0) {
                // username not exist in Bd => insert into
                // Hash the password
                bcrypt.hash(password, saltRounds, function (err, hash) {
                    // Store hash in your password DB.
                    pool.query(
                        "INSERT INTO users (u_username, u_password) VALUES ($1,$2) RETURNING u_id, u_username",
                        [username, hash],
                        (err, result) => {
                            if (err) {
                                console.error("Error executing INSERT INTO:", err);
                            } else {
                                pool.query(
                                    "INSERT INTO profiles (p_id_user, p_username, p_top_artiste) VALUES ($1,$2, $3) RETURNING p_id_user, p_username",
                                    [result.rows[0].u_id, result.rows[0].u_username, topArtist],
                                    (err, result) => {
                                        if (err) {
                                            console.error("Error executing INSERT INTO:", err);
                                        } else {
                                            // create token
                                            const token = createToken(result.rows[0]);
                                            // createFolderUser(result.rows[0].u_id);
                                            createUserLnbits(
                                                result.rows[0].p_id_user,
                                                result.rows[0].p_username,
                                                password
                                            );
                                            res.send({
                                                succes: "SignupSuccess",
                                                id: result.rows[0].p_id_user,
                                                token: token,
                                                username: result.rows[0].p_username,
                                            });
                                        }
                                    }
                                );
                            }
                        }
                    );
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
    pool.query(
        `SELECT *
        FROM users u
        INNER JOIN profiles p ON p.p_id_user = u.u_id 
        WHERE u.u_username = $1`,
        [username],
        (err, result) => {
            if (err) {
                console.error("Error executing SELECT users:", err);
            } else {
                if (result.rowCount === 1) {
                    // user exist in BD
                    // Load hash from your password DB.
                    bcrypt.compare(password, result.rows[0].u_password, function (err, resultCrypt) {
                        console.log("err", err);
                        console.log("resultCrypt", resultCrypt);
                        if (resultCrypt === false) {
                            res.send({ errMdp: "incorrect password" });
                        } else {
                            // create token
                            console.log("result.rows[0]", result.rows[0]);
                            const token = createToken(result.rows[0]);
                            res.send({
                                succes: "LoginSuccess",
                                id: result.rows[0].u_id,
                                token: token,
                                username: result.rows[0].u_username,
                                avatar: result.rows[0].p_avatar,
                                code_currency: result.rows[0].p_code_currency,
                            });
                        }
                    });
                } else {
                    res.send({ errUsr: "Username not exist" });
                }
            }
        }
    );
};

// delete user
export const deleteUser = (req, res) => {
    console.log("API /deleteUser");
    console.log("req", req.body);

    const idUser = req.body.idUser;

    // check if username exist in BD
    pool.query("DELETE FROM profiles WHERE p_id_user = ($1)", [idUser], (err, result) => {
        if (err) {
            console.error("Error executing INSERT INTO:", err);
        } else {
            pool.query("DELETE FROM users WHERE u_id = ($1)", [idUser], (err, result) => {
                if (err) {
                    console.error("Error executing INSERT INTO:", err);
                } else {
                    res.send({ success: "User deleted" });
                }
            });
        }
    });
};
