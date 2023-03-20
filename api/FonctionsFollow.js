import pool from "./database/database.js";

export const getFollows = (req, res) => {
    console.log("API /getFollows");
    console.log("req.query", req.query);

    pool.query(
        `SELECT fo_id_user, fo_id_user_follow, fo_date_follow, u_id, u_username, u_avatar, u_code_country, u_name_country
        FROM public.follows, public.users 
        WHERE fo_id_user = $1
        AND u_id = fo_id_user_follow`,
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
    console.log("API /getFollowsByIdUser");
    console.log("req.query", req.query);

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

export const followUser = (req, res) => {
    console.log("API /followUser");
    console.log("req.body", req.body);

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

export const unfollowUser = (req, res) => {
    console.log("API /unfollowUser");
    console.log("req.body", req.body);

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
