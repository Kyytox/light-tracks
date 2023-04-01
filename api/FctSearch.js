import pool from "./database/database.js";

//
// get search results from database with search, styles and country
export const getSearch = (req, res) => {
    const search = req.query.search.toLowerCase();
    const styles = req.query.styles?.map((item) => item.id) ?? [];
    const tags = req.query.tags?.map((item) => `'${item}'`) ?? [];
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
            reqSQL += " or";
        }
        const reqSearch = ` (lower(a.a_title) like '%${search}%' or lower(a.a_artist) like '%${search}%')`;
        reqSQL += reqSearch;
    }

    // add tags in where clause
    if (tags) {
        if (styles.length > 0 || search) {
            reqSQL += " or";
        }
        const reqTags = ` a.a_tags && ARRAY[${tags}]::varchar[]`;
        reqSQL += reqTags;
    }

    // add country in where clause
    if (countries.length > 0) {
        if (styles.length > 0 || search || tags) {
            reqSQL += " or";
        }
        const countryValues = countries.map((item) => `'${item}'`);
        const reqCountry = ` c.c_code_country = ANY(ARRAY[${countryValues}]::text[])`;
        reqSQL += reqCountry;
    }

    console.log("reqSQL", reqSQL);

    // call database
    pool.query(reqSQL, (err, result) => {
        if (err) {
            console.error("Error executing SELECT:", err);
        } else {
            res.send(result.rows);
        }
    });
};
