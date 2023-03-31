import React, { useEffect, useState } from "react";
import SelectCountry from "../Forms/SelectCountry";
import SelectGenres from "../Forms/selectGenres";
import { getAxiosReq } from "../../Services/AxiosGet";
import { Button } from "@mui/material";
import FormParamTextField from "../Forms/FormParamTextField";
import FormAddTags from "../Forms/FormAddTags";

// create component for search album by style or country
function MainSearch() {
    const [lstGenres, setLstGenres] = useState([]);
    const [lstCountry, setLstCountry] = useState([]);

    const [lstParams, setLstParams] = useState({
        search: { value: "", error: false, helperText: "" },
        styles: { value: [], error: false, helperText: "" },
        tags: { value: [], error: false, helperText: "" },
        country: { value: [], error: false, helperText: "" },
    });

    useEffect(() => {
        const response = getAxiosReq("/getStylesCountryInAlbums", {});
        response.then((data) => {
            // create array with styles distinct
            const arrStyles = [];
            data.map((item) => {
                if (!arrStyles.includes(item.style)) {
                    arrStyles.push({ gm_id: item.gm_id, gm_name_genre: item.gm_name_genre });
                }
            });

            // create array with country distinct (string p_code_country)
            const arrCountries = [];
            data.forEach((item) => {
                const existingCountry = arrCountries.find((c) => c.c_code_country === item.p_code_country);
                if (!existingCountry && item.p_code_country !== null) {
                    arrCountries.push({
                        c_code_country: item.p_code_country,
                        c_name_country: item.p_name_country,
                    });
                }
            });

            setLstGenres(arrStyles);
            setLstCountry(arrCountries);
        });
    }, []);

    // change value of lstParams search
    const handleChange = (key, value) => {
        setLstParams({ ...lstParams, [key]: { value: value, error: false, helperText: "" } });
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const data = {
            search: lstParams.search.value,
            styles: lstParams.styles.value,
            tags: lstParams.tags.value,
            country: lstParams.country.value,
        };

        const response = getAxiosReq("/getSearch", data);
        response.then((data) => {
            console.log("data", data);
        });
    };

    console.log("lstParams", lstParams);

    return (
        <div>
            <form>
                {/* Textfield */}
                <FormParamTextField
                    lstParams={lstParams}
                    handleChanges={handleChange}
                    name="search"
                    label="Search"
                    placeholder="Search"
                    type="text"
                    keyVal="search"
                />

                {/* Styles */}
                <SelectGenres lstValues={lstParams} setLstValues={setLstParams} lstGenres={lstGenres} />

                {/* Tags */}
                <FormAddTags lstParams={lstParams} setLstParams={setLstParams} />

                {/* Country */}
                <SelectCountry lstParams={lstParams} setLstParams={setLstParams} lstCountries={lstCountry} />

                <Button
                    variant="contained"
                    type="submit"
                    onClick={(e) => {
                        onSubmit(e);
                    }}
                >
                    Search
                </Button>
            </form>
        </div>
    );
}

export default MainSearch;
