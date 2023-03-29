import pool from "./database/database.js";

//
// get search results from database with search, styles and country
export const getSearch = (req, res) => {
    console.log("API /getSearch");
    const search = req.query.search.toLowerCase();
    const styles = req.query.styles?.map((item) => item.id) ?? [];
    const countries = req.query.country?.map((item) => item.c_code_country) ?? [];

    var reqSQL = "select * from albums a";

    // oint tables profiles and countries
    if (countries.length > 0) {
        const reqCountry = ` join profiles p on a.a_id_user = p.p_id_user join countries c on c.c_code_country = p.p_code_country`;
        reqSQL += reqCountry;
    }

    reqSQL += " where";

    // add stylesin where clause
    if (styles.length > 0) {
        const reqStyles = ` a.a_styles && ARRAY[${styles}]`;
        reqSQL += reqStyles;
    }

    // add search in where clause
    if (search) {
        if (styles.length > 0) {
            reqSQL += " and";
        }
        const reqSearch = ` (lower(a.a_title) like '%${search}%' or lower(a.a_artist) like '%${search}%')`;
        reqSQL += reqSearch;
    }

    // add country in where clause
    if (countries.length > 0) {
        if (styles.length > 0 || search) {
            reqSQL += " and";
        }
        const countryValues = countries.map((item) => `'${item}'`);
        const reqCountry = ` c.c_code_country = ANY(ARRAY[${countryValues}]::text[])`;
        reqSQL += reqCountry;
    }

    // call database
    pool.query(reqSQL, (err, result) => {
        if (err) {
            console.error("Error executing SELECT:", err);
        } else {
            res.send(result.rows);
        }
    });
};
