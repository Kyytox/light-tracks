import pool from "./database/database.js";


// get infos of user by id
export const getUserById = (req, res) => {
    console.log("API /getUserById");
    console.log("req.query", req.query);

    pool.query(
        `SELECT u_id, u_username, u_avatar, u_bio, u_code_country, u_name_country
        FROM public.users 
        WHERE u_id = $1`,
        [req.query.idUser],
        (err, result) => {
            if (err) {
                console.error("Error executing SELECT:", err);
            } else {
                res.send(result.rows);
            }
        }
    );
}


// update user infos
export const updateUser = (req, res) => {
    console.log("API /updateUser");
    console.log("req.body", req.body);

    // update user infos
    pool.query(
        `UPDATE public.users 
        SET u_avatar = $1, 
        u_bio = $2, 
        u_email = $3, 
        u_code_country = $4, 
        u_name_country = $5 
        WHERE u_id = $6`,
        [req.body.avatar, req.body.bio, req.body.email, req.body.code_country, req.body.country, req.body.id],
        (err, result) => {
            if (err) {
                console.error("Error executing UPDATE:", err);
            } else {
                res.send({ succes: "User updated" });
            }
        }
    );
}