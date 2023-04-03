import pool from "./Database/database.js";

export const getStyles = (req, res) => {
    pool.query(
        `SELECT *
        FROM public.genres_music
        ORDER BY gm_name_genre`,
        (err, result) => {
            if (err) {
                console.error("Error executing SELECT:", err);
            } else {
                res.send(result.rows);
            }
        }
    );
};

// get all genres from database in table genres_music
export const getStylesCountries = (req, res) => {
    // retrieve data of table genres_music and countries, make 2 requests, send data to client in an array
    pool.query(
        `SELECT *
        FROM public.genres_music
        ORDER BY gm_name_genre`,
        (err, result) => {
            if (err) {
                console.error("Error executing SELECT:", err);
            } else {
                const styles = result.rows;

                pool.query(
                    `SELECT *
                    FROM public.countries
                    ORDER BY c_name_country`,
                    (err, result) => {
                        if (err) {
                            console.error("Error executing SELECT:", err);
                        } else {
                            const countries = result.rows;
                            res.send({ styles, countries });
                        }
                    }
                );
            }
        }
    );
};
