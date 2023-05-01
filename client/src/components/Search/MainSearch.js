import React, { useEffect, useState, useContext } from "react";
import SelectCountry from "../Forms/SelectCountry";
import SelectGenres from "../Forms/selectGenres";
import { getAxiosReq, getAxiosReqAuth } from "../../Services/AxiosGet";
import { Button } from "@mui/material";
import FormParamTextField from "../Forms/FormParamTextField";
import FormAddTags from "../Forms/FormAddTags";
import { AuthContext } from "../../Services/AuthContext";
import { getLocalStorage } from "../../Globals/GlobalFunctions";

import { useNavigate } from "react-router-dom";

// import CSS
import "./MainSearch.css";

// create component for search album by style or country
function MainSearch({ showSearchBar }) {
    const navigate = useNavigate();
    const { isLoggedIn, checkToken, idUser } = useContext(AuthContext);
    const [lstGenres, setLstGenres] = useState([]);
    const [lstCountry, setLstCountry] = useState([]);

    const [lstParams, setLstParams] = useState({
        search: { value: "", error: false, helperText: "" },
        styles: { value: [], error: false, helperText: "" },
        tags: { value: [], error: false, helperText: "" },
        country: { value: [], error: false, helperText: "" },
    });

    useEffect(() => {
        console.log("MainSearch -- showSearchBar", showSearchBar);
        if (!showSearchBar) return;

        console.log("MainSearch -- /getStylesCountryInAlbums");
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
    }, [showSearchBar]);

    // change value of lstParams search
    const handleChange = (key, value) => {
        setLstParams({ ...lstParams, [key]: { value: value, error: false, helperText: "" } });
    };

    // get albums by search
    const onSubmit = async (e) => {
        e.preventDefault();
        await checkToken();
        const token = getLocalStorage("token");

        const data = {
            idUser: idUser,
            search: lstParams.search.value,
            styles: lstParams.styles.value,
            tags: lstParams.tags.value,
            country: lstParams.country.value,
        };

        navigate(`/results?search=${data}`);

        // console.log("MainSearch -- ", isLoggedIn ? "/getSearchAuth" : "/getSearch");
        // try {
        //     const response = isLoggedIn
        //         ? await getAxiosReqAuth("/getSearchAuth", data, token)
        //         : await getAxiosReq("/getSearch", data);

        //     setLstAlbums(response);
        // } catch (error) {
        //     console.log(error);
        // }
    };

    return (
        <>
            <form className="form-search bg-neutral-700 p-8 flex flex-col w-2/4 z-10 h-max mt-14 rounded">
                {/* Textfield */}
                <div className="grid mb-6">
                    <FormParamTextField
                        lstParams={lstParams}
                        handleChanges={handleChange}
                        name="search"
                        label="Title - Artists"
                        placeholder="Search"
                        type="text"
                        keyVal="search"
                    />
                </div>
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
        </>
    );
}

export default MainSearch;
