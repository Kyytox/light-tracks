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

// update user infos
export const updateUser = (req, res) => {
    console.log("API /updateUser");
    console.log("req.body", req.body);

    // create text for update
    var textUpdate = "UPDATE public.users SET ";
    for (const [key, value] of Object.entries(req.body)) {
        if (key !== "id") {
            console.log(`${key}: ${value}`);
            if (value !== "") {
                textUpdate += `u_${key} = '${value}', `;
            }
        }
    }

    textUpdate = textUpdate.slice(0, -2); // remove the last comma and space
    textUpdate += ` WHERE u_id = ${req.body.id}`;

    console.log("textUpdate", textUpdate);

    // update user infos
    pool.query(textUpdate, [], (err, result) => {
        if (err) {
            console.error("Error executing UPDATE:", err);
        } else {
            res.send({ succes: "User updated" });
        }
    });
};
