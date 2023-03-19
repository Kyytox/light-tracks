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
};
