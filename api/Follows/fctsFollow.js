import pool from "../Database/database.js";

export const getFollows = (req, res) => {
    pool.query(
        `SELECT *
        FROM public.follows, public.profiles 
        WHERE fo_id_user = $1
        AND p_id_user = fo_id_user_follow`,
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

// get follows by user id and id of user to follow
export const getFollowsByIdUser = (req, res) => {
    pool.query(
        "SELECT * FROM public.follows WHERE fo_id_user = $1 AND fo_id_user_follow = $2",
        [req.query.idUser, req.query.idUserFollow],
        (err, result) => {
            if (err) {
                console.error("Error executing SELECT:", err);
            } else {
                res.send(result.rows);
            }
        }
    );
};
