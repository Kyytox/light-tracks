import pool from "./database/database.js";

// get infos of user by id
export const getUserById = (req, res) => {
    pool.query(
        `SELECT *
        FROM profiles     
        WHERE p_id_user = $1`,
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
