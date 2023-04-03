//
// database
import pool from "../Database/database.js";

//
// Follow user
export const followUser = (req, res) => {
    pool.query(
        "INSERT INTO public.follows (fo_id_user, fo_id_user_follow) VALUES ($1, $2)",
        [req.body.idUser, req.body.idUserFollow],
        (err, result) => {
            if (err) {
                console.error("Error executing INSERT:", err);
            } else {
                res.send(result.rows);
            }
        }
    );
};

//
// Unfollow user
export const unfollowUser = (req, res) => {
    pool.query(
        "DELETE FROM public.follows WHERE fo_id_user = $1 AND fo_id_user_follow = $2",
        [req.body.idUser, req.body.idUserFollow],
        (err, result) => {
            if (err) {
                console.error("Error executing DELETE:", err);
            } else {
                res.send(result.rows);
            }
        }
    );
};
