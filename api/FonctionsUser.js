import pool from "./database/database.js";

// get infos of user by id
export const getUserById = (req, res) => {
    console.log("API /getUserById");
    console.log("req.query", req.query);

    pool.query(
        `SELECT *
        FROM public.             
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
